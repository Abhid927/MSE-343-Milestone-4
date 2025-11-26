// client/src/components/LoginForm.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Container, Box, TextField, Button, Typography, Paper } from "@mui/material";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const { login } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email);
      showToast(`Logged in as ${user.role.toUpperCase()}`, "success");
    } catch (err) {
      showToast("Login failed – check email", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Hospital Scheduler Login
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Use one of: alice.admin@hospital.com, nina.nurse@hospital.com, dan.smith@hospital.com
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
