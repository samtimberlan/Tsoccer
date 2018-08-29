"use strict";

module.exports = function(lodash) {
  return {
    setRouting: function(router) {
      //GET routes
      router.get("/dashboard", this.adminPage);
    },

    adminPage: function(req, res) {
      return res.render("dashboard");
    }
  };
};
