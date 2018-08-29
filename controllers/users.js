"use strict";

//NOTE: The values of parameters would be provided by container.js via dependency injection
module.exports = function(lodash, passport, userValidation) {
  return {
    SetRouting: function(router) {
      //GET routes
      router.get("/", this.indexPage);
      router.get("/signup", this.getSignUp);
      router.get("/home", this.homePage);
      router.get("/auth/facebook", this.getFacebookLogin);
      router.get("/auth/facebook/callback", this.facebookLoginCallback);
      router.get("/auth/google", this.getGoogleLogin);
      router.get("/auth/google/callback", this.googleLoginCallback);

      //POST routes
      router.post("/", userValidation.loginValidation, this.postLogin);
      router.post("/signup", userValidation.signUpValidation, this.postSignUp);
    },
    indexPage: function(req, res) {
      const errors = req.flash("loginError");
      return res.render("index", {
        title: "Tsoccer | Login",
        messages: errors,
        hasErrors: errors.length > 0
      });
    },
    getSignUp: function(req, res) {
      const errors = req.flash("error");
      return res.render("signup", {
        title: "Tsoccer | Sign Up",
        messages: errors,
        hasErrors: errors.length > 0
      });
    },
    postSignUp: passport.authenticate("local.signup", {
      successRedirect: "/home",
      failureRedirect: "/signup",
      failureFlash: true
    }),
    postLogin: passport.authenticate("local.login", {
      successRedirect: "/home",
      failureRedirect: "/",
      failureFlash: true
    }),
    homePage: function(req, res) {
      return res.render("home");
    },

    getFacebookLogin: passport.authenticate("facebook", {
      scope: "email"
    }),

    facebookLoginCallback: passport.authenticate("facebook", {
      successRedirect: "/home",
      failureRedirect: "/",
      failureFlash: true
    }),

    getGoogleLogin: passport.authenticate("google", {
      scope: [
        "https://www.googleapis.com/auth/plus.login",
        "https://www.googleapis.com/auth/userinfo.email"
      ]
    }),

    googleLoginCallback: passport.authenticate("google", {
      successRedirect: "/home",
      failureRedirect: "/",
      failureFlash: true
    })
  };
};
