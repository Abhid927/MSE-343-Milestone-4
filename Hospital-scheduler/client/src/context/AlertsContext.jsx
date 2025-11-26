// client/src/context/AlertsContext.jsx
import { createContext, useContext, useState, useCallback } from "react";

const AlertsContext = createContext(null);

export function AlertsProvider({ children }) {
  const [alerts, setAlerts] = useState([]);

  const addAlert = useCallback((message, meta = {}) => {
    setAlerts((prev) => [
      {
        id: Date.now() + Math.random(),
        message,
        meta,
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
  }, []);

  const clearAlerts = useCallback(() => setAlerts([]), []);

  return (
    <AlertsContext.Provider value={{ alerts, addAlert, clearAlerts }}>
      {children}
    </AlertsContext.Provider>
  );
}

export function useAlerts() {
  return useContext(AlertsContext);
}
