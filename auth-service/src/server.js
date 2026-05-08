require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const { connectDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");
const { logInfo, logError } = require("./utils/logger");

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(compression());
app.use(morgan("combined"));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({ success: true, service: "auth-service" });
});

app.use("/auth", authRoutes);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    const port = Number(process.env.PORT || 5001);
    app.listen(port, () => {
      logInfo("Auth service started", { port });
    });
  } catch (error) {
    logError("Failed to start auth service", { message: error.message });
    process.exit(1);
  }
};

startServer();
