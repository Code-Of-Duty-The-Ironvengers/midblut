const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  booksRented: [
    {
      type: mongoose.Types.ObjectId,
      ref: "book",
    },
  ],
  profilePic: String,
  //   books: We look into this whenever we add relationships
});

const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;
