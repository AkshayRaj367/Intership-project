import { Request } from 'express';
import { Document } from 'mongoose';
export interface IUser extends Document {
    googleId: string;
    email: string;
    name: string;
    avatar?: string;
    role: 'user' | 'admin';
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface IContact extends Document {
    _id: any;
    name: string;
    email: string;
    subject: 'general' | 'demo' | 'support' | 'partnership';
    message: string;
    userId?: string;
    status: 'new' | 'read' | 'replied' | 'archived';
    ipAddress?: string;
    userAgent?: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface IGoogleProfile {
    id: string;
    displayName: string;
    emails: Array<{
        value: string;
        verified: boolean;
    }>;
    photos: Array<{
        value: string;
    }>;
    name?: {
        givenName: string;
        familyName: string;
    };
}
export interface IJWTPayload {
    userId: string;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
}
export interface IAuthUser {
    _id: string;
    googleId: string;
    email: string;
    name: string;
    avatar?: string;
    role: 'user' | 'admin';
    isActive: boolean;
}
export interface AuthenticatedRequest extends Request {
    user?: IAuthUser;
}
export interface IApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: {
        message: string;
        code?: string;
        details?: any;
    };
}
export interface IPaginationResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
export interface IContactFormData {
    name: string;
    email: string;
    subject?: string;
    message: string;
    newsletter?: boolean;
}
export interface IEmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}
export interface IEnvVars {
    NODE_ENV: string;
    PORT: number;
    MONGODB_URI: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_CALLBACK_URL: string;
    JWT_SECRET: string;
    JWT_EXPIRE: string;
    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_EXPIRE: string;
    EMAIL_USER: string;
    EMAIL_APP_PASS: string;
    EMAIL_FROM_NAME: string;
    CLIENT_URL: string;
    RATE_LIMIT_WINDOW_MS: number;
    RATE_LIMIT_MAX_REQUESTS: number;
    BCRYPT_SALT_ROUNDS: number;
    SESSION_SECRET: string;
    LOG_LEVEL: string;
    LOG_FILE: string;
}
export interface ICustomError extends Error {
    statusCode?: number;
    code?: string;
    isOperational?: boolean;
}
export interface IValidationError {
    field: string;
    message: string;
    value?: any;
}
export interface IQueryOptions {
    page?: number;
    limit?: number;
    sort?: string;
    fields?: string;
    populate?: string;
}
export interface IHealthCheck {
    success: boolean;
    message: string;
    timestamp: string;
    environment: string;
    database?: {
        status: string;
        responseTime?: number;
    };
    uptime: number;
    version: string;
}
//# sourceMappingURL=index.d.ts.map