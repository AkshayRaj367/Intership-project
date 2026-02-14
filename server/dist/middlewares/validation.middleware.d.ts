import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
export declare const validate: (schema: Joi.ObjectSchema, property?: "body" | "query" | "params") => (req: Request, res: Response, next: NextFunction) => void;
export declare const schemas: {
    contactForm: Joi.ObjectSchema<any>;
    pagination: Joi.ObjectSchema<any>;
    objectId: Joi.ObjectSchema<any>;
    userUpdate: Joi.ObjectSchema<any>;
    contactStatusUpdate: Joi.ObjectSchema<any>;
    emailSend: Joi.ObjectSchema<any>;
};
export declare const customValidators: {
    uniqueEmail: (email: string, excludeId?: string) => Promise<boolean>;
    contactRateLimit: (email: string) => Promise<boolean>;
};
export declare const validateWithCustom: (schema: Joi.ObjectSchema, property?: "body" | "query" | "params", customValidators?: Array<() => Promise<boolean>>) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=validation.middleware.d.ts.map