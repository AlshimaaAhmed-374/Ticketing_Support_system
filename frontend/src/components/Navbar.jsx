import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

export const Navbar = ({ notificationCount }) => {
  const { user, logout } = useAuth();
  const toast = useToast();

  const onLogout = () => {
    logout();
    toast.success("Logged out");
  };

  return (
    <header className="navbar">
      <div className="brand">Support Desk</div>
      <nav>
        <Link to="/notifications">Notifications ({notificationCount || 0})</Link>
        {(user?.role === "admin" || user?.role === "agent") && <Link to="/reports">Reports</Link>}
        <button className="btn secondary" onClick={onLogout}>
          Logout
        </button>
      </nav>
    </header>
  );
};
