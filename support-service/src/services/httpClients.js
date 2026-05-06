const axios = require("axios");

const authClient = axios.create({ baseURL: process.env.AUTH_SERVICE_URL, timeout: 5000 });
const ticketClient = axios.create({ baseURL: process.env.TICKET_SERVICE_URL, timeout: 5000 });
const notificationClient = axios.create({ baseURL: process.env.NOTIFICATION_SERVICE_URL, timeout: 5000 });
const reportingClient = axios.create({ baseURL: process.env.REPORTING_SERVICE_URL, timeout: 5000 });

const internalHeaders = () => ({ headers: { "x-internal-token": process.env.INTERNAL_SERVICE_TOKEN } });

module.exports = { authClient, ticketClient, notificationClient, reportingClient, internalHeaders };
