// client/src/components/EventActionsMenu.jsx
import { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export default function EventActionsMenu({ onModify, onAlert, onView, setSelected }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e) => {
    setSelected?.();
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  const handleClick = (cb) => {
    cb?.();
    handleClose();
  };

  return (
    <>
      <IconButton size="small" onClick={handleOpen}>
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => handleClick(onModify)}>Modify</MenuItem>
        <MenuItem onClick={() => handleClick(onAlert)}>Alert</MenuItem>
        <MenuItem onClick={() => handleClick(onView)}>View</MenuItem>
      </Menu>
    </>
  );
}
