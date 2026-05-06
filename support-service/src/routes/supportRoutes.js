const express = require("express");
const validateRequest = require("../middleware/validateRequest");
const { authRequired, requireRole, internalOrAuth } = require("../middleware/authMiddleware");
const controller = require("../controllers/supportController");

const router = express.Router();

router.post(
  "/assign",
  authRequired,
  requireRole("admin"),
  controller.assignValidation,
  validateRequest,
  controller.assign
);
router.post(
  "/respond",
  authRequired,
  requireRole("agent"),
  controller.respondValidation,
  validateRequest,
  controller.respond
);
router.put(
  "/resolve/:ticketId",
  authRequired,
  requireRole("agent"),
  controller.resolveValidation,
  validateRequest,
  controller.resolve
);
router.get("/support/:ticketId", authRequired, controller.resolveValidation, validateRequest, controller.getByTicket);
router.get("/support/internal/all", internalOrAuth, controller.internalAll);

module.exports = router;
