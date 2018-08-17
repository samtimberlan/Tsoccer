"use strict";

//NOTE: The values of parameters would be provided by container.js via dependency injection
module.exports = function(lodash, passport, userValidation) {
  return {
    SetRouting: function(router) {
      router.get("/", this.indexPage);
      router.get("/signup", this.getSignUp);
      router.get("home", this.homePage);

      router.post("/signup", userValidation.signUpValidation, this.postSignUp);
    },
    indexPage: function(req, res) {
      return res.render("index", { test: "This is Tim" });
    },
    getSignUp: function(req, res) {
      const errors = req.flash("error");
      return res.render("signup", {
        title: "Tsoccer | Login",
        messages: errors,
        hasErrors: errors.length > 0
      });
    },
    postSignUp: passport.authenticate("local.signup", {
      successRedirect: "/home",
      failureRedirect: "/signup",
      failureFlash: true
    }),
    homePage: function(req, res) {
      return res.render("home");
    }
  };
};
