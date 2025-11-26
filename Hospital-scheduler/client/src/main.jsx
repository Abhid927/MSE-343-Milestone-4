// client/src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { AlertsProvider } from "./context/AlertsContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ToastProvider>
        <AlertsProvider>
          <App />
        </AlertsProvider>
      </ToastProvider>
    </AuthProvider>
  </React.StrictMode>
);
