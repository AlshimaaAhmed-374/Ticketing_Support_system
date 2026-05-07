import { useEffect, useMemo, useState } from "react";
import { createTicket, getTickets } from "../services/ticketService";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { PriorityBadge } from "../components/PriorityBadge";
import { StatusBadge } from "../components/StatusBadge";
import { useToast } from "../hooks/useToast";
import { parseApiError } from "../api/axiosClient";
import { Link } from "react-router-dom";

export const UserDashboardPage = () => {
  const toast = useToast();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", description: "" });
  const [saving, setSaving] = useState(false);

  const loadTickets = async () => {
    setLoading(true);
    try {
      setTickets(await getTickets());
    } catch (error) {
      toast.error(parseApiError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createTicket(form);
      setForm({ title: "", description: "" });
      toast.success("Ticket created");
      await loadTickets();
    } catch (error) {
      toast.error(parseApiError(error));
    } finally {
      setSaving(false);
    }
  };

  const stats = useMemo(
    () => ({
      total: tickets.length,
      open: tickets.filter((x) => x.status === "open").length,
      inProgress: tickets.filter((x) => x.status === "in-progress").length,
      closed: tickets.filter((x) => x.status === "closed").length
    }),
    [tickets]
  );

  return (
    <div>
      <h2>User Dashboard</h2>
      <div className="stat-grid">
        <div className="card">Total: {stats.total}</div>
        <div className="card">Open: {stats.open}</div>
        <div className="card">In Progress: {stats.inProgress}</div>
        <div className="card">Closed: {stats.closed}</div>
      </div>

      <form className="card form-grid" onSubmit={onCreate}>
        <h3>Create Ticket</h3>
        <input placeholder="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea placeholder="Description" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button className="btn" disabled={saving}>{saving ? "Creating..." : "Create Ticket"}</button>
      </form>

      {loading ? (
        <LoadingSpinner />
      ) : tickets.length === 0 ? (
        <p className="empty-text">No tickets yet.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Title</th><th>Status</th><th>Assigned Agent</th></tr></thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket._id}>
                  <td><Link to={`/tickets/${ticket._id}`}>{ticket.title}</Link></td>
                  <td><StatusBadge status={ticket.status} /></td>
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
