// client/src/components/AlertsSidebar.jsx
import { Box, Typography, Paper, List, ListItem, ListItemText } from "@mui/material";
import { useAlerts } from "../context/AlertsContext.jsx";
import { format } from "date-fns";

export default function AlertsSidebar() {
  const { alerts } = useAlerts();

  return (
    <Box sx={{ mt: 2 }}>
      <Paper
        sx={{
          p: 2,
          borderRadius: 3,
          height: 260,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
          Alerts
        </Typography>
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          {alerts.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No alerts yet.
            </Typography>
          ) : (
            <List dense>
              {alerts.map((a) => (
                <ListItem key={a.id} sx={{ alignItems: "flex-start" }}>
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {a.message}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(a.timestamp), "MMM d, HH:mm")}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
