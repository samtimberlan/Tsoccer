"use strict";

module.exports = function(lodash) {
  return {
    SetRouting: function(router) {
      router.get("/", this.indexPage);
      //router.get("/signup", this.signUpPage);
    },
    indexPage: function(req, res) {
      return res.render("index", { test: "This is Tim" });
    }
    //   signUpPage: function(req, res) {
    //     return res.render("signup");
    //   }
  };
};
