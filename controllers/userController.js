const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const Ad = require("../models/adModel");
const Comment = require("../models/commentModel");

// Register user
// @route POST /api/users
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error("User already exist");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    username: username,
    email: email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user.id),
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Login user
// @route POST /api/users/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

// Get user by ID
// @route GET /api/users/:id
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Get all users
// @route GET /api/users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// Delete user by ID
// @route DELETE /api/users/:id
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  try {
    await Ad.deleteMany({ user: user._id });
    await Comment.deleteMany({ user: user._id });

    await User.deleteOne({ _id: user._id });

    res.json({ message: "User removed" });
  } catch (error) {
    console.error("Error while deleting user:", error);
    res
      .status(500)
      .json({ message: "Error while deleting user", error: error.message });
  }
});

// Route to get all ads liked by the authenticated user
// @route GET /api/users/:userId/likes
const getUserLikes = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("likes");
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).json(user.likes);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = {
  registerUser,
  loginUser,
  getUser,
  getAllUsers,
  deleteUser,
  getUserLikes,
};