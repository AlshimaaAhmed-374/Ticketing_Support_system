require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const supportRoutes = require("./routes/supportRoutes");
const { connectDB } = require("./config/db");

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(compression());
app.use(morgan("combined"));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => res.json({ success: true, service: "support-service" }));
app.use("/", supportRoutes);
app.use((err, _req, res, _next) => {
  console.error("🔥 GLOBAL ERROR:", err); // <-- ADD THIS

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
    stack: err.stack // <-- TEMP ONLY (remove later)
  });
});

connectDB()
  .then(() => app.listen(Number(process.env.PORT || 5002)))
  .catch((err) => {
    console.error("Support service startup failed", err.message);
    process.exit(1);
  });
