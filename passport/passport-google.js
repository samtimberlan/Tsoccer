"use strict";
const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const User = require("../models/User");
const secret = require("../secret/secretFile");

passport.serializeUser((done, user) => {
  done(null, user.id);
});

passport.deserializeUser(id => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  "google",
  new googleStrategy(
    {
      clientID: secret.google.clientID,
      clientSecret: secret.google.clientSecret,
      callbackURL: "http://localhost:5000/auth/google/callback",
      passReqToCallback: true
    },
    (req, accessToken, refreshToken, profile, done) => {
      User.findOne({ google: profile.id }, (err, user) => {
        if (err) {
          return done(err);
        }

        if (user) {
          //-----This line checks if the user previously registered via local auth and signs him in if positive
          if (user.email == profile.emails[0].value) {
            return done(null, user);
          }
          //---------------
          return done(user);
        } else {
          const newUser = new User();
          newUser.fullname = profile.displayName;
          newUser.email = profile.emails[0].value;
          newUser.userImage = profile._json.image.url;

          newUser.save(err => {
            if (err) {
              return done(err);
            } else {
              return done(null, newUser);
            }
          });
        }
      });
    }
  )
);
