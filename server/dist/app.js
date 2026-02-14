"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const passport_1 = __importDefault(require("passport"));
const session = __importStar(require("express-session"));
const mongoose_1 = __importDefault(require("mongoose"));
const database_1 = require("./config/database");
const security_middleware_1 = require("./middlewares/security.middleware");
const logger_1 = require("./utils/logger");
const contact_routes_1 = __importDefault(require("./routes/contact.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
dotenv_1.default.config();
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }
    initializeMiddlewares() {
        this.app.use((0, morgan_1.default)('combined', { stream: logger_1.morganStream }));
        this.app.use(security_middleware_1.securityMiddleware);
        this.app.use((0, cors_1.default)(security_middleware_1.corsConfig));
        this.app.use(express_1.default.json({ limit: '10mb' }));
        this.app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
        this.app.use((0, cookie_parser_1.default)());
        this.app.use(session({
            secret: process.env.SESSION_SECRET || 'fallback-secret-change-in-production',
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: process.env.NODE_ENV === 'production',
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            }
        }));
        this.app.use(passport_1.default.initialize());
        this.app.use(passport_1.default.session());
        this.app.use(security_middleware_1.requestLogger);
    }
    initializeRoutes() {
        this.app.get('/api/health', this.healthCheck);
        this.app.use('/api/contact', contact_routes_1.default);
        this.app.use('/api/auth', auth_routes_1.default);
        this.app.get('/api', (req, res) => {
            res.status(200).json({
                success: true,
                message: 'TechFlow API is running',
                version: '1.0.0',
                timestamp: new Date().toISOString()
            });
        });
        this.app.use('/api/*', (req, res) => {
            res.status(404).json({
                success: false,
                error: {
                    message: 'API endpoint not found',
                    code: 'ENDPOINT_NOT_FOUND'
                }
            });
        });
    }
    initializeErrorHandling() {
        this.app.use((error, req, res, next) => {
            logger_1.logger.error('Unhandled error:', {
                error: error.message,
                stack: error.stack,
                url: req.url,
                method: req.method,
                ip: req.ip,
                userAgent: req.get('User-Agent')
            });
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
        this.app.use('*', (req, res) => {
            res.status(404).json({
                success: false,
                error: {
                    message: 'Route not found',
                    code: 'ROUTE_NOT_FOUND'
                }
            });
        });
    }
    async healthCheck(req, res) {
        try {
            const startTime = Date.now();
            let databaseStatus = 'disconnected';
            let databaseResponseTime = 0;
            try {
                if (mongoose_1.default.connection.readyState === 1) {
                    databaseStatus = 'connected';
                    databaseResponseTime = Date.now() - startTime;
                }
            }
            catch (dbError) {
                logger_1.logger.error('Database health check failed:', dbError);
            }
            const healthData = {
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
            const isHealthy = databaseStatus === 'connected';
            const statusCode = isHealthy ? 200 : 503;
            res.status(statusCode).json(healthData);
        }
        catch (error) {
            logger_1.logger.error('Health check failed:', error);
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
    async initialize() {
        try {
            await (0, database_1.connectDatabase)();
            logger_1.logger.info('🚀 Application initialized successfully');
        }
        catch (error) {
            logger_1.logger.error('❌ Failed to initialize application:', error);
            process.exit(1);
        }
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map