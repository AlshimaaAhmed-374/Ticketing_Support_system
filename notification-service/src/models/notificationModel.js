const createNotificationPayload = ({ userId, message, ticketId }) => ({
  userId: String(userId),
  message: String(message),
  ticketId: String(ticketId),
  createdAt: new Date().toISOString()
});

module.exports = { createNotificationPayload };
