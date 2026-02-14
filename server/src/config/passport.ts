import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '@/models/User.model';
import { IGoogleProfile, IJWTPayload } from '@/types';
import { logger } from '@/utils/logger';

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      scope: ['profile', 'email'],
      passReqToCallback: true,
    },
    async (req: any, accessToken: any, refreshToken: any, params: any, profile: any, done: any) => {
      try {
        logger.info(`Google OAuth attempt for email: ${profile.emails?.[0]?.value}`);

        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error('No email found in Google profile'), undefined);
        }

        // Check if user already exists
        let user = await User.findOne({ email });

        if (user) {
          // Update existing user's Google info if needed
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
          logger.info(`Existing user logged in: ${email}`);
          return done(null, user.toObject());
        }

        // Create new user
        const newUser = await User.create({
          googleId: profile.id,
          email: email,
          name: profile.displayName || `${profile.name?.givenName} ${profile.name?.familyName}`.trim(),
          avatar: profile.photos?.[0]?.value,
        });

        logger.info(`New user created: ${email}`);
        return done(null, newUser.toObject());

      } catch (error) {
        logger.error('Error in Google OAuth strategy:', error);
        return done(error, undefined);
      }
    }
  )
);

// JWT Strategy for API authentication
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          let token = null;
          
          // Try to get token from Authorization header
          if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.substring(7);
          }
          
          // Try to get token from cookies
          if (!token && req.cookies && req.cookies.jwt) {
            token = req.cookies.jwt;
          }
          
          return token;
        },
      ]),
      secretOrKey: process.env.JWT_SECRET!,
    },
    async (payload: IJWTPayload, done) => {
      try {
        const user = await User.findById(payload.userId);
        
        if (!user || !user.isActive) {
          return done(null, false);
        }

        logger.debug(`JWT authenticated user: ${user.email}`);
        return done(null, user.toObject());

      } catch (error) {
        logger.error('Error in JWT strategy:', error);
        return done(error, false);
      }
    }
  )
);

// Serialize and deserialize users for sessions
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user ? user.toObject() : null);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
