"use strict";
const passport = require("passport");
const User = require("../models/User");
const localStrategy = require("passport-local").Strategy;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  "local.signup",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    (req, email, password, done) => {
      User.findOne({ email: email }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(
            null,
            false,
            req.flash("error", "User with email already exists")
          );
        }
        const newUser = new User();
        newUser.username = req.body.username;
        newUser.email = req.body.email;
        newUser.password = newUser.encryptPasword(req.body.password);

        newUser.save(err => {
          done(null, newUser);
        });
      });
    }
  )
);

passport.use(
  "local.login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    (req, email, password, done) => {
      User.findOne({ email: email }).then(user => {
        const messages = [];

        if (!user) {
          messages.push("Email does not exist.");
          return done(null, false, req.flash("loginError", messages));
        }
        if (user.validUserPassword(password)) {
          return done(null, user);
        } else {
          messages.push("Password is incorrect.");
          return done(null, false, req.flash("loginError", messages));
        }
      });
    }
  )
);
