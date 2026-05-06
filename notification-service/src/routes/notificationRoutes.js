const express = require("express");
const controller = require("../controllers/notificationController");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.post("/notify", controller.notifyValidation, validateRequest, controller.notify);
router.get("/notifications", controller.listNotifications);

module.exports = router;
