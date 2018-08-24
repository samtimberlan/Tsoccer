"use strict";

//NOTE: The values of parameters would be provided by container.js via dependency injection
module.exports = function(lodash, passport, userValidation) {
  return {
    SetRouting: function(router) {
      router.get("/", this.indexPage);
      router.get("/signup", this.getSignUp);
      router.get("home", this.homePage);

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
    }
  };
};
