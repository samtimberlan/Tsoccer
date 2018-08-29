"use strict";
const passport = require("passport");
const User = require("../models/User");
const FacebookStrategy = require("passport-facebook").Strategy;
const secret = require("../secret/secretFile");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  new FacebookStrategy(
    {
      clientID: secret.facebook.clientID,
      clientSecret: secret.facebook.clientSecret,
      profileFields: ["email", "displayName", "photos"],
      callbackURL: "http://localhost:5000/auth/facebook/callback",
      passReqToCallback: true
    },
    (req, accessToken, refreshToken, profile, done) => {
      User.findOne({ facebook: profile.id }, (err, user) => {
        if (err) {
          console.log(err);
          return done(err);
        }

        if (user) {
          //-----This line checks if the user previously registered via local auth and signs him in if positive
          if (user.email == profile._json.email) {
            return done(null, user);
          }
          //---------------
          done(null, user);
        } else {
          const newUser = new User();
          newUser.facebook = profile.id;
          newUser.fullname = profile.displayName;
          newUser.email = profile._json.email;
          newUser.userImage =
            "https://graph.facebook.com/" + profile.id + "/picture?type=large";
          newUser.facebookTokens.push({ token: accessToken });

          newUser.save(err => {
            if (err) {
              console.log(err);
            }
            return done(null, user);
          });
        }
      });
    }
  )
);
