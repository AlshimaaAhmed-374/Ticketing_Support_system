import { ticketApi } from "../api/axiosClient";

export const createTicket = async (payload) => {
  const { data } = await ticketApi.post("/tickets", payload);
  return data.data;
};

export const getTickets = async () => {
  const { data } = await ticketApi.get("/tickets");
  return data.data;
};

export const getTicketById = async (id) => {
  const { data } = await ticketApi.get(`/tickets/${id}`);
  return data.data;
};

export const getUnassignedTickets = async () => {
  const { data } = await ticketApi.get("/tickets/unassigned");
  return data.data;
};

export const getAssignedTicketsForMe = async () => {
  const { data } = await ticketApi.get("/tickets/assigned/me");
  return data.data;
};

export const updateTicketPriority = async (id, priority) => {
  const { data } = await ticketApi.put(`/tickets/${id}`, { priority });
  return data.data;
};
