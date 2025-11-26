// client/src/components/CalendarView.jsx
import {
    useEffect,
    useState,
    forwardRef,
    useImperativeHandle,
  } from "react";
  import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
  import "react-big-calendar/lib/css/react-big-calendar.css";
  import { format, parse, startOfWeek, getDay } from "date-fns";
  import enUS from "date-fns/locale/en-US";
  import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
  import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
  import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

  
  import {
    Box,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
  } from "@mui/material";
  
  import { useAuth } from "../context/AuthContext.jsx";
  import { useToast } from "../context/ToastContext.jsx";
  import {
    apiGetEvents,
    apiCreateEvent,
    apiUpdateEvent,
    apiSendAlert,
    apiGetDoctors,
    apiUpdateOR,
    apiDeleteEvent,
  } from "../api/client.js";
  import { useAlerts } from "../context/AlertsContext.jsx";
  
  const locales = { "en-US": enUS };
  
  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales,
  });
  
  const doctorColorPalette = ["#BBDEFB", "#C8E6C9", "#FFF9C4", "#FFCCBC", "#D1C4E9"];
  
  const toInputDateTime = (date) =>
    date ? format(date, "yyyy-MM-dd'T'HH:mm") : "";
  
  const fromInputDateTime = (value) => (value ? new Date(value) : null);
  
  const CalendarView = forwardRef(function CalendarView({ defaultView }, ref) {
    const { user } = useAuth();
    const { showToast } = useToast();
    const { addAlert } = useAlerts();
  
    const [events, setEvents] = useState([]);
    const [currentView, setCurrentView] = useState(defaultView || Views.MONTH);
    const [doctors, setDoctors] = useState([]);
    const [doctorColors, setDoctorColors] = useState({});
  
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingEventId, setEditingEventId] = useState(null);
  
    const [eventDetailsOpen, setEventDetailsOpen] = useState(false);
    const [activeEvent, setActiveEvent] = useState(null);
  
    const [alertDialogOpen, setAlertDialogOpen] = useState(false);
    const [alertReason, setAlertReason] = useState("");
    const [alertEvent, setAlertEvent] = useState(null);
  
    const [form, setForm] = useState({
      title: "",
      start: null,
      end: null,
      patientName: "",
      orNumber: "",
      reason: "",
      doctorId: "",
    });
  
    // Expose "openNewAppointment" for the top-right button
    useImperativeHandle(
      ref,
      () => ({
        openNewAppointment() {
          const start = new Date();
          const end = new Date(start.getTime() + 60 * 60 * 1000);
          setIsEditing(false);
          setEditingEventId(null);
          setForm({
            title: "",
            start,
            end,
            patientName: "",
            orNumber: "",
            reason: "",
            doctorId: user.role === "doctor" ? user.id : "",
          });
          setOpenDialog(true);
        },
      }),
      [user.role, user.id]
    );
  
    // Load doctors
    useEffect(() => {
      (async () => {
        try {
          const list = await apiGetDoctors();
          setDoctors(list);
          const cm = {};
          list.forEach((d, idx) => {
            cm[d.id] = doctorColorPalette[idx % doctorColorPalette.length];
          });
          setDoctorColors(cm);
        } catch (err) {
          console.error(err);
          showToast("Failed to load doctors", "error");
        }
      })();
    }, [showToast]);
  
    // Load events
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
  
    const handleSelectSlot = ({ start, end }) => {
      if (user.role === "doctor") {
        setIsEditing(false);
        setEditingEventId(null);
        setForm({
          title: user.role === "doctor" ? "Time Off" : "",
          start,
          end,
          patientName: "",
          orNumber: "",
          reason: "",
          doctorId: user.role === "doctor" ? user.id : "",
        });
        setOpenDialog(true);
      }
    };
  
    const handleCreateOrUpdate = async () => {
      try {
        if (
            !form.title?.trim() ||
            !form.patientName?.trim() ||
            !form.orNumber ||
            !form.start ||
            !form.end ||
            (user.role !== "doctor" && !form.doctorId)
          ) {
            showToast(
              "Please fill in Title, Patient Name, OR #, Start time, End time, and Doctor.",
              "error"
            );
            return;
          }
          
          // Time ordering validation
          if (form.start >= form.end) {
            showToast("End time must be after the start time.", "error");
            return;
          }
  
        if (isEditing && editingEventId != null) {
          const updated = await apiUpdateEvent(user.role, user.id, editingEventId, {
            title: form.title,
            patientName: form.patientName,
            start: form.start,
            end: form.end,
            orNumber: form.orNumber ? Number(form.orNumber) : null,
            reason: form.reason,
            doctorId: form.doctorId,
          });
  
          setEvents((prev) =>
            prev.map((e) =>
              e.id === updated.id
                ? { ...updated, start: new Date(updated.start), end: new Date(updated.end) }
                : e
            )
          );
  
          addAlert(`Event updated: ${updated.title}`, { role: user.role });
          showToast("Event updated successfully", "success");
  
          if (user.role === "nurse") {
            await apiSendAlert(
              `Nurse ${user.name} updated "${updated.title}"`,
              ["staff@hospital.com", "doctors@hospital.com"]
            );
            addAlert(`Alert sent for update: ${updated.title}`, { role: user.role });
            showToast("Alert sent to staff", "success");
          }
        } else {
          const newEvent = await apiCreateEvent(user.role, user.id, {
            title: form.title,
            patientName: form.patientName,
            start: form.start,
            end: form.end,
            orNumber: form.orNumber ? Number(form.orNumber) : null,
            reason: form.reason,
            doctorId: form.doctorId || user.id,
            type: user.role === "doctor" ? "timeoff" : "appointment",
          });
  
          setEvents((prev) => [
            ...prev,
            {
              ...newEvent,
              start: new Date(newEvent.start),
              end: new Date(newEvent.end),
            },
          ]);
  
          addAlert(`New event created: ${newEvent.title}`, { role: user.role });
          showToast("Event created successfully", "success");
  
          if (newEvent.orNumber) {
            await apiUpdateOR(newEvent.orNumber, "occupied", newEvent.end);
          }
        }
  
        setOpenDialog(false);
      } catch (err) {
        console.error(err);
        showToast(err.message || "Failed to save event", "error");
      }
    };
  
    // Clicking an event (anywhere) -> opens details dialog with actions
    const handleEventClick = (event) => {
      setActiveEvent(event);
      setEventDetailsOpen(true);
    };
  
    const openModifyFromDetails = () => {
      if (!activeEvent) return;
      setIsEditing(true);
      setEditingEventId(activeEvent.id);
      setForm({
        title: activeEvent.title,
        start: activeEvent.start,
        end: activeEvent.end,
        patientName: activeEvent.patientName || "",
        orNumber: activeEvent.orNumber != null ? String(activeEvent.orNumber) : "",
        reason: activeEvent.reason || "",
        doctorId: activeEvent.doctorId || "",
      });
      setEventDetailsOpen(false);
      setOpenDialog(true);
    };
  
    const openAlertFromDetails = () => {
      if (!activeEvent) return;
      setAlertEvent(activeEvent);
      setAlertReason("");
      setEventDetailsOpen(false);
      setAlertDialogOpen(true);
    };
  
    const handleViewEvent = (event) => {
      const doc = doctors.find((d) => d.id === event.doctorId);
      showToast(
        `OR ${event.orNumber || "N/A"} • ${doc ? doc.name : "Unknown doctor"}`,
        "info"
      );
    };
  
    const confirmAlertSend = async () => {
      if (!alertEvent) return;
      try {
        const msg = `Alert for "${alertEvent.title}": ${alertReason || "No reason provided."}`;
        await apiSendAlert(msg, ["staff@hospital.com", "doctors@hospital.com"]);
        addAlert(msg, { role: user.role });
        showToast("Alert sent successfully", "success");
      } catch (err) {
        console.error(err);
        showToast("Failed to send alert", "error");
      } finally {
        setAlertDialogOpen(false);
        setAlertEvent(null);
        setAlertReason("");
      }
    };

    const handleDeleteEvent = async () => {
        if (!activeEvent) return;
    
        if (!window.confirm("Are you sure you want to delete this event?")) {
          return;
        }
    
        try {
          const deleted = await apiDeleteEvent(user.role, user.id, activeEvent.id);
    
          setEvents((prev) => prev.filter((e) => e.id !== deleted.id));
          addAlert(`Event deleted: ${deleted.title}`, { role: user.role });
          showToast("Event deleted successfully", "success");
        } catch (err) {
          console.error(err);
          showToast(err.message || "Failed to delete event", "error");
        } finally {
          setEventDetailsOpen(false);
        }
      };    
  
    const eventPropGetter = (event) => {
      const base = doctorColors[event.doctorId] || "#ECEFF1";
      return {
        style: {
          backgroundColor: base,
          borderRadius: "6px",
          border: "1px solid #CFD8DC",
          color: "#263238",
          fontSize: "0.75rem",
          padding: "2px 4px",
        },
      };
    };
  
    // Render events differently in month vs day/week
    const components = {
      event: ({ event }) => {
        const doc = doctors.find((d) => d.id === event.doctorId);
  
        if (currentView === Views.MONTH) {
          // Compact single-line label for month view (no cut-off)
          const label = `${format(event.start, "HH:mm")} · ${
            doc ? doc.name : "No doctor"
          } · OR ${event.orNumber || "N/A"}`;
  
          const tooltip = [
            `Title: ${event.title}`,
            event.patientName ? `Patient: ${event.patientName}` : "",
            doc ? `Doctor: ${doc.name}` : "",
            `OR: ${event.orNumber || "N/A"}`,
            `From: ${event.start.toString()}`,
            `To: ${event.end.toString()}`,
          ]
            .filter(Boolean)
            .join("\n");
  
          return (
            <div
              title={tooltip}
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {label}
            </div>
          );
        }
  
        // Detailed layout for day/week
        return (
          <div>
            <div style={{ fontWeight: 600 }}>{event.title}</div>
            {event.patientName && (
              <div style={{ fontSize: "0.7rem" }}>Patient: {event.patientName}</div>
            )}
            {doc && <div style={{ fontSize: "0.7rem" }}>Dr: {doc.name}</div>}
            {event.orNumber != null && (
              <div style={{ fontSize: "0.7rem" }}>OR #{event.orNumber}</div>
            )}
          </div>
        );
      },
    };

  const CANLENDER_HEIGHT = 620;

    return (
      <Box sx={{ height: CANLENDER_HEIGHT, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Schedule
        </Typography>
  
        <Box
          sx={{
            mt: 1,
            width: "100%",
            bgcolor: "white",
            borderRadius: 3,
            boxShadow: "0px 4px 16px rgba(15, 23, 42, 0.06)",
            p: 1.5,
          }}
        >
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: CANLENDER_HEIGHT, width: "100%"}}
            selectable
            view={currentView}
            onView={(newView) => setCurrentView(newView)}
            key={currentView}
            views={[Views.DAY, Views.WEEK, Views.MONTH]}
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleEventClick}
            eventPropGetter={eventPropGetter}
            popup   // "+X more" popup if truly too many events
          />
        </Box>
  
        {/* Create / Edit dialog */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {isEditing
              ? "Modify Appointment"
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
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Patient Name"
              value={form.patientName}
              onChange={(e) => setForm((f) => ({ ...f, patientName: e.target.value }))}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="OR #"
              type="number"
              value={form.orNumber}
              onChange={(e) => setForm((f) => ({ ...f, orNumber: e.target.value }))}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Reason"
              value={form.reason}
              onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
            />
  
            {/* Date & time controls */}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                    label="Start"
                    value={form.start}
                    onChange={(newValue) =>
                    setForm((f) => ({ ...f, start: newValue }))
                    }
                    minutesStep={15}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        fullWidth
                        margin="normal"
                        required
                    />
                    )}
                />

                <DateTimePicker
                    label="End"
                    value={form.end}
                    onChange={(newValue) =>
                    setForm((f) => ({ ...f, end: newValue }))
                    }
                    minutesStep={15}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        fullWidth
                        margin="normal"
                        required
                    />
                    )}
                />
                </LocalizationProvider>
  
            {user.role !== "doctor" && (
              <FormControl fullWidth margin="normal">
                <InputLabel id="doctor-select-label">Doctor</InputLabel>
                <Select
                  labelId="doctor-select-label"
                  label="Doctor"
                  value={form.doctorId}
                  onChange={(e) => setForm((f) => ({ ...f, doctorId: e.target.value }))}
                >
                  {doctors.map((d) => (
                    <MenuItem key={d.id} value={d.id}>
                      {d.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleCreateOrUpdate}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
  
        {/* Event details dialog (click an event) */}
        <Dialog
          open={eventDetailsOpen && !!activeEvent}
          onClose={() => setEventDetailsOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>{activeEvent?.title || "Event Details"}</DialogTitle>
          <DialogContent>
            {activeEvent && (
              <>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Patient: {activeEvent.patientName || "N/A"}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  OR: {activeEvent.orNumber || "N/A"}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Reason: {activeEvent.reason || "N/A"}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  From: {activeEvent.start.toString()}
                </Typography>
                <Typography variant="body2">
                  To: {activeEvent.end.toString()}
                </Typography>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEventDetailsOpen(false)}>Close</Button>
            <Button onClick={() => activeEvent && handleViewEvent(activeEvent)}>
              View Info
            </Button>
            <Button onClick={openAlertFromDetails}>Send Alert</Button>
            <Button variant="contained" onClick={openModifyFromDetails}>
              Modify
            </Button>
            {user.role === "admin" && (
            <Button
                color="error"
                variant="outlined"
                onClick={handleDeleteEvent}
            >
                Delete
            </Button>)}
          </DialogActions>
        </Dialog>
  
        {/* Alert reason dialog */}
        <Dialog
          open={alertDialogOpen}
          onClose={() => setAlertDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Send Alert</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Reason for alert
            </Typography>
            <TextField
              fullWidth
              multiline
              minRows={3}
              value={alertReason}
              onChange={(e) => setAlertReason(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAlertDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={confirmAlertSend}>
              Send
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  });
  
  export default CalendarView;
  