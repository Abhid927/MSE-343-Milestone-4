// client/src/components/ORStatusMap.jsx
import { useEffect, useState } from "react";
import { apiGetORs, apiUpdateOR, apiGetEvents } from "../api/client.js";
import { useToast } from "../context/ToastContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { Box, Typography, Grid, Card, CardContent, Chip, Select, MenuItem } from "@mui/material";

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

  useEffect(() => {
    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStatusChange = async (id, status) => {
    try {
      const updated = await apiUpdateOR(id, status, null);
      setOrs((prev) => prev.map((o) => (o.id === id ? updated : o)));
      showToast(`OR status updated to ${status}`, "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to update OR status", "error");
    }
  };

  const now = new Date();

  const effectiveStatus = (room) => {
    const ongoing = events.some(
      (e) => e.orNumber === room.id && e.start <= now && e.end >= now
    );
    if (ongoing) return "occupied";
    return room.status || "available";
  };

  const summary = ors.reduce(
    (acc, room) => {
      const status = effectiveStatus(room);
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    { available: 0, occupied: 0, cleaning: 0 }
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
                    sx={{ mt: 1, mb: 1 }}
                  />
                  <Select
                    fullWidth
                    size="small"
                    value={room.status}
                    onChange={(e) => handleStatusChange(room.id, e.target.value)}
                  >
                    <MenuItem value="available">Available</MenuItem>
                    <MenuItem value="occupied">Occupied</MenuItem>
                    <MenuItem value="cleaning">Cleaning</MenuItem>
                  </Select>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Box sx={{ mt: 2 }}>
        <Typography variant="caption">
          {summary.available} Available · {summary.occupied} Occupied ·{" "}
          {summary.cleaning} Cleaning
        </Typography>
      </Box>
    </Box>
  );
}
