const { body } = require("express-validator");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const notificationService = require("../services/notificationService");

const notifyValidation = [
  body("userId").trim().notEmpty().withMessage("userId is required"),
  body("message").trim().notEmpty().withMessage("message is required"),
  body("ticketId").trim().notEmpty().withMessage("ticketId is required")
];

const notify = asyncHandler(async (req, res) => {
  const result = await notificationService.notify(req.body);
  res.status(200).json(result);
});

const listNotifications = asyncHandler(async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    throw new AppError(400, "userId query param is required");
  }
  const data = await notificationService.listByUser(userId);
  res.status(200).json({ success: true, data });
});

module.exports = { notifyValidation, notify, listNotifications };
