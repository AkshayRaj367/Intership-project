import dotenv from 'dotenv';
import App from './app';
import { logger } from '@/utils/logger';
import { disconnectDatabase } from '@/config/database';

// Load environment variables
dotenv.config();

// Create and initialize the application
const app = new App();

// Start the server
const startServer = async (): Promise<void> => {
  try {
    // Initialize the application (connects to database, sets up middleware, etc.)
    await app.initialize();

    const PORT = process.env.PORT || 5000;
    const server = app.app.listen(PORT, () => {
      logger.info(`🚀 Server is running on port ${PORT}`);
      logger.info(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🔗 API Base URL: http://localhost:${PORT}/api`);
      logger.info(`🏥 Health Check: http://localhost:${PORT}/api/health`);
      logger.info(`📚 API Documentation: http://localhost:${PORT}/api`);
    });

    // Handle server errors
    server.on('error', (error: any) => {
      if (error.syscall !== 'listen') {
        throw error;
      }

      const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;

      switch (error.code) {
        case 'EACCES':
          logger.error(`❌ ${bind} requires elevated privileges`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          logger.error(`❌ ${bind} is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    });

    // Graceful shutdown handlers
    const gracefulShutdown = async (signal: string) => {
      logger.info(`🔄 ${signal} received, shutting down gracefully...`);
      
      server.close(async () => {
        logger.info('✅ HTTP server closed');
        
        try {
          await disconnectDatabase();
          logger.info('✅ Database connections closed');
          process.exit(0);
        } catch (error) {
          logger.error('❌ Error during database disconnection:', error);
          process.exit(1);
        }
      });

      // Force close after 10 seconds
      setTimeout(() => {
        logger.error('❌ Forced shutdown due to timeout');
        process.exit(1);
      }, 10000);
    };

    // Handle process signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('❌ Uncaught Exception:', error);
      gracefulShutdown('uncaughtException');
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
      gracefulShutdown('unhandledRejection');
    });

  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer().catch((error) => {
  logger.error('❌ Server startup failed:', error);
  process.exit(1);
});
