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
exports.validateWithCustom = exports.customValidators = exports.schemas = exports.validate = void 0;
const joi_1 = __importDefault(require("joi"));
const logger_1 = require("@/utils/logger");
const validate = (schema, property = 'body') => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[property], {
            abortEarly: false,
            stripUnknown: true,
            convert: true
        });
        if (error) {
            const validationErrors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message,
                value: detail.context?.value
            }));
            logger_1.logger.warn('Validation failed:', {
                url: req.url,
                method: req.method,
                errors: validationErrors,
                input: req[property]
            });
            res.status(400).json({
                success: false,
                error: {
                    message: 'Validation failed',
                    code: 'VALIDATION_ERROR',
                    details: validationErrors
                }
            });
            return;
        }
        req[property] = value;
        next();
    };
};
exports.validate = validate;
exports.schemas = {
    contactForm: joi_1.default.object({
        name: joi_1.default.string()
            .trim()
            .min(2)
            .max(100)
            .required()
            .messages({
            'string.empty': 'Name is required',
            'string.min': 'Name must be at least 2 characters long',
            'string.max': 'Name cannot exceed 100 characters',
            'any.required': 'Name is required'
        }),
        email: joi_1.default.string()
            .trim()
            .email()
            .required()
            .messages({
            'string.empty': 'Email is required',
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),
        subject: joi_1.default.string()
            .trim()
            .valid('general', 'demo', 'support', 'partnership')
            .default('general')
            .messages({
            'any.only': 'Subject must be one of: general, demo, support, partnership'
        }),
        message: joi_1.default.string()
            .trim()
            .min(10)
            .max(1000)
            .required()
            .messages({
            'string.empty': 'Message is required',
            'string.min': 'Message must be at least 10 characters long',
            'string.max': 'Message cannot exceed 1000 characters',
            'any.required': 'Message is required'
        }),
        newsletter: joi_1.default.boolean()
            .default(false)
    }),
    pagination: joi_1.default.object({
        page: joi_1.default.number()
            .integer()
            .min(1)
            .default(1)
            .messages({
            'number.base': 'Page must be a number',
            'number.integer': 'Page must be an integer',
            'number.min': 'Page must be at least 1'
        }),
        limit: joi_1.default.number()
            .integer()
            .min(1)
            .max(100)
            .default(10)
            .messages({
            'number.base': 'Limit must be a number',
            'number.integer': 'Limit must be an integer',
            'number.min': 'Limit must be at least 1',
            'number.max': 'Limit cannot exceed 100'
        }),
        sort: joi_1.default.string()
            .optional()
            .pattern(/^-?[a-zA-Z_]+$/)
            .messages({
            'string.pattern.base': 'Sort field must be a valid field name, optionally prefixed with - for descending order'
        }),
        fields: joi_1.default.string()
            .optional()
            .pattern(/^[a-zA-Z_]+(,[a-zA-Z_]+)*$/)
            .messages({
            'string.pattern.base': 'Fields must be comma-separated field names'
        })
    }),
    objectId: joi_1.default.object({
        id: joi_1.default.string()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .required()
            .messages({
            'string.pattern.base': 'Invalid ID format',
            'any.required': 'ID is required'
        })
    }),
    userUpdate: joi_1.default.object({
        name: joi_1.default.string()
            .trim()
            .min(2)
            .max(100)
            .optional()
            .messages({
            'string.min': 'Name must be at least 2 characters long',
            'string.max': 'Name cannot exceed 100 characters'
        }),
        email: joi_1.default.string()
            .trim()
            .email()
            .optional()
            .messages({
            'string.email': 'Please provide a valid email address'
        }),
        role: joi_1.default.string()
            .valid('user', 'admin')
            .optional()
            .messages({
            'any.only': 'Role must be either user or admin'
        }),
        isActive: joi_1.default.boolean()
            .optional()
    }),
    contactStatusUpdate: joi_1.default.object({
        status: joi_1.default.string()
            .valid('new', 'read', 'replied', 'archived')
            .required()
            .messages({
            'any.only': 'Status must be one of: new, read, replied, archived',
            'any.required': 'Status is required'
        }),
        isRead: joi_1.default.boolean()
            .optional()
    }),
    emailSend: joi_1.default.object({
        to: joi_1.default.string()
            .trim()
            .email()
            .required()
            .messages({
            'string.empty': 'Recipient email is required',
            'string.email': 'Please provide a valid email address',
            'any.required': 'Recipient email is required'
        }),
        subject: joi_1.default.string()
            .trim()
            .min(1)
            .max(200)
            .required()
            .messages({
            'string.empty': 'Subject is required',
            'string.min': 'Subject cannot be empty',
            'string.max': 'Subject cannot exceed 200 characters',
            'any.required': 'Subject is required'
        }),
        html: joi_1.default.string()
            .trim()
            .min(1)
            .required()
            .messages({
            'string.empty': 'HTML content is required',
            'string.min': 'HTML content cannot be empty',
            'any.required': 'HTML content is required'
        }),
        text: joi_1.default.string()
            .trim()
            .optional()
    })
};
exports.customValidators = {
    uniqueEmail: async (email, excludeId) => {
        const { User } = await Promise.resolve().then(() => __importStar(require('@/models/User.model')));
        const query = { email: email.toLowerCase() };
        if (excludeId) {
            query._id = { $ne: excludeId };
        }
        const existingUser = await User.findOne(query);
        return !existingUser;
    },
    contactRateLimit: async (email) => {
        const { Contact } = await Promise.resolve().then(() => __importStar(require('@/models/Contact.model')));
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const recentSubmissions = await Contact.countDocuments({
            email: email.toLowerCase(),
            createdAt: { $gte: oneHourAgo }
        });
        return recentSubmissions < 3;
    }
};
const validateWithCustom = (schema, property = 'body', customValidators) => {
    return async (req, res, next) => {
        const { error, value } = schema.validate(req[property], {
            abortEarly: false,
            stripUnknown: true,
            convert: true
        });
        if (error) {
            const validationErrors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message,
                value: detail.context?.value
            }));
            res.status(400).json({
                success: false,
                error: {
                    message: 'Validation failed',
                    code: 'VALIDATION_ERROR',
                    details: validationErrors
                }
            });
            return;
        }
        if (customValidators) {
            try {
                for (const validator of customValidators) {
                    const isValid = await validator();
                    if (!isValid) {
                        res.status(400).json({
                            success: false,
                            error: {
                                message: 'Custom validation failed',
                                code: 'CUSTOM_VALIDATION_ERROR'
                            }
                        });
                        return;
                    }
                }
            }
            catch (error) {
                logger_1.logger.error('Custom validation error:', error);
                res.status(500).json({
                    success: false,
                    error: {
                        message: 'Validation error occurred',
                        code: 'VALIDATION_SYSTEM_ERROR'
                    }
                });
                return;
            }
        }
        req[property] = value;
        next();
    };
};
exports.validateWithCustom = validateWithCustom;
//# sourceMappingURL=validation.middleware.js.map