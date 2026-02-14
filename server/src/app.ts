import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import passport from 'passport';
import * as session from 'express-session';
import mongoose from 'mongoose';

import { connectDatabase } from './config/database';
import { securityMiddleware, requestLogger, corsConfig } from './middlewares/security.middleware';
import { logger, morganStream } from './utils/logger';
import { IHealthCheck } from './types';

// Routes
import contactRoutes from './routes/contact.routes';
import authRoutes from './routes/auth.routes';

// Load environment variables
dotenv.config();

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Request logging
    this.app.use(morgan('combined', { stream: morganStream }));

    // Security middleware
    this.app.use(securityMiddleware);

    // CORS configuration
    this.app.use(cors(corsConfig));

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Cookie parsing
    this.app.use(cookieParser());

    // Session configuration for Passport
    this.app.use((session as any)({
      secret: process.env.SESSION_SECRET || 'fallback-secret-change-in-production',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      }
    }));

    // Passport initialization
    this.app.use(passport.initialize());
    this.app.use(passport.session());

    // Request logging middleware
    this.app.use(requestLogger);
  }

  private initializeRoutes(): void {
    // Health check endpoint
    this.app.get('/api/health', this.healthCheck);

    // API routes
    this.app.use('/api/contact', contactRoutes);
    this.app.use('/api/auth', authRoutes);

    // Root endpoint
    this.app.get('/api', (req: Request, res: Response) => {
      res.status(200).json({
        success: true,
        message: 'TechFlow API is running',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      });
    });

    // 404 handler for API routes
    this.app.use('/api/*', (req: Request, res: Response) => {
      res.status(404).json({
        success: false,
        error: {
          message: 'API endpoint not found',
          code: 'ENDPOINT_NOT_FOUND'
        }
      });
    });
  }

  private initializeErrorHandling(): void {
    // Global error handler
    this.app.use((error: any, req: Request, res: Response, next: NextFunction) => {
      logger.error('Unhandled error:', {
        error: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      // Don't send error details in production
      const isDevelopment = process.env.NODE_ENV === 'development';

      res.status(error.status || 500).json({
        success: false,
        error: {
          message: error.message || 'Internal server error',
          code: error.code || 'INTERNAL_ERROR',
          ...(isDevelopment && { stack: error.stack })
        }
      });
    });

    // 404 handler for non-API routes
    this.app.use('*', (req: Request, res: Response) => {
      res.status(404).json({
        success: false,
        error: {
          message: 'Route not found',
          code: 'ROUTE_NOT_FOUND'
        }
      });
    });
  }

  private async healthCheck(req: Request, res: Response): Promise<void> {
    try {
      const startTime = Date.now();
      
      // Check database connection
      let databaseStatus = 'disconnected';
      let databaseResponseTime = 0;
      
      try {
        if (mongoose.connection.readyState === 1) {
          databaseStatus = 'connected';
          databaseResponseTime = Date.now() - startTime;
        }
      } catch (dbError) {
        logger.error('Database health check failed:', dbError);
      }

      const healthData: IHealthCheck = {
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        uptime: process.uptime(),
        version: '1.0.0',
        database: {
          status: databaseStatus,
          responseTime: databaseResponseTime
        }
      };

      // Determine overall health status
      const isHealthy = databaseStatus === 'connected';
      const statusCode = isHealthy ? 200 : 503;

      res.status(statusCode).json(healthData);

    } catch (error) {
      logger.error('Health check failed:', error);
      res.status(503).json({
        success: false,
        message: 'Health check failed',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        uptime: process.uptime(),
        version: '1.0.0'
      });
    }
  }

  public async initialize(): Promise<void> {
    try {
      // Connect to database
      await connectDatabase();
      
      logger.info('🚀 Application initialized successfully');
      
    } catch (error) {
      logger.error('❌ Failed to initialize application:', error);
      process.exit(1);
    }
  }
}

export default App;
