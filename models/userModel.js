const mongoose = require("mongoose");
const Ad = require("../models/adModel");
const Comment = require("../models/commentModel");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "please add username"],
    },
    email: {
      type: String,
      required: [true, "please add email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "please add password"],
    },
    role: {
      type: String,
      default: "simple",
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ad",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("remove", async function (next) {
  await Ad.deleteMany({ user: this._id });
  await Comment.deleteMany({ user: this._id });
  next();
});

module.exports = mongoose.model("User", userSchema);