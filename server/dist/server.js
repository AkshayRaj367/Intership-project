"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const logger_1 = require("@/utils/logger");
const database_1 = require("@/config/database");
dotenv_1.default.config();
const app = new app_1.default();
const startServer = async () => {
    try {
        await app.initialize();
        const PORT = process.env.PORT || 5000;
        const server = app.app.listen(PORT, () => {
            logger_1.logger.info(`🚀 Server is running on port ${PORT}`);
            logger_1.logger.info(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
            logger_1.logger.info(`🔗 API Base URL: http://localhost:${PORT}/api`);
            logger_1.logger.info(`🏥 Health Check: http://localhost:${PORT}/api/health`);
            logger_1.logger.info(`📚 API Documentation: http://localhost:${PORT}/api`);
        });
        server.on('error', (error) => {
            if (error.syscall !== 'listen') {
                throw error;
            }
            const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;
            switch (error.code) {
                case 'EACCES':
                    logger_1.logger.error(`❌ ${bind} requires elevated privileges`);
                    process.exit(1);
                    break;
                case 'EADDRINUSE':
                    logger_1.logger.error(`❌ ${bind} is already in use`);
                    process.exit(1);
                    break;
                default:
                    throw error;
            }
        });
        const gracefulShutdown = async (signal) => {
            logger_1.logger.info(`🔄 ${signal} received, shutting down gracefully...`);
            server.close(async () => {
                logger_1.logger.info('✅ HTTP server closed');
                try {
                    await (0, database_1.disconnectDatabase)();
                    logger_1.logger.info('✅ Database connections closed');
                    process.exit(0);
                }
                catch (error) {
                    logger_1.logger.error('❌ Error during database disconnection:', error);
                    process.exit(1);
                }
            });
            setTimeout(() => {
                logger_1.logger.error('❌ Forced shutdown due to timeout');
                process.exit(1);
            }, 10000);
        };
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
        process.on('uncaughtException', (error) => {
            logger_1.logger.error('❌ Uncaught Exception:', error);
            gracefulShutdown('uncaughtException');
        });
        process.on('unhandledRejection', (reason, promise) => {
            logger_1.logger.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
            gracefulShutdown('unhandledRejection');
        });
    }
    catch (error) {
        logger_1.logger.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};
startServer().catch((error) => {
    logger_1.logger.error('❌ Server startup failed:', error);
    process.exit(1);
});
//# sourceMappingURL=server.js.map