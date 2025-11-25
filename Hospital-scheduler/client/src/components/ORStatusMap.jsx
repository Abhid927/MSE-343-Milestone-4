// client/src/components/ORStatusMap.jsx
import { useEffect, useState } from "react";
import { apiGetORs, apiUpdateOR } from "../api/client";
import { useToast } from "../context/ToastContext";
import { Box, Typography, Grid, Card, CardContent, Chip, MenuItem, Select } from "@mui/material";

const statusColors = {
  available: "success",
  occupied: "error",
  cleaning: "warning",
};

export default function ORStatusMap() {
  const [ors, setOrs] = useState([]);
  const { showToast } = useToast();

  useEffect(() => {
    (async () => {
      const data = await apiGetORs();
      setOrs(data);
    })();
  }, []);

  const handleStatusChange = async (id, status) => {
    const updated = await apiUpdateOR(id, status);
    setOrs((prev) => prev.map((o) => (o.id === id ? updated : o)));
    showToast(`OR status updated to ${status}`, "success");
  };

  return (
    <Box sx={{ p: 2, height: "100%", overflow: "auto" }}>
      <Typography variant="h6" gutterBottom>
        OR Status Map
      </Typography>
      <Grid container spacing={2}>
        {ors.map((room) => (
          <Grid item xs={6} key={room.id}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1">{room.name}</Typography>
                <Chip
                  label={room.status.toUpperCase()}
                  color={statusColors[room.status] || "default"}
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
        ))}
      </Grid>
    </Box>
  );
}
