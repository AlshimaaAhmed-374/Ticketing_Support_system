const express = require("express");
const validateRequest = require("../middleware/validateRequest");
const { authRequired, requireRole, internalOrAuth } = require("../middleware/authMiddleware");
const controller = require("../controllers/ticketController");

const router = express.Router();

router.post(
  "/",
  authRequired,
  requireRole("user"),
  controller.createValidation,
  validateRequest,
  controller.createTicket
);
router.get("/", authRequired, controller.getTickets);
router.get("/unassigned", authRequired, requireRole("agent", "admin"), controller.unassigned);
router.get("/assigned/me", authRequired, requireRole("agent"), controller.assignedMe);
router.get("/internal/all", internalOrAuth, controller.internalAll);
router.get("/internal/:id", internalOrAuth, controller.idValidation, validateRequest, controller.getTicketInternal);
router.get("/:id", authRequired, controller.idValidation, validateRequest, controller.getTicket);
router.put("/:id", internalOrAuth, controller.updateValidation, validateRequest, controller.updateTicket);

module.exports = router;
