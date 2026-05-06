import { reportingApi } from "../api/axiosClient";

export const getReport = async () => {
  const { data } = await reportingApi.get("/report");
  return data.data;
};
