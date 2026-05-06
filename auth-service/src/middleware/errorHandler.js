const { logError } = require("../utils/logger");

const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  logError("Unhandled error", {
    statusCode,
    message,
    path: req.path,
    method: req.method
  });

  res.status(statusCode).json({
    success: false,
    message
  });
};

module.exports = errorHandler;
