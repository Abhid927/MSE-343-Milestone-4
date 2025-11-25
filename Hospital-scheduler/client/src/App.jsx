// client/src/App.jsx
import { useAuth } from "./context/AuthContext.jsx";
import LoginForm from "./components/LoginForm.jsx";
import Dashboard from "./pages/Dashboard.jsx";

export default function App() {
  const { user } = useAuth();

  // While not logged in, show login screen
  if (!user) {
    return <LoginForm />;
  }

  // After login, show dashboard (calendar + OR map)
  return <Dashboard />;
}
