import { NavLink } from "react-router-dom";
import { ROLES } from "../utils/constants";

export const Sidebar = ({ role }) => {
  return (
    <aside className="sidebar">
      {role === ROLES.USER && (
        <>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/tickets">My Tickets</NavLink>
        </>
      )}
      {role === ROLES.ADMIN && (
        <>
          <NavLink to="/admin/dashboard">Admin Dashboard</NavLink>
          <NavLink to="/tickets">All Tickets</NavLink>
          <NavLink to="/reports">Reports</NavLink>
        </>
      )}
      {role === ROLES.AGENT && (
        <>
          <NavLink to="/agent/dashboard">Agent Dashboard</NavLink>
          <NavLink to="/tickets">Assigned Tickets</NavLink>
          <NavLink to="/reports">Reports</NavLink>
        </>
      )}
      <NavLink to="/notifications">Notifications</NavLink>
    </aside>
  );
};
