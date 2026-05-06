import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { ROLES } from "./utils/constants";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { RoleRoute } from "./routes/RoleRoute";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { UserDashboardPage } from "./pages/UserDashboardPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AgentDashboardPage } from "./pages/AgentDashboardPage";
import { TicketsPage } from "./pages/TicketsPage";
import { TicketDetailsPage } from "./pages/TicketDetailsPage";
import { ReportsPage } from "./pages/ReportsPage";
import { NotificationsPage } from "./pages/NotificationsPage";

const HomeRedirect = () => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user.role === ROLES.ADMIN) return <Navigate to="/admin/dashboard" replace />;
  if (user.role === ROLES.AGENT) return <Navigate to="/agent/dashboard" replace />;
  return <Navigate to="/dashboard" replace />;
};

const App = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<HomeRedirect />} />
      <Route path="dashboard" element={<RoleRoute allowedRoles={[ROLES.USER]}><UserDashboardPage /></RoleRoute>} />
      <Route path="admin/dashboard" element={<RoleRoute allowedRoles={[ROLES.ADMIN]}><AdminDashboardPage /></RoleRoute>} />
      <Route path="agent/dashboard" element={<RoleRoute allowedRoles={[ROLES.AGENT]}><AgentDashboardPage /></RoleRoute>} />
      <Route path="tickets" element={<TicketsPage />} />
      <Route path="tickets/:id" element={<TicketDetailsPage />} />
      <Route path="reports" element={<RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.AGENT]}><ReportsPage /></RoleRoute>} />
      <Route path="notifications" element={<NotificationsPage />} />
    </Route>
    <Route path="*" element={<HomeRedirect />} />
  </Routes>
);

export default App;
