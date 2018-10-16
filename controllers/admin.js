"use strict";

// const path = require("path"); // Helps me define path on my local system
// const fs = require("fs"); //Enables me to rename files

const formidable = require("formidable");
const aws = require("../helpers/awsUpload");
const Club = require("../models/Club");

module.exports = function(formidable) {
  return {
    setRouting: function(router) {
      //GET routes
      router.get("/dashboard", this.adminPage);
      router.post("/uploadFile", aws.Upload.any(), this.uploadFile);
      router.post("/dashboard", this.adminPostPage);
    },

    adminPage: function(req, res) {
      return res.render("admin/dashboard");
    },

    uploadFile: function(req, res) {
      const form = new formidable.IncomingForm();
      // form.uploadDir = path.join(__dirname, "../public/uploads");

      //Handle file upload and rename file
      form.on("file", (field, file) => {
        // fs.rename(file.path, path.join(form.uploadDir, file.name), err => {
        //   if (err) throw err;
        //   console.log("File renamed successfully!");
        // });
      });

      //Handle Error event
      form.on("error", err => {
        console.log(err);
      });

      //Handle End of file Upload
      form.on("end", () => {
        console.log("File upload is successful");
      });

      form.parse(req);
    },

    adminPostPage: function(req, res) {
      const newClub = new Club();
      newClub.club = req.body.club;
      newClub.country = req.body.country;
      newClub.image = req.body.upload;
      newClub.save(err => {
        res.redirect("admin/dashboard");
      });
    }
  };
};
