const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { ErrorResponse } = require("../utils/ErrorResponse");
const { collection } = require("../models/user");

const signup = async (req, res, next) => {
  try {
    const { first_name, username, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) throw new ErrorResponse("User already exists", 400);

    const hash = await bcrypt.hash(password, 5);

    const newUser = await User.create({
      first_name,
      username,
      email,
      password: hash,
    });

    const payload = {
      id: newUser._id,
      email: newUser.email,
      username: newUser.username,
      first_name: newUser.first_name,
      bookmark: newUser.bookmark,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.COOKIE_MAXAGE,
    });

    res
      .cookie("access_token", token, {
        httpOnly: true,
        maxAge: process.env.COOKIE_MAXAGE,
      })
      .send(payload);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user)
      throw new ErrorResponse("No account connected with that email ", 404);

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new ErrorResponse("Wrong password", 401);

    const payload = {
      id: user._id,
      email: user.email,
      username: user.username,
      bookmark: user.bookmark,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.COOKIE_MAXAGE,
    });

    res
      .cookie("access_token", token, {
        httpOnly: true,
        maxAge: process.env.COOKIE_MAXAGE,
      })
      .send(payload);
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res
      .cookie("access_token", "", {
        httpOnly: true,
        maxAge: 0,
      })
      .send("LOGOUT");
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {};

const savedProject = async (req, res, next) => {
  try {
    const id = req.user.id;
    const { projectId } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      {
        $addToSet: { bookmark: projectId },
      },
      { new: true }
    ).populate("bookmark");
    res.json(user.bookmark);
    //console.log(user);
  } catch (error) {
    next(error);
  }
};

const removeProject = async (req, res, next) => {
  try {
    const id = req.user.id;
    const { projectId } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      {
        $pull: { bookmark: projectId },
      },
      { new: true }
    ).populate("bookmark");
    res.json(user.bookmark);
  } catch (error) {
    next(error);
  }
};

const getBookmarks = async (req, res, next) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id).populate("bookmark");
    res.json(user.bookmark);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  logout,
  getUsers,
  getProfile,
  updateUser,
  savedProject,
  removeProject,
  getBookmarks,
};
