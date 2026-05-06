const mongoose = require("mongoose");
const Support = require("../models/Support");
const { authClient, ticketClient, notificationClient, reportingClient, internalHeaders } = require("./httpClients");

const ensureObjectId = (value, field) => {
  if (!mongoose.Types.ObjectId.isValid(value)) throw { statusCode: 400, message: `${field} is invalid` };
};

const fetchTicket = async (ticketId, token) => {
  try {
    const { data } = await ticketClient.get(`/tickets/${ticketId}`, {
      headers: { Authorization: token }
    });
    return data.data;
  } catch (_error) {
    throw { statusCode: 404, message: "Ticket not found or inaccessible" };
  }
};

const fetchTicketInternal = async (ticketId) => {
  try {
    const { data } = await ticketClient.get(`/tickets/internal/${ticketId}`, internalHeaders());
    return data.data;
  } catch (_error) {
    throw { statusCode: 404, message: "Ticket not found" };
  }
};

const fetchAgent = async (agentId, token) => {
  try {
    const { data } = await authClient.get("/auth/users/agents", { headers: { Authorization: token } });
    return data.data.find((u) => u._id === agentId);
  } catch (_error) {
    throw { statusCode: 502, message: "Failed to fetch agents from auth-service" };
  }
};

const assignTicket = async ({ ticketId, agentId }, token) => {
  ensureObjectId(ticketId, "ticketId");
  ensureObjectId(agentId, "agentId");

  const ticket = await fetchTicket(ticketId, token);
  const agent = await fetchAgent(agentId, token);
  if (!agent) throw { statusCode: 400, message: "Selected agent is invalid" };
  if (ticket.status === "closed") throw { statusCode: 400, message: "Closed ticket cannot be reassigned" };

  const support = await Support.findOneAndUpdate(
    { ticketId },
    {
      $set: {
        assignedAgentId: agent._id,
        assignedAgentName: agent.username,
        status: "in-progress"
      },
      $setOnInsert: {
        ticketId
      }
    },
    { new: true, upsert: true }
  );

  await ticketClient.put(
    `/tickets/${ticketId}`,
    {
      assignedAgentId: agent._id,
      assignedAgentName: agent.username,
      status: "in-progress"
    },
    internalHeaders()
  );

  await notificationClient.post("/notify", {
    userId: agent._id,
    message: "A new ticket has been assigned to you",
    ticketId
  });

  return support.toObject();
};

const respond = async ({ ticketId, message }, user) => {
  ensureObjectId(ticketId, "ticketId");
  const ticket = await fetchTicketInternal(ticketId);
  if (!ticket.assignedAgentId || ticket.assignedAgentId.toString() !== user.userId) {
    throw { statusCode: 403, message: "Agent can respond only to assigned tickets" };
  }

  const support = await Support.findOneAndUpdate(
    { ticketId },
    {
      $setOnInsert: {
        ticketId,
        assignedAgentId: ticket.assignedAgentId,
        assignedAgentName: ticket.assignedAgentName
      },
      $push: {
        responses: {
          message,
          respondedBy: user.username,
          createdAt: new Date()
        }
      },
      $set: { status: "in-progress" }
    },
    { new: true, upsert: true }
  );

  await notificationClient.post("/notify", {
    userId: ticket.createdBy,
    message: "Agent responded to your ticket",
    ticketId
  });

  return support.toObject();
};

const resolveTicket = async (ticketId, user) => {
  ensureObjectId(ticketId, "ticketId");
  const ticket = await fetchTicketInternal(ticketId);
  if (!ticket.assignedAgentId || ticket.assignedAgentId.toString() !== user.userId) {
    throw { statusCode: 403, message: "Only assigned agent can resolve this ticket" };
  }

  const support = await Support.findOneAndUpdate(
    { ticketId },
    {
      $set: {
        status: "closed",
        resolvedBy: user.username,
        assignedAgentId: ticket.assignedAgentId,
        assignedAgentName: ticket.assignedAgentName
      },
      $setOnInsert: {
        ticketId
      }
    },
    { new: true, upsert: true }
  );

  await ticketClient.put(`/tickets/${ticketId}`, { status: "closed" }, internalHeaders());
  await notificationClient.post("/notify", {
    userId: ticket.createdBy,
    message: "Your ticket has been resolved",
    ticketId
  });
  await reportingClient.post("/report/recompute", {}, internalHeaders()).catch(() => null);

  return support.toObject();
};

const getSupportByTicketId = async (ticketId, token) => {
  ensureObjectId(ticketId, "ticketId");
  await fetchTicket(ticketId, token);
  const support = await Support.findOne({ ticketId }).lean();
  if (!support) {
    return {
      ticketId,
      assignedAgentId: null,
      assignedAgentName: null,
      responses: [],
      status: "in-progress"
    };
  }
  return support;
};

const allSupport = async () => Support.find({}).lean();

module.exports = { assignTicket, respond, resolveTicket, getSupportByTicketId, allSupport };
