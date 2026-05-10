import { createContext, useMemo, useState } from "react";
import { ToastContainer } from "../components/ToastContainer";

export const ToastContext = createContext(null);

function nextToastId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    try {
      return crypto.randomUUID();
    } catch {
      /* non-secure HTTP origins may restrict randomUUID */
    }
  }
  return `t-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const push = (type, message) => {
    const id = nextToastId();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 3200);
  };

  const value = useMemo(
    () => ({
      success: (message) => push("success", message),
      error: (message) => push("error", message),
      info: (message) => push("info", message)
    }),
    []
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
};
