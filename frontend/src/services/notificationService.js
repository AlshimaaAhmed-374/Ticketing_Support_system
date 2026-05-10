import { notificationApi } from "../api/axiosClient";

export const getNotifications = async (userId) => {
  const { data } = await notificationApi.get(
    `notifications?userId=${encodeURIComponent(userId)}`
  );
  return data.data;
};
