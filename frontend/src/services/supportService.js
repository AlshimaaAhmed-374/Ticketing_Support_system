import { supportApi } from "../api/axiosClient";

export const assignTicket = async (payload) => {
  const { data } = await supportApi.post("/assign", payload);
  return data.data;
};

export const respondToTicket = async (payload) => {
  const { data } = await supportApi.post("/respond", payload);
  return data.data;
};

export const resolveTicket = async (ticketId) => {
  const { data } = await supportApi.put(`/resolve/${ticketId}`);
  return data.data;
};

export const getSupportByTicket = async (ticketId) => {
  const { data } = await supportApi.get(`/support/${ticketId}`);
  return data.data;
};
