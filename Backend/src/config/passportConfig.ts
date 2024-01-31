
import passport from 'passport';
import dotenv from 'dotenv';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/userModel';

dotenv.config();

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

const passportConfig = passport.use(
  new GoogleStrategy(
    {
      callbackURL: '/auth/google/redirect',
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    async (accessToken, refreshToken, profile, done) => {
      const currentUser = await User.findOne({
        Email: profile.emails![0].value,
      });
      if (currentUser) {
        done(null, currentUser);
      } else {
        new User({
          Name: profile._json.name,
          Email: profile._json.email,
          GoogleID: profile.id,
          ProfilePhoto: profile.photos![0].value,
          isVerified: true,
        })
          .save({ validateBeforeSave: false })
          .then((newUser) => {
            done(null, newUser);
          });
      }
    },
  ),
);

export default passportConfig;
