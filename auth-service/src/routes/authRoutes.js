const express = require("express");
const controller = require("../controllers/authController");
const validateRequest = require("../middleware/validateRequest");
const { authRequired, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/register",
  controller.registerValidation,
  validateRequest,
  controller.register
);
router.post("/login", controller.loginValidation, validateRequest, controller.login);
router.get(
  "/users/agents",
  authRequired,
  requireRole("admin"),
  controller.getAgents
);

module.exports = router;
