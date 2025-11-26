// client/src/components/TopBar.jsx
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { useAuth } from "../context/AuthContext.jsx";

export default function TopBar() {
  const { user } = useAuth();

  const roleLabel =
    user.role.charAt(0).toUpperCase() + user.role.slice(1).toUpperCase();

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: "#1976d2",
      }}
    >
      <Toolbar
        sx={{
          px: 4,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          Hospital Scheduling – {roleLabel}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2">
            {user.name}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
