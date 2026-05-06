const { body } = require("express-validator");
const asyncHandler = require("../utils/asyncHandler");
const authService = require("../services/authService");

const registerValidation = [
  body("username").trim().notEmpty().withMessage("username is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters"),
  body("role")
    .isIn(["user", "admin", "agent"])
    .withMessage("role must be user, admin, or agent")
];

const loginValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("password is required")
];

const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: user
  });
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.status(200).json({
    success: true,
    message: "Login successful",
    data: result
  });
});

const getAgents = asyncHandler(async (_req, res) => {
  const agents = await authService.listAgents();
  res.status(200).json({
    success: true,
    data: agents
  });
});

module.exports = {
  registerValidation,
  loginValidation,
  register,
  login,
  getAgents
};
