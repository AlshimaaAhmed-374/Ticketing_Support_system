import { useEffect, useState } from "react";
import { getNotifications } from "../services/notificationService";
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

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        setItems(await getNotifications(user.userId));
      } catch (error) {
        toast.error(parseApiError(error));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user.userId]);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2>Notifications</h2>
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
