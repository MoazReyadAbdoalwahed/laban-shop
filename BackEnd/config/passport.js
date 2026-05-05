import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import FacebookStrategy from 'passport-facebook';
import 'dotenv/config';
import User from '../models/userModel.js';

// Google OAuth Strategy
passport.use(new GoogleStrategy.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.SERVER_URL}/api/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            user = await User.create({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails?.[0]?.value,
                profilePicture: profile.photos?.[0]?.value,
            });
        }

        done(null, user);
    } catch (error) {
        done(error, null);
    }
}));

// Facebook OAuth Strategy
passport.use(new FacebookStrategy.Strategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.SERVER_URL}/api/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'email', 'picture.type(large)']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ facebookId: profile.id });

        if (!user) {
            user = await User.create({
                facebookId: profile.id,
                name: profile.displayName,
                email: profile.emails?.[0]?.value,
                profilePicture: profile.photos?.[0]?.value,
            });
        }

        done(null, user);
    } catch (error) {
        done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;
