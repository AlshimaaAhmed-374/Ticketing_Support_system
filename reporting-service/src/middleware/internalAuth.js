const AppError = require("../utils/AppError");

const internalOnly = (req, _res, next) => {
  const token = req.headers["x-internal-token"];
  if (!token || token !== process.env.INTERNAL_SERVICE_TOKEN) {
    return next(new AppError(401, "Invalid internal service token"));
  }
  return next();
};

module.exports = { internalOnly };
