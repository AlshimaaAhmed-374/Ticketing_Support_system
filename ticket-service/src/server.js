require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const ticketRoutes = require("./routes/ticketRoutes");
const { connectDB } = require("./config/db");

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(compression());
app.use(morgan("combined"));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => res.json({ success: true, service: "ticket-service" }));
app.use("/tickets", ticketRoutes);

app.use((err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ success: false, message: err.message || "Internal server error" });
});

connectDB()
  .then(() => app.listen(Number(process.env.PORT || 5001)))
  .catch((err) => {
    console.error("Ticket service startup failed", err.message);
    process.exit(1);
  });
