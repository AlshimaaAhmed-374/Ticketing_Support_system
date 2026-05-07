import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchAgents } from "../services/authService";
import { getTicketById, updateTicketPriority } from "../services/ticketService";
import {
  assignTicket,
  getSupportByTicket,
  resolveTicket,
  respondToTicket
} from "../services/supportService";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { parseApiError } from "../api/axiosClient";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { StatusBadge } from "../components/StatusBadge";
import { PriorityBadge } from "../components/PriorityBadge";
import { ResponseTimeline } from "../components/ResponseTimeline";

export const TicketDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();

  const [ticket, setTicket] = useState(null);
  const [support, setSupport] = useState({ responses: [] });
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [priority, setPriority] = useState("low");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);

    try {
      const [ticketData, supportData] = await Promise.all([
        getTicketById(id),
        getSupportByTicket(id)
      ]);

      setTicket(ticketData);
      setSupport(supportData);

      setPriority(ticketData.priority);
      setSelectedAgent(ticketData.assignedAgentId || "");

      if (user.role === "admin") {
        const agentsData = await fetchAgents();
        setAgents(agentsData);
      }
    } catch (error) {
      toast.error(parseApiError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const onAssign = async () => {
    try {
      if (!selectedAgent) {
        return toast.error("Select an agent");
      }

      await updateTicketPriority(id, priority);

      await assignTicket({
        ticketId: id,
        agentId: selectedAgent
      });

      toast.success("Ticket assigned");

      await load();
    } catch (error) {
      toast.error(parseApiError(error));
    }
  };

  const onRespond = async () => {
    try {
      if (!message.trim()) {
        return toast.error("Response message is required");
      }

      await respondToTicket({
        ticketId: id,
        message
      });

      setMessage("");

      toast.success("Response sent");

      await load();
    } catch (error) {
      toast.error(parseApiError(error));
    }
  };

  const onResolve = async () => {
    try {
      await resolveTicket(id);

      toast.success("Ticket resolved");

      await load();
    } catch (error) {
      toast.error(parseApiError(error));
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!ticket) {
    return <p className="empty-text">Ticket not found.</p>;
  }

  return (
    <div className="card">
      <h2>{ticket.title}</h2>

      <p>{ticket.description}</p>

      <p>
        Status: <StatusBadge status={ticket.status} />
      </p>

      {user.role !== "user" && (
        <p>
          Priority: <PriorityBadge priority={ticket.priority} />
        </p>
      )}
      <p>
        Assigned agent: {ticket.assignedAgentName || "-"}
      </p>

      <h3>Responses</h3>

      <ResponseTimeline responses={support.responses} />

      {/* ADMIN SECTION */}
      {user.role === "admin" && ticket.status !== "closed" && (
        <div className="form-grid">
          <h3>Assign Agent</h3>

          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
          >
            <option value="">Select agent</option>

            {agents.map((agent) => (
              <option key={agent._id} value={agent._id}>
                {agent.username} ({agent.email})
              </option>
            ))}
          </select>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="high">high</option>
            <option value="medium">medium</option>
            <option value="low">low</option>
          </select>

          <button className="btn" onClick={onAssign}>
            Assign
          </button>
        </div>
      )}

      {/* AGENT SECTION */}
      {user.role === "agent" && ticket.status !== "closed" && (
        <div className="form-grid">
          <h3>Agent Actions</h3>

          <textarea
            value={message}
            placeholder="Write response..."
            onChange={(e) => setMessage(e.target.value)}
          />

          <div className="row">
            <button className="btn" onClick={onRespond}>
              Send Response
            </button>

            <button className="btn success" onClick={onResolve}>
              Resolve Ticket
            </button>
          </div>
        </div>
      )}

      {/* CLOSED MESSAGE */}
      {ticket.status === "closed" && (
        <div className="closed-ticket-box">
          <h3>Ticket Closed</h3>
          <p>This ticket has already been resolved.</p>
        </div>
      )}
    </div>
  );
};