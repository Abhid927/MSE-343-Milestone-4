// client/src/components/ORStatusMap.jsx
import { useEffect, useState } from "react";
import { apiGetORs, apiGetEvents } from "../api/client.js";
import { useToast } from "../context/ToastContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { Box, Typography, Grid, Card, CardContent, Chip } from "@mui/material";

const statusColors = {
  available: "success",
  occupied: "error",
  cleaning: "warning",
};

export default function ORStatusMap() {
  const [ors, setOrs] = useState([]);
  const [events, setEvents] = useState([]);
  const { showToast } = useToast();
  const { user } = useAuth();

  const loadData = async () => {
    try {
      const [orData, eventData] = await Promise.all([
        apiGetORs(),
        apiGetEvents(user.role, user.id),
      ]);
      setOrs(orData);
      setEvents(
        eventData.map((e) => ({
          ...e,
          start: new Date(e.start),
          end: new Date(e.end),
        }))
      );
    } catch (err) {
      console.error(err);
      showToast("Failed to load OR status", "error");
    }
  };

  // Initial load + auto-refresh every 3 seconds for near-instant updates
  useEffect(() => {
    loadData();
    const id = setInterval(loadData, 3000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const now = new Date();

  // Status is derived from schedule: occupied if any active event uses this OR
  const effectiveStatus = (room) => {
    const ongoing = events.some(
      (e) => e.orNumber === room.id && e.start <= now && e.end >= now
    );
    if (ongoing) return "occupied";
    return "available"; // default when no cases running
  };

  const summary = ors.reduce(
    (acc, room) => {
      const status = effectiveStatus(room);
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    { available: 0, occupied: 0 }
  );

  return (
    <Box sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}>
      <Typography variant="h6" gutterBottom>
        OR Status (Live)
      </Typography>
      <Grid container spacing={2} sx={{ flex: 1, overflowY: "auto" }}>
        {ors.map((room) => {
          const status = effectiveStatus(room);
          return (
            <Grid item xs={12} key={room.id}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {room.name}
                  </Typography>
                  <Chip
                    label={status.toUpperCase()}
                    color={statusColors[status] || "default"}
                    sx={{ mt: 1 }}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mt: 1 }}
                  >
                    Status updates automatically based on the OR schedule.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Box sx={{ mt: 2 }}>
        <Typography variant="caption">
          {summary.available} Available · {summary.occupied} Occupied
        </Typography>
      </Box>
    </Box>
  );
}
