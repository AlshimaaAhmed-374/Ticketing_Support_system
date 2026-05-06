const { body, param } = require("express-validator");
const ticketService = require("../services/ticketService");

const createValidation = [
  body("title").trim().notEmpty().withMessage("title is required"),
  body("description").trim().notEmpty().withMessage("description is required")
];
const idValidation = [param("id").notEmpty().withMessage("id is required")];

const updateValidation = [
  ...idValidation,
  body("priority").optional().isIn(["low", "medium", "high"]),
  body("status").optional().isIn(["open", "in-progress", "closed"])
];

const createTicket = async (req, res, next) => {
  try {
    const ticket = await ticketService.createTicket(req.body, req.user);
    res.status(201).json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
};

const getTickets = async (req, res, next) => {
  try {
    const data = await ticketService.listTickets(req.user);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getTicket = async (req, res, next) => {
  try {
    const data = await ticketService.getTicketById(req.params.id, req.user);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getTicketInternal = async (req, res, next) => {
  try {
    const data = await ticketService.getTicketByIdInternal(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const updateTicket = async (req, res, next) => {
  try {
    const data = await ticketService.updateTicket(req.params.id, req.body, req.user, req.isInternal);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const unassigned = async (_req, res, next) => {
  try {
    const data = await ticketService.listUnassigned();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const assignedMe = async (req, res, next) => {
  try {
    const data = await ticketService.listAssignedMe(req.user.userId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const internalAll = async (_req, res, next) => {
  try {
    const data = await ticketService.allTicketsForReporting();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createValidation,
  idValidation,
  updateValidation,
  createTicket,
  getTickets,
  getTicket,
  getTicketInternal,
  updateTicket,
  unassigned,
  assignedMe,
  internalAll
};
