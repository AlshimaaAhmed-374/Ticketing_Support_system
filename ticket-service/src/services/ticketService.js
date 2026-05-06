const mongoose = require("mongoose");
const Ticket = require("../models/Ticket");
const { sortByPriorityThenNewest } = require("../utils/sort");

const assertValidObjectId = (value, fieldName) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw { statusCode: 400, message: `${fieldName} is invalid` };
  }
};

const createTicket = async ({ title, description }, user) => {
  return Ticket.create({
    title,
    description,
    createdBy: user.userId,
    createdByUsername: user.username
  });
};

const listTickets = async (user) => {
  let query = {};
  if (user.role === "user") query.createdBy = user.userId;
  if (user.role === "agent") query.assignedAgentId = user.userId;
  const tickets = await Ticket.find(query).lean();
  return tickets.sort(sortByPriorityThenNewest);
};

const listUnassigned = async () => {
  const tickets = await Ticket.find({ assignedAgentId: null }).lean();
  return tickets.sort(sortByPriorityThenNewest);
};

const listAssignedMe = async (agentId) => {
  const tickets = await Ticket.find({ assignedAgentId: agentId }).lean();
  return tickets.sort(sortByPriorityThenNewest);
};

const getTicketById = async (ticketId, user) => {
  assertValidObjectId(ticketId, "ticketId");
  const ticket = await Ticket.findById(ticketId).lean();
  if (!ticket) throw { statusCode: 404, message: "Ticket not found" };

  if (user.role === "user" && ticket.createdBy.toString() !== user.userId) {
    throw { statusCode: 403, message: "Forbidden" };
  }
  if (user.role === "agent") {
    const canSee = !ticket.assignedAgentId || ticket.assignedAgentId.toString() === user.userId;
    if (!canSee) throw { statusCode: 403, message: "Forbidden" };
  }
  return ticket;
};

const getTicketByIdInternal = async (ticketId) => {
  assertValidObjectId(ticketId, "ticketId");
  const ticket = await Ticket.findById(ticketId).lean();
  if (!ticket) throw { statusCode: 404, message: "Ticket not found" };
  return ticket;
};

const updateTicket = async (ticketId, payload, user, isInternal) => {
  assertValidObjectId(ticketId, "ticketId");
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) throw { statusCode: 404, message: "Ticket not found" };

  if (!isInternal) {
    if (user.role !== "admin") throw { statusCode: 403, message: "Only admin can update tickets" };
    if (payload.status && payload.status !== "in-progress") {
      throw { statusCode: 400, message: "Admin can only move status to in-progress during assignment" };
    }
  }

  if (payload.assignedAgentId !== undefined) ticket.assignedAgentId = payload.assignedAgentId;
  if (payload.assignedAgentName !== undefined) ticket.assignedAgentName = payload.assignedAgentName;
  if (payload.priority) ticket.priority = payload.priority;
  if (payload.status) ticket.status = payload.status;

  await ticket.save();
  return ticket.toObject();
};

const allTicketsForReporting = async () => {
  const tickets = await Ticket.find({}).lean();
  return tickets.sort(sortByPriorityThenNewest);
};

module.exports = {
  createTicket,
  listTickets,
  listUnassigned,
  listAssignedMe,
  getTicketById,
  getTicketByIdInternal,
  updateTicket,
  allTicketsForReporting
};
