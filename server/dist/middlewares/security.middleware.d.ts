import { Request, Response, NextFunction } from 'express';
export declare const rateLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const authRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const corsConfig: {
    origin: string;
    credentials: boolean;
    optionsSuccessStatus: number;
    methods: string[];
    allowedHeaders: string[];
};
export declare const securityMiddleware: any[];
export declare const requestLogger: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=security.middleware.d.ts.map