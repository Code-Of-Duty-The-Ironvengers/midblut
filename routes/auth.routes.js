const express = require("express");
const bcrypt = require("bcrypt");

const UserModel = require("../models/User.model");
const isLoggedOut = require("../middleware/isLoggedOut.middleware");
const isLoggedIn = require("../middleware/isLoggedIn.middleware");
const bcrypting = require("../utils/bcrypting");

const authRouter = express.Router();

// /auth
authRouter.get("/register", (req, res) => {
  res.render("auth/register");
  res.render("auth/register");
});

authRouter.post("/register", isLoggedOut, (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!username) {
    return res.status(400).render("auth/register", {
      usernameError: "Please add a username",
      ...req.body,
    }); // eventuallty show an error
  }

  if (!email) {
    return res.status(400).render("auth/register", {
      emailError: "Please add an email",
      ...req.body,
    });
  }

  if (!password) {
    return res.status(400).render("auth/register", {
      passwordError: "Please add a password",
      ...req.body,
    });
  }

  // ideally we should do some validation of emails and password. i wont do it now, we can do later

  if (username.length < 4) {
    return res.status(400).render("auth/register", {
      usernameError: "Please choose something with more than 4 characters",
      ...req.body,
    });
  }

  if (!email.includes("@")) {
    // @email andre@ || @
    return res.status(400).render("auth/register", {
      emailError:
        "Please add, at the very least an @ symbol. We dont ask for THAT much",
      ...req.body,
    });
  }

  if (password.length < 8) {
    return res.status(400).render("auth/register", {
      passwordError: "Could you at least pretend like you give a damn?",
      ...req.body,
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).render("auth/register", {
      passwordError:
        "Could you at least pretend like you give a damn?. Could these AT LEAST be the same? For once?... Could you not? We've been through this... It is written... Are you that dumb? You must be... Otherwise you would have done what we ask you to do... So could you, for once in your miserable life, do what youre told? Thank you",
      ...req.body,
    });
  }

  UserModel.findOne({ $or: [{ username }, { email }] })
    .then((possibleUser) => {
      // {User document} | null
      // if possible user is defined (truthy)
      if (possibleUser) {
        return res.render("auth/register", {
          generalError:
            "Either email or username already taken. Please try a new thing",
          ...req.body,
        }); // we know that there is a user already with at least one of those two credentials
      }

      // 1st - create something called a salt

      const hashedPassword = bcrypting(password);

      UserModel.create({
        email,
        username,
        password: hashedPassword,
      })
        .then((createdUser) => {
          req.session.userId = createdUser._id;
          res.redirect(`/user/${createdUser._id}`); // prepare your heads for mind blowing success
        })
        .catch((err) => {
          console.log("error failing creating a user", err);
          res.status(500).render("auth/register", {
            generalError:
              "Something got royally screwed up. Please try again later",
            ...req.body,
          });
        });
    })
    .catch((err) => {
      console.log(err);

      res.status(500).render("auth/register", {
        generalError:
          "Something got royally screwed up. Please try again later",
        ...req.body,
      });
    });
});

authRouter.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login");
});

authRouter.post("/login", isLoggedOut, (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    res.status(400).render("auth/login", {
      usernameError: "No username provided",
    });
    return;
  }

  if (!password) {
    return res.status(400).render("auth/login", {
      passwordError: "No password provided",
    });
  }

  UserModel.findOne({ username })
    .then((possibleUser) => {
      if (!possibleUser) {
        return res.status(400).render("auth/login", {
          generalError: "Wrong credentials",
        });
      }

      // Here we know that there is a user
      const isSamePassword = bcrypt.compareSync(
        password,
        possibleUser.password
      );

      if (!isSamePassword) {
        return res.status(400).render("auth/login", {
          generalError: "Wrong credentials",
        });
      }

      // the user exists. the password is the same. you must be the right person
      req.session.userId = possibleUser._id;
      res.redirect(`/user/${possibleUser._id}`);
    })
    .catch((err) => {
      console.log("Something failed whilst reaching for a user", err);
      res.status(500).render("auth/login", { generalError: "oopsie daisy" });
    });
});

authRouter.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    res.clearCookie("hello-class");
    if (err) {
      return res.status(500).redirect("/");
    }

    res.redirect("/");
  });
});

module.exports = authRouter;
