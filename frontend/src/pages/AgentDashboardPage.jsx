import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAssignedTicketsForMe, getUnassignedTickets } from "../services/ticketService";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { PriorityBadge } from "../components/PriorityBadge";
import { StatusBadge } from "../components/StatusBadge";
import { parseApiError } from "../api/axiosClient";
import { useToast } from "../hooks/useToast";

export const AgentDashboardPage = () => {
  const [assigned, setAssigned] = useState([]);
  const [unassigned, setUnassigned] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [a, u] = await Promise.all([getAssignedTicketsForMe(), getUnassignedTickets()]);
        setAssigned(a);
        setUnassigned(u);
      } catch (error) {
        toast.error(parseApiError(error));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2>Agent Dashboard</h2>
      <h3>Assigned Tickets</h3>
      <div className="card-list">
        {assigned.length === 0 ? <p className="empty-text">No assigned tickets.</p> : assigned.map((ticket) => (
          <Link to={`/tickets/${ticket._id}`} className="card" key={ticket._id}>
            <h4>{ticket.title}</h4>
            <StatusBadge status={ticket.status} /> <PriorityBadge priority={ticket.priority} />
          </Link>
        ))}
      </div>

      <h3>Unassigned Tickets</h3>
      <div className="card-list">
        {unassigned.length === 0 ? <p className="empty-text">No unassigned tickets.</p> : unassigned.map((ticket) => (
          <Link to={`/tickets/${ticket._id}`} className="card" key={ticket._id}>
            <h4>{ticket.title}</h4>
            <StatusBadge status={ticket.status} /> <PriorityBadge priority={ticket.priority} />
          </Link>
        ))}
      </div>
    </div>
  );
};
