"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_model_1 = require("@/models/User.model");
const logger_1 = require("@/utils/logger");
const authenticate = async (req, res, next) => {
    try {
        let token = null;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.substring(7);
        }
        if (!token && req.cookies && req.cookies.jwt) {
            token = req.cookies.jwt;
        }
        if (!token) {
            res.status(401).json({
                success: false,
                error: {
                    message: 'Access token is required',
                    code: 'TOKEN_MISSING'
                }
            });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await User_model_1.User.findById(decoded.userId);
        if (!user || !user.isActive) {
            res.status(401).json({
                success: false,
                error: {
                    message: 'Invalid or inactive user',
                    code: 'USER_INVALID'
                }
            });
            return;
        }
        req.user = {
            ...user.toObject(),
            _id: user._id.toString()
        };
        next();
    }
    catch (error) {
        logger_1.logger.error('Authentication error:', error);
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(401).json({
                success: false,
                error: {
                    message: 'Invalid token',
                    code: 'TOKEN_INVALID'
                }
            });
            return;
        }
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            res.status(401).json({
                success: false,
                error: {
                    message: 'Token expired',
                    code: 'TOKEN_EXPIRED'
                }
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: {
                message: 'Authentication failed',
                code: 'AUTH_ERROR'
            }
        });
    }
};
exports.authenticate = authenticate;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                error: {
                    message: 'Authentication required',
                    code: 'AUTH_REQUIRED'
                }
            });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                error: {
                    message: 'Insufficient permissions',
                    code: 'INSUFFICIENT_PERMISSIONS'
                }
            });
            return;
        }
        next();
    };
};
exports.authorize = authorize;
const optionalAuth = async (req, res, next) => {
    try {
        let token = null;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.substring(7);
        }
        if (!token && req.cookies && req.cookies.jwt) {
            token = req.cookies.jwt;
        }
        if (token) {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const user = await User_model_1.User.findById(decoded.userId);
            if (user && user.isActive) {
                req.user = user.toObject();
            }
        }
        next();
    }
    catch (error) {
        logger_1.logger.debug('Optional authentication failed:', error);
        next();
    }
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.middleware.js.map