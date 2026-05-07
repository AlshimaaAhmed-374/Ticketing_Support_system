import { useEffect, useState } from "react";
import { getReport } from "../services/reportingService";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useToast } from "../hooks/useToast";
import { parseApiError } from "../api/axiosClient";
import { useAuth } from "../hooks/useAuth";

export const ReportsPage = () => {
  const toast = useToast();
  const { user } = useAuth();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        const data = await getReport();
        setReport(data);
      } catch (error) {
        toast.error(parseApiError(error));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (!report) {
    return <p className="empty-text">No report data.</p>;
  }

  return (
    <div>
      <h2>Reporting Dashboard</h2>

      <div className="stat-grid">
        <div className="card">Total: {report.totalTickets}</div>
        <div className="card">Open: {report.openTickets}</div>
        <div className="card">In Progress: {report.inProgressTickets}</div>
        <div className="card">Closed: {report.closedTickets}</div>
        <div className="card">High Priority: {report.highPriorityTickets}</div>
      </div>

      {/* ADMIN ONLY SECTION */}
      {user.role === "admin" && (
        <div className="card">
          <h3>Resolved Tickets Per Agent</h3>

          {!Object.keys(report.resolvedTicketsPerAgent || {}).length ? (
            <p className="empty-text">No resolved tickets yet.</p>
          ) : (
            <ul>
              {Object.entries(report.resolvedTicketsPerAgent).map(
                ([agent, count]) => (
                  <li key={agent}>
                    {agent}: {count}
                  </li>
                )
              )}
            </ul>
          )}
        </div>
      )}

      {/* AGENT ONLY SECTION */}
      {user.role === "agent" && (
        <div className="card">
          <h3>My Resolved Tickets</h3>
          <p>
            {report.resolvedTicketsPerAgent?.[user.username] || 0}
          </p>
        </div>
      )}
    </div>
  );
};