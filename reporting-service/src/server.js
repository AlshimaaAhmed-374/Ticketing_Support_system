require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const axios = require("axios");

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(compression());
app.use(morgan("combined"));
app.use(express.json({ limit: "1mb" }));

const ticketClient = axios.create({ baseURL: process.env.TICKET_SERVICE_URL, timeout: 5000 });
const supportClient = axios.create({ baseURL: process.env.SUPPORT_SERVICE_URL, timeout: 5000 });

let cachedReport = null;

const loadData = async () => {
  const headers = { "x-internal-token": process.env.INTERNAL_SERVICE_TOKEN };
  const [ticketResp, supportResp] = await Promise.all([
    ticketClient.get("/tickets/internal/all", { headers }),
    supportClient.get("/support/internal/all", { headers })
  ]);
  return { tickets: ticketResp.data.data || [], supports: supportResp.data.data || [] };
};

const buildReport = ({ tickets, supports }) => {
  const totalTickets = tickets.length;
  const openTickets = tickets.filter((t) => t.status === "open").length;
  const inProgressTickets = tickets.filter((t) => t.status === "in-progress").length;
  const closedTickets = tickets.filter((t) => t.status === "closed").length;
  const highPriorityTickets = tickets.filter((t) => t.priority === "high").length;

  const responseCount = supports.reduce((sum, s) => sum + (s.responses ? s.responses.length : 0), 0);
  const averageResponsesPerTicket = totalTickets === 0 ? 0 : Number((responseCount / totalTickets).toFixed(2));

  const resolvedTicketsPerAgent = supports
    .filter((s) => s.status === "closed" && s.resolvedBy)
    .reduce((acc, s) => {
      acc[s.resolvedBy] = (acc[s.resolvedBy] || 0) + 1;
      return acc;
    }, {});

  return {
    totalTickets,
    openTickets,
    inProgressTickets,
    closedTickets,
    highPriorityTickets,
    averageResponsesPerTicket,
    resolvedTicketsPerAgent
  };
};

const compute = async () => {
  const data = await loadData();
  cachedReport = buildReport(data);
  return cachedReport;
};

app.get("/health", (_req, res) => res.json({ success: true, service: "reporting-service" }));

app.get("/report", async (_req, res) => {
  try {
    const report = await compute();
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    res.status(502).json({ success: false, message: "Failed to generate report", error: error.message });
  }
});

app.post("/report/recompute", async (_req, res) => {
  try {
    const report = await compute();
    res.status(200).json({ success: true, data: report });
  } catch (_error) {
    res.status(200).json({ success: true, message: "Recompute request accepted" });
  }
});

app.listen(Number(process.env.PORT || 5004));
