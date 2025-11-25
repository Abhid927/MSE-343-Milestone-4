// client/src/context/ToastContext.jsx
import { createContext, useContext, useState, useCallback } from "react";
import AlertSnackbar from "../components/AlertSnackbar";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ open: false, message: "", severity: "info" });

  const showToast = useCallback((message, severity = "info") => {
    setToast({ open: true, message, severity });
  }, []);

  const handleClose = () => setToast((t) => ({ ...t, open: false }));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <AlertSnackbar toast={toast} onClose={handleClose} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
