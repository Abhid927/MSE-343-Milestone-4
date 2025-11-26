// client/src/pages/Dashboard.jsx
import { useRef } from "react";
import { Box, Grid, Typography, Paper, Chip, Button } from "@mui/material";
import { useAuth } from "../context/AuthContext.jsx";
import TopBar from "../components/TopBar.jsx";
import CalendarView from "../components/CalendarView.jsx";
import ORStatusMap from "../components/ORStatusMap.jsx";
import AlertsSidebar from "../components/AlertsSidebar.jsx";

export default function Dashboard() {
  const { user } = useAuth();
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
    <Box sx={{ height: "100vh", display: "flex", bgcolor: "#F2F4F8" }}>
      {/* Left sidebar */}
      <Box
        sx={{
          width: 240,
          bgcolor: "white",
          borderRight: "1px solid #E0E3E7",
          display: "flex",
          flexDirection: "column",
          p: 3,
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
        <Box sx={{ mt: "auto" }}>
          <Typography variant="caption" color="text.secondary">
            Healthcare Scheduling
          </Typography>
        </Box>
      </Box>

      {/* Main content */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
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
                sx={{ borderRadius: 999, px: 3, py: 1.2, fontWeight: 600 }}
                onClick={handleNewAppointmentClick}
              >
                + NEW APPOINTMENT
              </Button>
            )}
          </Box>

          {/* Stats row (simple placeholders) */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
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

          {/* Calendar + Right column */}
          <Grid container spacing={2} sx={{ height: "calc(100vh - 230px)" }}>
            <Grid item xs={12} md={9} sx={{ height: "100%" }}>
              <CalendarView ref={calendarRef} defaultView={defaultView} />
            </Grid>
            <Grid item xs={12} md={3} sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <Box sx={{ flex: 1, minHeight: 260 }}>
                <ORStatusMap />
              </Box>
              <AlertsSidebar />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
