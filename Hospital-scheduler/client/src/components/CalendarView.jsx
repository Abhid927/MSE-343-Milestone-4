// client/src/components/CalendarView.jsx
import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";

import { Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { apiGetEvents, apiCreateEvent, apiUpdateEvent, apiSendAlert } from "../api/client.js";
import EventActionsMenu from "./EventActionsMenu.jsx";

// ----- date-fns localizer (NO require!) -----
const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export default function CalendarView({ defaultView }) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [events, setEvents] = useState([]);
  const [view, setView] = useState(defaultView || Views.MONTH);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    title: "",
    start: null,
    end: null,
    patientName: "",
  });

  // ---- load events from backend ----
  useEffect(() => {
    (async () => {
      try {
        const data = await apiGetEvents(user.role, user.id);
        setEvents(
          data.map((e) => ({
            ...e,
            start: new Date(e.start),
            end: new Date(e.end),
          }))
        );
      } catch (err) {
        console.error(err);
        showToast("Failed to load events", "error");
      }
    })();
  }, [user, showToast]);

  // ---- slot selection (create) ----
  const handleSelectSlot = ({ start, end }) => {
    // Admin: create appointment
    // Doctor: create time off
    if (user.role === "admin" || user.role === "doctor") {
      setIsEditing(false);
      setForm({
        title: user.role === "doctor" ? "Time Off" : "",
        start,
        end,
        patientName: "",
      });
      setOpenDialog(true);
    }
  };

  // ---- event selection ----
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  // ---- create / update event ----
  const handleCreateOrUpdate = async () => {
    try {
      if (isEditing && selectedEvent) {
        const updated = await apiUpdateEvent(user.role, user.id, selectedEvent.id, {
          title: form.title,
          patientName: form.patientName,
          start: form.start,
          end: form.end,
        });

        setEvents((prev) =>
          prev.map((e) =>
            e.id === updated.id
              ? { ...updated, start: new Date(updated.start), end: new Date(updated.end) }
              : e
          )
        );

        showToast("Event updated successfully", "success");
      } else {
        const newEvent = await apiCreateEvent(user.role, {
          title: form.title,
          patientName: user.role === "doctor" ? "N/A" : form.patientName || "N/A",
          start: form.start,
          end: form.end,
          doctorId: user.role === "doctor" ? user.id : 3, // simple example doctor assignment
          type: user.role === "doctor" ? "timeoff" : "appointment",
        });

        setEvents((prev) => [
          ...prev,
          { ...newEvent, start: new Date(newEvent.start), end: new Date(newEvent.end) },
        ]);

        showToast("Event created successfully", "success");
      }

      setOpenDialog(false);
    } catch (err) {
      console.error(err);
      showToast("Failed to save event", "error");
    }
  };

  // ---- Event actions from dropdown ----
  const handleModifyEvent = () => {
    if (!selectedEvent) return;
    setIsEditing(true);
    setForm({
      title: selectedEvent.title,
      patientName: selectedEvent.patientName || "",
      start: selectedEvent.start,
      end: selectedEvent.end,
    });
    setOpenDialog(true);
  };

  const handleAlertEvent = async () => {
    if (!selectedEvent) return;
    try {
      await apiSendAlert(
        `Change on event "${selectedEvent.title}"`,
        ["staff@hospital.com", "doctors@hospital.com"]
      );
      showToast("Alert sent successfully", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to send alert", "error");
    }
  };

  const handleViewEvent = () => {
    if (!selectedEvent) return;
    showToast(`Viewing "${selectedEvent.title}"`, "info");
  };

  const eventPropGetter = (event) => {
    const backgroundColor = event.type === "timeoff" ? "#ef9a9a" : "#90caf9";
    return {
      style: {
        backgroundColor,
      },
    };
  };

  const components = {
    event: ({ event }) => (
      <div style={{ position: "relative", paddingRight: "18px" }}>
        <div>{event.title}</div>
        {event.patientName && (
          <div style={{ fontSize: "0.75rem" }}>{event.patientName}</div>
        )}
        <div style={{ position: "absolute", top: 2, right: 0 }}>
          <EventActionsMenu
            onModify={handleModifyEvent}
            onAlert={handleAlertEvent}
            onView={handleViewEvent}
            setSelected={() => setSelectedEvent(event)}
          />
        </div>
      </div>
    ),
  };

  return (
    <Box sx={{ height: "100%", p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Schedule
      </Typography>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "calc(100% - 40px)" }}
        selectable
        view={view}
        onView={setView}
        views={[Views.DAY, Views.WEEK, Views.MONTH]}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventPropGetter}
        components={components}
      />

      {/* Create / Edit dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditing
            ? "Modify Event"
            : user.role === "doctor"
            ? "Book Time Off"
            : "Create Appointment"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
          {user.role !== "doctor" && (
            <TextField
              fullWidth
              margin="normal"
              label="Patient Name"
              value={form.patientName}
              onChange={(e) => setForm((f) => ({ ...f, patientName: e.target.value }))}
            />
          )}
          <Typography variant="body2" sx={{ mt: 2 }}>
            From: {form.start ? form.start.toString() : ""}
          </Typography>
          <Typography variant="body2">
            To: {form.end ? form.end.toString() : ""}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateOrUpdate}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
