const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const http = require("http");
const container = require("./container");
const cookieParser = require("cookie-parser");
const validator = require("express-validator");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const flash = require("connect-flash");
const passport = require("passport");
//require("./passport/passport-local");

container.resolve(function(users, lodash, admin) {
  mongoose.Promise = global.Promise;
  mongoose
    .connect(
      "mongodb://localhost:27017/tsoccer",
      { useNewUrlParser: true }
    )
    .then(console.log("Database Connected"));
  const app = SetupExpressServer();

  function SetupExpressServer() {
    const app = express();
    const server = http.createServer(app);
    const port = 5000;
    server.listen(port, function() {
      console.log("Listening on port " + port);
    });
    ConfigureExpress(app);

    //Setup router
    const router = require("express-promise-router")();
    users.SetRouting(router);
    admin.setRouting(router);

    //NB: SetRouting is an arbitrary name

    app.use(router);
  }

  function ConfigureExpress(app) {
    require("./passport/passport-local");
    require("./passport/passport-facebook");
    require("./passport/passport-google");

    app.use(express.static("public"));
    app.use(cookieParser());
    app.set("view engine", "ejs");
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(validator());
    app.use(
      session({
        secret: "AVeryBigSecret",
        resave: true,
        saveUninitialized: true,
        store: new MongoStore({ mongooseConnection: mongoose.connection })
      })
    );
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());

    app.locals.lodash = lodash;
  }
});
