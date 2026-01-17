import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../model/User.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        // 1️⃣ Try to find by googleId
        let user = await User.findOne({ googleId: profile.id });

        // 2️⃣ If not found, try to find by email (local account)
        if (!user) {
          user = await User.findOne({ email });

          if (user) {
            // 🔗 Link Google account to existing user
            user.googleId = profile.id;
            user.authProvider = "google";
            if (!user.photo && profile.photos?.length) {
              user.photo = profile.photos[0].value;
            }
            await user.save();
          } else {
            // 🆕 Create brand new Google user
            user = await User.create({
              googleId: profile.id,
              username: profile.displayName,
              email,
              photo: profile.photos?.[0]?.value,
              authProvider: "google",
            });
          }
        }

        return done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => done(null, user));
});

export default passport;
