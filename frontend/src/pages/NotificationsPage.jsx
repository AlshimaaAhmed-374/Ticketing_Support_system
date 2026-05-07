import { useEffect, useState } from "react";
import { getNotifications, sendNotification } from "../services/notificationService";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { parseApiError } from "../api/axiosClient";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { formatDateTime } from "../utils/format";

export const NotificationsPage = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [form, setForm] = useState({
    userId: user?.userId || "user-1",
    ticketId: "TCK-001",
    message: ""
  });

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await getNotifications(form.userId);
      setItems(data);
    } catch (error) {
      toast.error(parseApiError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSend = async (e) => {
    e.preventDefault();

    try {
      setSending(true);

      await sendNotification({
        userId: form.userId,
        ticketId: form.ticketId,
        message: form.message
      });

      toast.success("Notification sent successfully");
      setForm({ ...form, message: "" });
      await loadNotifications();
    } catch (error) {
      toast.error(parseApiError(error));
    } finally {
      setSending(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2>Notifications</h2>

      <form className="card" onSubmit={handleSend}>
        <h3>Send Notification</h3>

        <label>User ID</label>
        <input
          name="userId"
          value={form.userId}
          onChange={handleChange}
          placeholder="user-1"
          required
        />

        <label>Ticket ID</label>
        <input
          name="ticketId"
          value={form.ticketId}
          onChange={handleChange}
          placeholder="TCK-001"
          required
        />

        <label>Message</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Your ticket has been resolved"
          required
        />

        <button type="submit" disabled={sending}>
          {sending ? "Sending..." : "Send Notification"}
        </button>
      </form>

      <button onClick={loadNotifications}>
        Refresh Notifications
      </button>

      {!items.length ? (
        <p className="empty-text">No notifications yet.</p>
      ) : (
        <div className="card-list">
          {items.map((item, idx) => (
            <div className="card" key={`${item.ticketId}-${idx}`}>
              <h4>{item.message}</h4>
              <p>Ticket: {item.ticketId}</p>
              <p>{formatDateTime(item.createdAt)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};