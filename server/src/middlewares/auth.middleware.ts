import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '@/models/User.model';
import { AuthenticatedRequest, IJWTPayload, IApiResponse } from '@/types';
import { logger } from '@/utils/logger';

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token = null;

    // Try to get token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.substring(7);
    }

    // Try to get token from cookies
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
      } as IApiResponse);
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as IJWTPayload;

    // Get user from database
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Invalid or inactive user',
          code: 'USER_INVALID'
        }
      } as IApiResponse);
      return;
    }

    // Attach user to request object
    req.user = {
      ...user.toObject(),
      _id: user._id.toString()
    } as any;
    next();

  } catch (error) {
    logger.error('Authentication error:', error);

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Invalid token',
          code: 'TOKEN_INVALID'
        }
      } as IApiResponse);
      return;
    }

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Token expired',
          code: 'TOKEN_EXPIRED'
        }
      } as IApiResponse);
      return;
    }

    res.status(500).json({
      success: false,
      error: {
        message: 'Authentication failed',
        code: 'AUTH_ERROR'
      }
    } as IApiResponse);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Authentication required',
          code: 'AUTH_REQUIRED'
        }
      } as IApiResponse);
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: {
          message: 'Insufficient permissions',
          code: 'INSUFFICIENT_PERMISSIONS'
        }
      } as IApiResponse);
      return;
    }

    next();
  };
};

export const optionalAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token = null;

    // Try to get token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.substring(7);
    }

    // Try to get token from cookies
    if (!token && req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as IJWTPayload;
      const user = await User.findById(decoded.userId);
      
      if (user && user.isActive) {
        req.user = user.toObject() as any;
      }
    }

    next();

  } catch (error) {
    // For optional auth, we don't return errors, just continue without user
    logger.debug('Optional authentication failed:', error);
    next();
  }
};
