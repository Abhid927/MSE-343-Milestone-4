// client/src/components/AlertsSidebar.jsx
import { Box, Paper, Typography, List, ListItem, ListItemText, Divider } from "@mui/material";
import { useAlerts } from "../context/AlertsContext.jsx";

export default function AlertsSidebar() {
  const { alerts } = useAlerts();
  const hasAlerts = alerts && alerts.length > 0;

  return (
    <Paper
      sx={{
        width: "100%",
        borderRadius: 3,
        boxShadow: "0px 4px 12px rgba(15, 23, 42, 0.08)",
        p: 2,
        display: "flex",
        flexDirection: "column",
        minHeight: 100,
        maxHeight: 100,              // <--- cap total height of the card
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        Alerts
      </Typography>

      {!hasAlerts && (
        <Typography variant="body2" color="text.secondary">
          No alerts yet.
        </Typography>
      )}

      {hasAlerts && (
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",       // <--- scroll when many alerts
            mt: 0.5,
          }}
        >
          <List dense>
            {alerts.map((alert, idx) => (
              <Box key={alert.id ?? idx}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {alert.message ?? alert.text ?? "Alert"}
                      </Typography>
                    }
                    secondary={
                      alert.timestamp && (
                        <Typography variant="caption" color="text.secondary">
                          {new Date(alert.timestamp).toLocaleString()}
                        </Typography>
                      )
                    }
                  />
                </ListItem>
                {idx < alerts.length - 1 && <Divider component="li" />}
              </Box>
            ))}
          </List>
        </Box>
      )}
    </Paper>
  );
}
