const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const createTokenUser = require("../utils/createTokenUser");
const { attachCookiesToResponse } = require("../utils/jwt");
const checkPermissions = require("../utils/checkPermissions");

const getAllUsers = async (req, res) => {
  console.log(req.body, req.user);
  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ users });
};
const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password");
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id : ${req.params.id}`);
  }
  checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};
const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};
const updateUser = async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) {
    throw new CustomError.BadRequestError("Please provide all values");
  }
  const user = await User.findOneAndUpdate(
    { _id: req.user.userId },
    { email, name },
    { new: true, runValidators: true }
  );
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};
const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword || oldPassword === newPassword) {
    throw new CustomError.UnauthorizedError(
      "Please provide correct old Password as well as new Password"
    );
  }
  const user = await User.findById({ _id: req.user.userId });

  const currentUserPassword = await user.comparePassword(oldPassword);
  console.log(currentUserPassword);
  if (!currentUserPassword) {
    throw new CustomError.UnauthorizedError(
      "INPUTED PASSWORD DOES NOT MATCH WITH CURRENT PASSWORD"
    );
  }
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json(user);
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
