const requiredEnv = ["PORT", "TICKET_SERVICE_URL", "SUPPORT_SERVICE_URL", "INTERNAL_SERVICE_TOKEN"];

const validateEnv = () => {
  const missing = requiredEnv.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required env vars: ${missing.join(", ")}`);
  }
};

module.exports = { validateEnv };
