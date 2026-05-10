require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const notificationRoutes = require("./routes/notificationRoutes");
const errorHandler = require("./middleware/errorHandler");
const { logInfo } = require("./utils/logger");
const { validateEnv } = require("./config/env");

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(compression());
app.use(morgan("combined"));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => res.json({ success: true, service: "notification-service" }));
// In-cluster clients use http://notification-service:<port>/notify
app.use("/api", notificationRoutes);
app.use("/", notificationRoutes);
app.use(errorHandler);

const port = Number(process.env.PORT || 5003);
validateEnv();
app.listen(port, () => {
  logInfo("notification-service started", { port });
});
