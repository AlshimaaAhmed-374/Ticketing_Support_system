const express = require("express");
const controller = require("../controllers/reportingController");
const { internalOnly } = require("../middleware/internalAuth");

const router = express.Router();

router.get("/report", controller.getReport);
router.post("/report/recompute", internalOnly, controller.recompute);

module.exports = router;
