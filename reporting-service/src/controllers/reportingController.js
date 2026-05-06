const asyncHandler = require("../utils/asyncHandler");
const reportingService = require("../services/reportingService");

const getReport = asyncHandler(async (_req, res) => {
  const data = await reportingService.getReport();
  res.status(200).json({ success: true, data });
});

const recompute = asyncHandler(async (_req, res) => {
  const data = await reportingService.getReport();
  res.status(200).json({ success: true, data });
});

module.exports = { getReport, recompute };
