import { notificationApi } from "../api/axiosClient";

// GET notifications
export const getNotifications = async (userId) => {
  const { data } = await notificationApi.get(
    `/notifications?userId=${encodeURIComponent(userId)}`
  );

  return data.data;
};

// POST notification
export const sendNotification = async (notificationData) => {
  const { data } = await notificationApi.post(
    "/notify",
    notificationData
  );

  return data;
};