"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const auth_middleware_1 = require("@/middlewares/auth.middleware");
const security_middleware_1 = require("@/middlewares/security.middleware");
const router = (0, express_1.Router)();
router.get('/google', security_middleware_1.authRateLimiter, passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport_1.default.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=auth_failed`,
    successRedirect: `${process.env.CLIENT_URL}/dashboard`
}), (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
});
router.get('/me', auth_middleware_1.authenticate, (req, res) => {
    res.status(200).json({
        success: true,
        data: req.user
    });
});
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
        res.clearCookie('jwt');
        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    });
});
exports.default = router;
//# sourceMappingURL=auth.routes.js.map