const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

const authRequired = (req, _res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return next(new AppError(401, "Authentication token is required"));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    return next();
  } catch (error) {
    return next(new AppError(401, "Invalid or expired token"));
  }
};

const requireRole = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError(403, "Forbidden: insufficient role"));
  }
  return next();
};

module.exports = {
  authRequired,
  requireRole
};
