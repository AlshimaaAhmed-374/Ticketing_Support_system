const { logError } = require("../utils/logger");

const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  logError("reporting-service error", {
    statusCode,
    message,
    method: req.method,
    path: req.path
  });

  res.status(statusCode).json({ success: false, message });
};

module.exports = errorHandler;
