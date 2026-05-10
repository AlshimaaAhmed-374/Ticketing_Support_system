import { ticketApi } from "../api/axiosClient";

export const createTicket = async (payload) => {
  const { data } = await ticketApi.post("/", payload);
  return data.data;
};

export const getTickets = async () => {
  const { data } = await ticketApi.get("/");
  return data.data;
};

export const getTicketById = async (id) => {
  const { data } = await ticketApi.get(`${id}`);
  return data.data;
};

export const getUnassignedTickets = async () => {
  const { data } = await ticketApi.get("unassigned");
  return data.data;
};

export const getAssignedTicketsForMe = async () => {
  const { data } = await ticketApi.get("assigned/me");
  return data.data;
};

export const updateTicketPriority = async (id, priority) => {
  const { data } = await ticketApi.put(`${id}`, { priority });
  return data.data;
};
