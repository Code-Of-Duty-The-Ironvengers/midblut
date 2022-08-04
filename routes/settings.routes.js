const { Router } = require("express");
const isLoggedIn = require("../middleware/isLoggedIn.middleware");
const UserModel = require("../models/User.model");
const {
  Types: { ObjectId },
} = require("mongoose");

const settingsRouter = Router();

settingsRouter.get("/", isLoggedIn, (req, res) => {
  res.render("settings/home");
});

settingsRouter.get("/update-user", isLoggedIn, async (req, res) => {
  // 123
  // PersonInClassModel.findOne({countryOfOrigin: "Deutschland", countryOfResidence: "France"})
  // PersonInClassModel.findById(123)
  const user = await UserModel.findById(req.session.userId);
  // UserDocument || null

  if (!user) {
    return res.redirect("/");
  }
  res.render("settings/update-user", { user });
});

settingsRouter.post("/update-user", isLoggedIn, async (req, res) => {
  const { username = "", email = "" } = req.body;
  console.log(
    await UserModel.findOne({
      $or: [{ username }, { email }],
      _id: { $ne: ObjectId(req.session.userId) },
    })
  );

  if (username.length < 4) {
    return res.status(400).render("settings/update-user", {
      usernameError: "Please choose something with more than 4 characters",
      ...req.body,
    });
  }

  if (!email.includes("@")) {
    // @email andre@ || @
    return res.status(400).render("settings/update-user", {
      emailError:
        "Please add, at the very least an @ symbol. We dont ask for THAT much",
      ...req.body,
    });
  }

  // nico
  // nico@gmail.com

  const aSingleUser = await UserModel.findOne({
    $or: [{ username }, { email }],
    _id: { $ne: ObjectId(req.session.userId) },
  });

  if (!aSingleUser) {
    await UserModel.findByIdAndUpdate(req.session.userId, { username, email });
    return res.redirect("/");
  }
  UserModel.find({
    _id: {
      $nin: [ObjectId(req.session.userId)],
      $or: [{ username }, { email }],
    },
  });

  // No can do. you cannot update your username or email, because one of these is already taken

  res.status(400).render("settings/update-user", {
    errorMessage:
      "One of those is taken, please rewrite either the username or email",
  });
});

module.exports = settingsRouter;
