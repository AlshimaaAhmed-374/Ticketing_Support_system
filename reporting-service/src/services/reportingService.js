const axios = require("axios");
const AppError = require("../utils/AppError");
const { createReportPayload } = require("../models/reportModel");

const ticketClient = axios.create({
  baseURL: process.env.TICKET_SERVICE_URL,
  timeout: 6000
});

const supportClient = axios.create({
  baseURL: process.env.SUPPORT_SERVICE_URL,
  timeout: 6000
});

const priorityValue = { high: 3, medium: 2, low: 1 };

const sortByPriorityThenNewest = (a, b) => {
  const pA = priorityValue[a.priority] || 0;
  const pB = priorityValue[b.priority] || 0;
  if (pA !== pB) return pB - pA;
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
};

const loadData = async () => {
  const headers = { "x-internal-token": process.env.INTERNAL_SERVICE_TOKEN };
  try {
    const [ticketResp, supportResp] = await Promise.all([
      ticketClient.get("/tickets/internal/all", { headers }),
      supportClient.get("/support/internal/all", { headers })
    ]);

    return {
      tickets: Array.isArray(ticketResp.data?.data) ? ticketResp.data.data : [],
      supports: Array.isArray(supportResp.data?.data) ? supportResp.data.data : []
    };
  } catch (error) {
    throw new AppError(502, `Failed to fetch reporting dependencies: ${error.message}`);
  }
};

const computeReport = ({ tickets, supports }) => {
  const sortedTickets = [...tickets].sort(sortByPriorityThenNewest);
  const totalTickets = sortedTickets.length;
  const openTickets = sortedTickets.filter((t) => t.status === "open").length;
  const inProgressTickets = sortedTickets.filter((t) => t.status === "in-progress").length;
  const closedTickets = sortedTickets.filter((t) => t.status === "closed").length;
  const highPriorityTickets = sortedTickets.filter((t) => t.priority === "high").length;

  const totalResponses = supports.reduce((sum, supportDoc) => {
    const responses = Array.isArray(supportDoc.responses) ? supportDoc.responses.length : 0;
    return sum + responses;
  }, 0);

  const averageResponsesPerTicket =
    totalTickets === 0 ? 0 : Number((totalResponses / totalTickets).toFixed(2));

  const resolvedTicketsPerAgent = supports.reduce((acc, supportDoc) => {
    if (supportDoc.status === "closed" && supportDoc.resolvedBy) {
      acc[supportDoc.resolvedBy] = (acc[supportDoc.resolvedBy] || 0) + 1;
    }
    return acc;
  }, {});

  return createReportPayload({
    totalTickets,
    openTickets,
    inProgressTickets,
    closedTickets,
    highPriorityTickets,
    averageResponsesPerTicket,
    resolvedTicketsPerAgent
  });
};

const getReport = async () => {
  const data = await loadData();
  return computeReport(data);
};

module.exports = { getReport };
