const { logInfo } = require("../utils/logger");
const { createNotificationPayload } = require("../models/notificationModel");

const inMemoryStore = [];

const notify = async ({ userId, message, ticketId }) => {
  const payload = createNotificationPayload({ userId, message, ticketId });

  inMemoryStore.push(payload);
  logInfo("Notification dispatched", payload);

  return {
    success: true,
    message: "Notification sent successfully"
  };
};

const listByUser = async (userId) => {
  return inMemoryStore
    .filter((item) => item.userId === String(userId))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

module.exports = { notify, listByUser };
