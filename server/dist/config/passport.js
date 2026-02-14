"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_jwt_1 = require("passport-jwt");
const User_model_1 = require("@/models/User.model");
const logger_1 = require("@/utils/logger");
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    scope: ['profile', 'email'],
    passReqToCallback: true,
}, async (req, accessToken, refreshToken, params, profile, done) => {
    try {
        logger_1.logger.info(`Google OAuth attempt for email: ${profile.emails?.[0]?.value}`);
        const email = profile.emails?.[0]?.value;
        if (!email) {
            return done(new Error('No email found in Google profile'), undefined);
        }
        let user = await User_model_1.User.findOne({ email });
        if (user) {
            if (!user.googleId) {
                user.googleId = profile.id;
                await user.save();
            }
            logger_1.logger.info(`Existing user logged in: ${email}`);
            return done(null, user.toObject());
        }
        const newUser = await User_model_1.User.create({
            googleId: profile.id,
            email: email,
            name: profile.displayName || `${profile.name?.givenName} ${profile.name?.familyName}`.trim(),
            avatar: profile.photos?.[0]?.value,
        });
        logger_1.logger.info(`New user created: ${email}`);
        return done(null, newUser.toObject());
    }
    catch (error) {
        logger_1.logger.error('Error in Google OAuth strategy:', error);
        return done(error, undefined);
    }
}));
passport_1.default.use(new passport_jwt_1.Strategy({
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromExtractors([
        (req) => {
            let token = null;
            if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
                token = req.headers.authorization.substring(7);
            }
            if (!token && req.cookies && req.cookies.jwt) {
                token = req.cookies.jwt;
            }
            return token;
        },
    ]),
    secretOrKey: process.env.JWT_SECRET,
}, async (payload, done) => {
    try {
        const user = await User_model_1.User.findById(payload.userId);
        if (!user || !user.isActive) {
            return done(null, false);
        }
        logger_1.logger.debug(`JWT authenticated user: ${user.email}`);
        return done(null, user.toObject());
    }
    catch (error) {
        logger_1.logger.error('Error in JWT strategy:', error);
        return done(error, false);
    }
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await User_model_1.User.findById(id);
        done(null, user ? user.toObject() : null);
    }
    catch (error) {
        done(error, null);
    }
});
exports.default = passport_1.default;
//# sourceMappingURL=passport.js.map