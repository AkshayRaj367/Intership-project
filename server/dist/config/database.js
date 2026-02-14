"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDatabase = exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("@/utils/logger");
const connectDatabase = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI environment variable is not defined');
        }
        const options = {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            bufferCommands: false,
            bufferMaxEntries: 0,
        };
        const conn = await mongoose_1.default.connect(mongoUri, options);
        logger_1.logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
        mongoose_1.default.connection.on('error', (error) => {
            logger_1.logger.error('❌ MongoDB connection error:', error);
        });
        mongoose_1.default.connection.on('disconnected', () => {
            logger_1.logger.warn('⚠️ MongoDB disconnected');
        });
        mongoose_1.default.connection.on('reconnected', () => {
            logger_1.logger.info('🔄 MongoDB reconnected');
        });
    }
    catch (error) {
        logger_1.logger.error('❌ Failed to connect to MongoDB:', error);
        process.exit(1);
    }
};
exports.connectDatabase = connectDatabase;
const disconnectDatabase = async () => {
    try {
        await mongoose_1.default.connection.close();
        logger_1.logger.info('✅ MongoDB connection closed');
    }
    catch (error) {
        logger_1.logger.error('❌ Error closing MongoDB connection:', error);
    }
};
exports.disconnectDatabase = disconnectDatabase;
process.on('SIGTERM', async () => {
    logger_1.logger.info('🔄 SIGTERM received, closing MongoDB connection...');
    await (0, exports.disconnectDatabase)();
    process.exit(0);
});
process.on('SIGINT', async () => {
    logger_1.logger.info('🔄 SIGINT received, closing MongoDB connection...');
    await (0, exports.disconnectDatabase)();
    process.exit(0);
});
//# sourceMappingURL=database.js.map