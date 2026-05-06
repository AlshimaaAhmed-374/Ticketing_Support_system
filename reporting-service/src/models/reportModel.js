const createReportPayload = ({
  totalTickets,
  openTickets,
  inProgressTickets,
  closedTickets,
  highPriorityTickets,
  averageResponsesPerTicket,
  resolvedTicketsPerAgent
}) => ({
  totalTickets,
  openTickets,
  inProgressTickets,
  closedTickets,
  highPriorityTickets,
  averageResponsesPerTicket,
  resolvedTicketsPerAgent
});

module.exports = { createReportPayload };
