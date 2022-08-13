const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");

const MongoStore = require("connect-mongo"); // connecting to mongodb to create data

const session = require("express-session"); // middleware that gives us possibility to deal with sessions
const path = require("path");

function makesConfig(app) {
  app.set("view engine", "hbs");
  app.use(express.urlencoded({ extended: false }));
  app.use(logger("dev"));
  app.use(cookieParser());
  app.use(
    session({
      name: "hello-class",
      secret: process.env.SESSION_SECRET || "lasdkfjghsdfklgjhsdfkljghsdfljkgh",
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL || "mongodb://localhost/mindblur",
      }),
    })
  );

  app.use(express.static(path.join(__dirname, "..", "public")));

  // check if user is logged in it adds to something called res.locals `isLoggedIn=true`
  // this way, we dont always have to send on EVERY SINGLE response that the user is logged
  app.use((req, res, next) => {
    if (req.session.userId) {
      res.locals.isLoggedIn = true;
    }

    next();
  });
}

module.exports = makesConfig;
