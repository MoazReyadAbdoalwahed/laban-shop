import express from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import 'dotenv/config';

const router = express.Router();

// ✅ Store URL only for OAuth redirects
const STORE_URL = process.env.CLIENT_URL // http://localhost:5174

// Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${STORE_URL}/login` }),
    (req, res) => {
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
        // ✅ Always redirect to Store
        res.redirect(`${STORE_URL}/oauth-callback?token=${token}&user=${encodeURIComponent(JSON.stringify(req.user))}`)
    }
)

// Facebook
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }))

router.get('/facebook/callback',
    passport.authenticate('facebook', { session: false, failureRedirect: `${STORE_URL}/login` }),
    (req, res) => {
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
        // ✅ Always redirect to Store
        res.redirect(`${STORE_URL}/oauth-callback?token=${token}&user=${encodeURIComponent(JSON.stringify(req.user))}`)
    }
)

export default router;