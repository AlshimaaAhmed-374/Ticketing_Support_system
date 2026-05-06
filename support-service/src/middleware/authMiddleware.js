const jwt = require("jsonwebtoken");

const authRequired = (req, _res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return next({ statusCode: 401, message: "Authentication required" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (_error) {
    return next({ statusCode: 401, message: "Invalid or expired token" });
  }
};

const requireRole = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next({ statusCode: 403, message: "Forbidden: insufficient role" });
  }
  return next();
};

const internalOrAuth = (req, _res, next) => {
  const serviceToken = req.headers["x-internal-token"];
  if (serviceToken && serviceToken === process.env.INTERNAL_SERVICE_TOKEN) {
    req.isInternal = true;
    return next();
  }
  return authRequired(req, _res, next);
};

module.exports = { authRequired, requireRole, internalOrAuth };
