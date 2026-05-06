const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/AppError");

const register = async ({ username, email, password, role }) => {
  const existing = await User.findOne({
    $or: [{ username }, { email: email.toLowerCase() }]
  }).lean();

  if (existing) {
    throw new AppError(409, "Username or email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    role
  });

  return {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new AppError(401, "Invalid credentials");
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new AppError(401, "Invalid credentials");
  }

  const payload = {
    userId: user._id.toString(),
    username: user.username,
    role: user.role
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d"
  });

  return { token, user: payload };
};

const listAgents = async () => {
  return User.find({ role: "agent" })
    .select("_id username email role")
    .sort({ username: 1 })
    .lean();
};

module.exports = {
  register,
  login,
  listAgents
};
