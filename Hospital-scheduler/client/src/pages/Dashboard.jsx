// client/src/pages/Dashboard.jsx
import { useRef } from "react";
import { Box, Grid, Typography, Paper, Chip, Button } from "@mui/material";
import { useAuth } from "../context/AuthContext.jsx";
import TopBar from "../components/TopBar.jsx";
import CalendarView from "../components/CalendarView.jsx";
import ORStatusMap from "../components/ORStatusMap.jsx";
import AlertsSidebar from "../components/AlertsSidebar.jsx";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const calendarRef = useRef(null);

  let defaultView = "month";
  if (user.role === "nurse") defaultView = "week";
  if (user.role === "doctor") defaultView = "day";

  const handleNewAppointmentClick = () => {
    if (calendarRef.current && calendarRef.current.openNewAppointment) {
      calendarRef.current.openNewAppointment();
    }
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", background: "linear-gradient(135deg,rgb(13, 122, 196) 35%,rgb(112, 162, 227) 40%,rgb(18, 68, 102) 80%)" }}>
      {/* Left sidebar */}
      <Box
        sx={{
            width: 240,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(240,249,255,0.85) 100%)",
            backdropFilter: "blur(4px)",
            borderRight: "1px solid rgba(0,0,0,0.05)",
            display: "flex",
            flexDirection: "column",
            p: 3,
            boxShadow: "2px 0 8px rgba(0, 0, 0, 0.04)",
        }}
      >
        <Typography variant="h6" sx={{ mb: 4, fontWeight: 700 }}>
          MedScheduler
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Logged in as
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {user.name}
          </Typography>
          <Chip
            label={user.role.toUpperCase()}
            size="small"
            sx={{ mt: 1, bgcolor: "#E3F2FD" }}
          />
        </Box>
        <Box sx={{ mt: "auto", display: "flex", flexDirection: "column", gap: 1}}>
        <Button
            variant="contained"
            color="error"
            onClick={logout}
            sx={{
            borderRadius: 999,
            fontWeight: 600,
            textTransform: "none",
            }}
        >
            Log Out
        </Button>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
            Healthcare Scheduling
          </Typography>
        </Box>
      </Box>

      {/* Main content */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", background: "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(240,249,255,0.9) 100%)", }}>
        <TopBar />

        <Box
          sx={{
            p: 3,
            flex: 1,
            overflow: "auto",
          }}
        >
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage appointments and staff schedules
              </Typography>
            </Box>

            {user.role === "admin" && (
                <Button
                variant="contained"
                color="primary"
                onClick={handleNewAppointmentClick}
                sx={{
                    position: "fixed",
                    top: 80,
                    right: 32,
                    borderRadius: 999,
                    px: 3,
                    py: 1.6,
                    fontWeight: 700,
                    textTransform: "none",
                    boxShadow: 4,
                    zIndex: (theme) => theme.zIndex.tooltip + 1,
                }}
                >
                + New Appointment
                </Button>
            )}
          </Box>

          {/* Stats row (simple placeholders) */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {/* Left: the 4 stat cards (your existing logic) */}
            <Grid item xs={12}>
                <Grid container spacing={4} sx={{marginInline:7}}>
                {["Today's Appointments", "Pending", "Total Doctors", "Active Alerts"].map(
                    (label, idx) => (
                    <Grid item xs={12} sm={6} md={3} key={label}>
                        <Paper
                        sx={{
                            p: 2,
                            borderRadius: 3,
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            boxShadow: "0px 4px 12px rgba(15, 23, 42, 0.08)",
                        }}
                        >
                        <Typography variant="body2" color="text.secondary">
                            {label}
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                            {idx === 2 ? 3 : 0}
                        </Typography>
                        </Paper>
                    </Grid>
                    )
                )}
                </Grid>
            </Grid>

            {/* Right: Alerts box */}
            <Grid item xs={12}>
                <AlertsSidebar />
            </Grid>
            </Grid>
          {/* Calendar + Right column */}
          {/* Calendar + Right column */}
          <Box
  sx={{
    mt: 1,
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      lg: "minmax(0, 1fr) 400px",
    },
    gap: 2,
  }}
>
  {/* Calendar column */}
  <Box sx={{ minWidth: 0 }}>
    <CalendarView ref={calendarRef} defaultView={defaultView} />
  </Box>

  {/* Sidebar column */}
  <Box
    sx={{
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      gap: 2,
    }}
  >
    <Box sx={{ flex: 1, minHeight: 260, overflow: "hidden" }}>
      <ORStatusMap />
    </Box>
  </Box>
</Box>
        </Box>
      </Box>
    </Box>
  );
}
