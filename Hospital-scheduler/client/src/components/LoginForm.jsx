// client/src/components/LoginForm.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

import {
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Chip,
  Stack,
} from "@mui/material";

import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showToast("Please enter both email and password.", "error");
      return;
    }

    setLoading(true);
    try {
      // Dummy password – authentication still based on email only
      const user = await login(email);
      showToast(`Logged in as ${user.role.toUpperCase()}`, "success");
    } catch {
      showToast("Login failed – check email", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #e0f2fe 0%, #eff6ff 40%, #e0f2fe 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 2, md: 4 },
      }}
    >
      {/* Centered portal card */}
      <Box sx={{ width: "100%", maxWidth: 1100 }}>
        <Paper
          elevation={10}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <Grid container>
            {/* Left hero / branding */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                px: { xs: 3, md: 5 },
                py: { xs: 4, md: 5 },
                bgcolor: "rgba(255,255,255,0.9)",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(circle at 10% 20%, rgba(56,189,248,0.18) 0, transparent 55%), radial-gradient(circle at 80% 0%, rgba(59,130,246,0.18) 0, transparent 60%)",
                  pointerEvents: "none",
                  opacity: 0.8,
                }}
              />

              <Box sx={{ position: "relative" }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 4 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      bgcolor: "#0f172a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 0 0 4px rgba(56,189,248,0.3)",
                    }}
                  >
                    <LocalHospitalIcon sx={{ color: "#38bdf8" }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a" }}>
                      MedScheduler
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      Hospital Staffing & OR Scheduling
                    </Typography>
                  </Box>
                </Stack>

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    maxWidth: 420,
                    lineHeight: 1.1,
                    color: "#0f172a",
                  }}
                >
                  Keep every OR, doctor, and nurse perfectly in sync.
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#4b5563",
                    maxWidth: 440,
                    mb: 3,
                  }}
                >
                  MedScheduler helps admins, nurses, and physicians manage operating
                  rooms, appointments, and time off from a single, unified view.
                </Typography>

                <Stack direction="row" spacing={1.5} sx={{ mb: 4, flexWrap: "wrap" }}>
                  <Chip
                    label="Live OR status tracking"
                    size="small"
                    sx={{
                      bgcolor: "#e0f2fe",
                      color: "#0f172a",
                      borderRadius: 999,
                    }}
                  />
                  <Chip
                    label="Role-based schedules"
                    size="small"
                    sx={{
                      bgcolor: "#e5e7eb",
                      color: "#111827",
                      borderRadius: 999,
                    }}
                  />
                </Stack>

                {/* Sample accounts */}
                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="caption"
                    sx={{ color: "#6b7280", fontWeight: 600 }}
                  >
                    Demo accounts
                  </Typography>
                  <Stack spacing={0.3} sx={{ mt: 0.5 }}>
                    <Typography variant="body2" sx={{ color: "#111827" }}>
                      Admin ·{" "}
                      <Box component="span" sx={{ fontFamily: "monospace" }}>
                        alice.admin@hospital.com
                      </Box>
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#111827" }}>
                      Nurse ·{" "}
                      <Box component="span" sx={{ fontFamily: "monospace" }}>
                        nina.nurse@hospital.com
                      </Box>
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#111827" }}>
                      Doctor ·{" "}
                      <Box component="span" sx={{ fontFamily: "monospace" }}>
                        dan.smith@hospital.com
                      </Box>
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#111827" }}>
                      Doctor ·{" "}
                      <Box component="span" sx={{ fontFamily: "monospace" }}>
                        priya.patel@hospital.com
                      </Box>
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#111827" }}>
                      Doctor ·{" "}
                      <Box component="span" sx={{ fontFamily: "monospace" }}>
                        miguel.rodriguez@hospital.com
                      </Box>
                    </Typography>
                  </Stack>
                </Box>
              </Box>
            </Grid>

            {/* Right login panel */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                px: { xs: 3, md: 5 },
                py: { xs: 4, md: 5 },
                bgcolor: "#f9fafb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box sx={{ width: "100%", maxWidth: 420 }}>
                <Stack spacing={1.5} sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "12px",
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <LockOutlinedIcon />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#0f172a" }}>
                    Staff Portal Login
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sign in with your hospital email to access the scheduling dashboard.
                  </Typography>
                </Stack>

                <Box component="form" onSubmit={handleSubmit}>
                  {/* Email */}
                  <TextField
                    label="Hospital Email"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MailOutlineIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* Password (dummy) */}
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon fontSize="small" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword((s) => !s)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    sx={{
                      mt: 3,
                      py: 1.2,
                      fontWeight: 600,
                      textTransform: "none",
                      borderRadius: 999,
                    }}
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </Button>
                </Box>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 2, display: "block", textAlign: "center" }}
                >
                  Password is for demo purposes only · Authentication is mocked for this
                  prototype
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
}
