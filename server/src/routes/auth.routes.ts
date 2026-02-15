import { Router, Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { authenticate } from '@/middlewares/auth.middleware';
import { authRateLimiter } from '@/middlewares/security.middleware';
import { validate, schemas } from '@/middlewares/validation.middleware';
import { User } from '@/models/User.model';
import { logger } from '@/utils/logger';

const router = Router();

// Helper to generate JWT token
const generateToken = (user: any): string => {
  return jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'fallback-jwt-secret',
    { expiresIn: (process.env.JWT_EXPIRE || '7d') as any }
  );
};

// ==========================================
// Email/Password Authentication
// ==========================================

// Register with email and password
router.post('/register',
  authRateLimiter,
  validate(schemas.register),
  async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'An account with this email already exists'
        });
        return;
      }

      // Create new user
      const user = await User.create({ name, email, password });
      const token = generateToken(user);

      logger.info(`New user registered: ${email}`);

      res.status(201).json({
        success: true,
        token,
        data: user.toSafeObject(),
        message: 'Registration successful'
      });
    } catch (error: any) {
      logger.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Registration failed'
      });
    }
  }
);

// Login with email and password
router.post('/login',
  authRateLimiter,
  validate(schemas.login),
  async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Find user and include password for comparison
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
        return;
      }

      if (!user.password) {
        res.status(401).json({
          success: false,
          message: 'This account uses Google sign-in. Please sign in with Google.'
        });
        return;
      }

      // Compare password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
        return;
      }

      if (!user.isActive) {
        res.status(401).json({
          success: false,
          message: 'Account is deactivated'
        });
        return;
      }

      const token = generateToken(user);

      logger.info(`User logged in: ${email}`);

      res.status(200).json({
        success: true,
        token,
        data: user.toSafeObject(),
        message: 'Login successful'
      });
    } catch (error: any) {
      logger.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Login failed'
      });
    }
  }
);

// ==========================================
// Google OAuth Authentication
// ==========================================

router.get('/google',
  (req: Request, res: Response, next) => {
    // Check if Google OAuth is configured
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_CALLBACK_URL) {
      res.status(503).json({
        success: false,
        message: 'Google OAuth is not configured. Please use email/password login.'
      });
      return;
    }
    next();
  },
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=auth_failed`,
    session: false
  }),
  (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      if (!user) {
        res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=auth_failed`);
        return;
      }
      
      const token = generateToken(user);
      // Redirect to client with token as query parameter
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/auth-callback?token=${token}`);
    } catch (error) {
      logger.error('Google OAuth callback error:', error);
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=auth_failed`);
    }
  }
);

// ==========================================
// Authenticated User Routes
// ==========================================

// Get current authenticated user
router.get('/me', authenticate as any, (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: (req as any).user
  });
});

// Logout user
router.post('/logout', (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      logger.error('Logout error:', err);
    }
    
    // Clear JWT cookie
    res.clearCookie('jwt');
    
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  });
});

export default router;
