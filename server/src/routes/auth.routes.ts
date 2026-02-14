import { Router } from 'express';
import passport from 'passport';
import { authenticate } from '@/middlewares/auth.middleware';
import { authRateLimiter } from '@/middlewares/security.middleware';

const router = Router();

// Google OAuth routes
router.get('/google',
  authRateLimiter,
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${process.env.CLIENT_URL}/login?error=auth_failed`,
    successRedirect: `${process.env.CLIENT_URL}/dashboard`
  }),
  (req, res) => {
    // This will not be called due to redirects above
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  }
);

// Get current authenticated user
router.get('/me', authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    data: (req as any).user
  });
});

// Logout user
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: {
          message: 'Logout failed',
          code: 'LOGOUT_ERROR'
        }
      });
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
