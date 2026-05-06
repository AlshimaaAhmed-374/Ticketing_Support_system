const { body, param } = require("express-validator");
const service = require("../services/supportService");

const assignValidation = [
  body("ticketId").notEmpty().withMessage("ticketId is required"),
  body("agentId").notEmpty().withMessage("agentId is required")
];
const respondValidation = [
  body("ticketId").notEmpty().withMessage("ticketId is required"),
  body("message").trim().notEmpty().withMessage("message is required")
];
const resolveValidation = [param("ticketId").notEmpty().withMessage("ticketId is required")];

const assign = async (req, res, next) => {
  try {
    const data = await service.assignTicket(req.body, req.headers.authorization);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const respond = async (req, res, next) => {
  try {
    const data = await service.respond(req.body, req.user);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const resolve = async (req, res, next) => {
  try {
    const data = await service.resolveTicket(req.params.ticketId, req.user);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getByTicket = async (req, res, next) => {
  try {
    const data = await service.getSupportByTicketId(req.params.ticketId, req.headers.authorization);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const internalAll = async (_req, res, next) => {
  try {
    const data = await service.allSupport();
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  assignValidation,
  respondValidation,
  resolveValidation,
  assign,
  respond,
  resolve,
  getByTicket,
  internalAll
};
