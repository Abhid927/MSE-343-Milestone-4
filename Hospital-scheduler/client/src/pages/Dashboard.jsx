// client/src/pages/Dashboard.jsx
import { Box, Grid } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import TopBar from "../components/TopBar";
import CalendarView from "../components/CalendarView";
import ORStatusMap from "../components/ORStatusMap";

export default function Dashboard() {
  const { user } = useAuth();

  // Default view based on role
  let defaultView = "month";
  if (user.role === "nurse") defaultView = "week";
  if (user.role === "doctor") defaultView = "day";

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <TopBar />
      <Grid container sx={{ flex: 1, overflow: "hidden" }}>
        <Grid item xs={12} md={8} sx={{ height: "100%", borderRight: "1px solid #eee" }}>
          <CalendarView defaultView={defaultView} />
        </Grid>
        <Grid item xs={12} md={4} sx={{ height: "100%" }}>
          <ORStatusMap />
        </Grid>
      </Grid>
    </Box>
  );
}
