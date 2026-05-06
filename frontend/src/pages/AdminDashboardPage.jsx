import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTickets } from "../services/ticketService";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { PriorityBadge } from "../components/PriorityBadge";
import { StatusBadge } from "../components/StatusBadge";
import { useToast } from "../hooks/useToast";
import { parseApiError } from "../api/axiosClient";

export const AdminDashboardPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        setTickets(await getTickets());
      } catch (error) {
        toast.error(parseApiError(error));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {loading ? <LoadingSpinner /> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Title</th><th>Status</th><th>Priority</th><th>Agent</th></tr></thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket._id}>
                  <td><Link to={`/tickets/${ticket._id}`}>{ticket.title}</Link></td>
                  <td><StatusBadge status={ticket.status} /></td>
                  <td><PriorityBadge priority={ticket.priority} /></td>
                  <td>{ticket.assignedAgentName || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
