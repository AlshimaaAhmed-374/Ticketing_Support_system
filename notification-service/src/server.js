require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const { body, validationResult } = require("express-validator");

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(compression());
app.use(morgan("combined"));
app.use(express.json({ limit: "1mb" }));

const notifications = [];

app.get("/health", (_req, res) => res.json({ success: true, service: "notification-service" }));

app.post(
  "/notify",
  [
    body("userId").notEmpty().withMessage("userId is required"),
    body("message").trim().notEmpty().withMessage("message is required"),
    body("ticketId").notEmpty().withMessage("ticketId is required")
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: "Validation failed", errors: errors.array() });
    }

    const payload = {
      userId: req.body.userId,
      message: req.body.message,
      ticketId: req.body.ticketId,
      createdAt: new Date().toISOString()
    };
    notifications.push(payload);
    console.log("Notification:", payload);

    return res.status(200).json({
      success: true,
      message: "Notification sent successfully"
    });
  }
);

app.listen(Number(process.env.PORT || 5003));
