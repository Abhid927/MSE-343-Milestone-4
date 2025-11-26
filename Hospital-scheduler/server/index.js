// server/index.js
const express = require("express");
const cors = require("cors");
const { users } = require("./data/users");
const { events, createEvent, updateEvent } = require("./data/events");
const { ors, updateORStatus } = require("./data/ors");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// ---------------- Login ----------------
app.post("/api/login", (req, res) => {
  const { email } = req.body;
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ message: "Invalid email" });
  }
  res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
});

// ---------------- Doctors list ----------------
app.get("/api/doctors", (req, res) => {
  const doctors = users.filter((u) => u.role === "doctor").map((d) => ({
    id: d.id,
    name: d.name,
    email: d.email,
  }));
  res.json(doctors);
});

// ---------------- Events ----------------
app.get("/api/events", (req, res) => {
  const { role, userId } = req.query;
  let filtered = events;

  if (role === "doctor" && userId) {
    const doctorId = Number(userId);
    filtered = events.filter((e) => e.doctorId === doctorId);
  }

  res.json(filtered);
});

// helper: check time overlap
function isOverlapping(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && aEnd > bStart;
}

// Create event (with double-booking checks)
app.post("/api/events", (req, res) => {
  const { role, userId } = req.body._context || {};
  const data = req.body.event;

  if (!role) return res.status(400).json({ message: "Missing role" });

  const start = new Date(data.start);
  const end = new Date(data.end);
  const doctorId = Number(data.doctorId);
  const orNumber = data.orNumber != null ? Number(data.orNumber) : null;

  // Permissions
  if (
    role !== "admin" &&
    !(role === "doctor" && data.type === "timeoff" && doctorId === Number(userId))
  ) {
    return res.status(403).json({ message: "Not allowed to create this event" });
  }

  // Double-booking check: same doctor or same OR overlapping
  const conflict = events.find(
    (e) =>
      isOverlapping(start, end, new Date(e.start), new Date(e.end)) &&
      ((doctorId && e.doctorId === doctorId) ||
        (orNumber != null && e.orNumber != null && e.orNumber === orNumber))
  );

  if (conflict) {
    return res.status(400).json({
      message:
        "Scheduling conflict: same doctor or OR is already booked in this time range.",
    });
  }

  const newEvent = createEvent({
    ...data,
    start,
    end,
    doctorId,
    orNumber,
    createdByRole: role,
  });

  res.status(201).json(newEvent);
});

// Update event
app.put("/api/events/:id", (req, res) => {
  const { role, userId } = req.body._context || {};
  const id = Number(req.params.id);
  const changes = req.body.changes;

  const existing = events.find((e) => e.id === id);
  if (!existing) return res.status(404).json({ message: "Event not found" });

  // Doctors can only modify their own events
  if (role === "doctor" && existing.doctorId !== Number(userId)) {
    return res.status(403).json({ message: "Cannot edit other doctors' events" });
  }

  const start = changes.start ? new Date(changes.start) : new Date(existing.start);
  const end = changes.end ? new Date(changes.end) : new Date(existing.end);
  const doctorId =
    changes.doctorId != null ? Number(changes.doctorId) : existing.doctorId;
  const orNumber =
    changes.orNumber != null ? Number(changes.orNumber) : existing.orNumber;

  // Double-booking check (ignore the event itself)
  const conflict = events.find(
    (e) =>
      e.id !== id &&
      isOverlapping(start, end, new Date(e.start), new Date(e.end)) &&
      ((doctorId && e.doctorId === doctorId) ||
        (orNumber != null && e.orNumber != null && e.orNumber === orNumber))
  );

  if (conflict) {
    return res.status(400).json({
      message:
        "Scheduling conflict: same doctor or OR is already booked in this time range.",
    });
  }

  const updated = updateEvent(id, {
    ...changes,
    start,
    end,
    doctorId,
    orNumber,
  });

  res.json(updated);
});

// ---------------- Alerts ----------------
app.post("/api/alerts", (req, res) => {
  const { message, recipients } = req.body;
  console.log("ALERT SENT:", { message, recipients });
  // In a real app, you'd send email/SMS/etc.
  res.json({ success: true });
});

// ---------------- OR status ----------------
app.get("/api/ors", (req, res) => {
    res.json(ors);
  });
  
  app.put("/api/ors/:id", (req, res) => {
    const id = Number(req.params.id);
    const { status, busyUntil } = req.body;
    const updated = updateORStatus(id, status, busyUntil || null);
    if (!updated) return res.status(404).json({ message: "OR not found" });
    res.json(updated);
  });

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
