"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = exports.securityMiddleware = exports.corsConfig = exports.authRateLimiter = exports.rateLimiter = void 0;
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const hpp_1 = __importDefault(require("hpp"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const logger_1 = require("@/utils/logger");
exports.rateLimiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: {
        success: false,
        error: {
            message: 'Too many requests from this IP, please try again later.',
            code: 'RATE_LIMIT_EXCEEDED'
        }
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger_1.logger.warn(`Rate limit exceeded for IP: ${req.ip}, Path: ${req.path}`);
        res.status(429).json({
            success: false,
            error: {
                message: 'Too many requests from this IP, please try again later.',
                code: 'RATE_LIMIT_EXCEEDED'
            }
        });
    }
});
exports.authRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        error: {
            message: 'Too many authentication attempts, please try again later.',
            code: 'AUTH_RATE_LIMIT_EXCEEDED'
        }
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger_1.logger.warn(`Auth rate limit exceeded for IP: ${req.ip}, Path: ${req.path}`);
        res.status(429).json({
            success: false,
            error: {
                message: 'Too many authentication attempts, please try again later.',
                code: 'AUTH_RATE_LIMIT_EXCEEDED'
            }
        });
    }
});
exports.corsConfig = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
exports.securityMiddleware = [
    (0, helmet_1.default)({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", "data:", "https:"],
                connectSrc: ["'self'"],
                fontSrc: ["'self'"],
                objectSrc: ["'none'"],
                mediaSrc: ["'self'"],
                frameSrc: ["'none'"]
            }
        },
        hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true
        }
    }),
    (0, cors_1.default)(exports.corsConfig),
    exports.rateLimiter,
    (0, compression_1.default)(),
    (0, express_mongo_sanitize_1.default)(),
    (0, hpp_1.default)(),
    (req, res, next) => {
        if (req.body) {
            for (const key in req.body) {
                if (typeof req.body[key] === 'string') {
                    req.body[key] = req.body[key].replace(/<script[^>]*>/gi, '');
                }
            }
        }
        next();
    }
];
const requestLogger = (req, res, next) => {
    const start = Date.now();
    const { method, url, ip } = req;
    res.on('finish', () => {
        const duration = Date.now() - start;
        const { statusCode } = res;
        logger_1.logger.info('HTTP Request', {
            method,
            url,
            ip,
            statusCode,
            duration: `${duration}ms`,
            userAgent: req.get('User-Agent'),
            contentLength: res.get('Content-Length')
        });
    });
    next();
};
exports.requestLogger = requestLogger;
//# sourceMappingURL=security.middleware.js.map