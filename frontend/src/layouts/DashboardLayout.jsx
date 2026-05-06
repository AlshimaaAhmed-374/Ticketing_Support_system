import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { useAuth } from "../hooks/useAuth";
import { getNotifications } from "../services/notificationService";

export const DashboardLayout = () => {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const run = async () => {
      if (!user?.userId) return;
      try {
        const data = await getNotifications(user.userId);
        setCount(data.length);
      } catch (_e) {
        setCount(0);
      }
    };
    run();
  }, [user?.userId]);

  return (
    <div className="layout">
      <Navbar notificationCount={count} />
      <div className="layout-body">
        <Sidebar role={user?.role} />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
