import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { IApiResponse, IValidationError } from '@/types';
import { logger } from '@/utils/logger';

// Validation middleware factory
export const validate = (schema: Joi.ObjectSchema, property: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      const validationErrors: IValidationError[] = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      logger.warn('Validation failed:', {
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
      } as IApiResponse);
      return;
    }

    // Replace the request property with the validated and sanitized data
    req[property] = value;
    next();
  };
};

// Common validation schemas
export const schemas = {
  // User registration validation
  register: Joi.object({
    name: Joi.string()
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
    email: Joi.string()
      .trim()
      .email()
      .required()
      .messages({
        'string.empty': 'Email is required',
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string()
      .min(6)
      .max(128)
      .required()
      .messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters long',
        'string.max': 'Password cannot exceed 128 characters',
        'any.required': 'Password is required'
      })
  }),

  // User login validation
  login: Joi.object({
    email: Joi.string()
      .trim()
      .email()
      .required()
      .messages({
        'string.empty': 'Email is required',
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string()
      .required()
      .messages({
        'string.empty': 'Password is required',
        'any.required': 'Password is required'
      })
  }),

  // Contact form validation
  contactForm: Joi.object({
    name: Joi.string()
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
    email: Joi.string()
      .trim()
      .email()
      .required()
      .messages({
        'string.empty': 'Email is required',
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    subject: Joi.string()
      .trim()
      .valid('general', 'demo', 'support', 'partnership')
      .default('general')
      .messages({
        'any.only': 'Subject must be one of: general, demo, support, partnership'
      }),
    message: Joi.string()
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
    newsletter: Joi.boolean()
      .default(false)
  }),

  // Pagination validation
  pagination: Joi.object({
    page: Joi.number()
      .integer()
      .min(1)
      .default(1)
      .messages({
        'number.base': 'Page must be a number',
        'number.integer': 'Page must be an integer',
        'number.min': 'Page must be at least 1'
      }),
    limit: Joi.number()
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
    sort: Joi.string()
      .optional()
      .pattern(/^-?[a-zA-Z_]+$/)
      .messages({
        'string.pattern.base': 'Sort field must be a valid field name, optionally prefixed with - for descending order'
      }),
    fields: Joi.string()
      .optional()
      .pattern(/^[a-zA-Z_]+(,[a-zA-Z_]+)*$/)
      .messages({
        'string.pattern.base': 'Fields must be comma-separated field names'
      })
  }),

  // MongoDB ObjectId validation
  objectId: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Invalid ID format',
        'any.required': 'ID is required'
      })
  }),

  // User update validation (for admin)
  userUpdate: Joi.object({
    name: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .optional()
      .messages({
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name cannot exceed 100 characters'
      }),
    email: Joi.string()
      .trim()
      .email()
      .optional()
      .messages({
        'string.email': 'Please provide a valid email address'
      }),
    role: Joi.string()
      .valid('user', 'admin')
      .optional()
      .messages({
        'any.only': 'Role must be either user or admin'
      }),
    isActive: Joi.boolean()
      .optional()
  }),

  // Contact update validation (full edit)
  contactUpdate: Joi.object({
    name: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .optional()
      .messages({
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name cannot exceed 100 characters'
      }),
    email: Joi.string()
      .trim()
      .email()
      .optional()
      .messages({
        'string.email': 'Please provide a valid email address'
      }),
    subject: Joi.string()
      .trim()
      .valid('general', 'demo', 'support', 'partnership')
      .optional()
      .messages({
        'any.only': 'Subject must be one of: general, demo, support, partnership'
      }),
    message: Joi.string()
      .trim()
      .min(10)
      .max(1000)
      .optional()
      .messages({
        'string.min': 'Message must be at least 10 characters long',
        'string.max': 'Message cannot exceed 1000 characters'
      }),
    status: Joi.string()
      .valid('new', 'read', 'replied', 'archived')
      .optional()
      .messages({
        'any.only': 'Status must be one of: new, read, replied, archived'
      })
  }),

  // Contact status update validation
  contactStatusUpdate: Joi.object({
    status: Joi.string()
      .valid('new', 'read', 'replied', 'archived')
      .required()
      .messages({
        'any.only': 'Status must be one of: new, read, replied, archived',
        'any.required': 'Status is required'
      }),
    isRead: Joi.boolean()
      .optional()
  }),

  // Email validation (for email sending)
  emailSend: Joi.object({
    to: Joi.string()
      .trim()
      .email()
      .required()
      .messages({
        'string.empty': 'Recipient email is required',
        'string.email': 'Please provide a valid email address',
        'any.required': 'Recipient email is required'
      }),
    subject: Joi.string()
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
    html: Joi.string()
      .trim()
      .min(1)
      .required()
      .messages({
        'string.empty': 'HTML content is required',
        'string.min': 'HTML content cannot be empty',
        'any.required': 'HTML content is required'
      }),
    text: Joi.string()
      .trim()
      .optional()
  })
};

// Custom validation functions
export const customValidators = {
  // Validate email uniqueness
  uniqueEmail: async (email: string, excludeId?: string): Promise<boolean> => {
    const { User } = await import('@/models/User.model');
    const query: any = { email: email.toLowerCase() };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    const existingUser = await User.findOne(query);
    return !existingUser;
  },

  // Validate contact rate limit per email
  contactRateLimit: async (email: string): Promise<boolean> => {
    const { Contact } = await import('@/models/Contact.model');
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentSubmissions = await Contact.countDocuments({
      email: email.toLowerCase(),
      createdAt: { $gte: oneHourAgo }
    });
    return recentSubmissions < 3;
  }
};

// Advanced validation middleware with custom validators
export const validateWithCustom = (
  schema: Joi.ObjectSchema, 
  property: 'body' | 'query' | 'params' = 'body',
  customValidators?: Array<() => Promise<boolean>>
) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // First, run Joi validation
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      const validationErrors: IValidationError[] = error.details.map(detail => ({
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
      } as IApiResponse);
      return;
    }

    // Run custom validators if provided
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
            } as IApiResponse);
            return;
          }
        }
      } catch (error) {
        logger.error('Custom validation error:', error);
        res.status(500).json({
          success: false,
          error: {
            message: 'Validation error occurred',
            code: 'VALIDATION_SYSTEM_ERROR'
          }
        } as IApiResponse);
        return;
      }
    }

    // Replace the request property with validated data
    req[property] = value;
    next();
  };
};
