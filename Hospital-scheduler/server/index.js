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

// --- Login: detect role via email ---
app.post("/api/login", (req, res) => {
  const { email } = req.body;
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ message: "Invalid email" });
  }
  res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
});

// --- Get events, filtered slightly by role ---
app.get("/api/events", (req, res) => {
  const { role, userId } = req.query;
  let filtered = events;

  if (role === "doctor" && userId) {
    const doctorId = Number(userId);
    filtered = events.filter((e) => e.doctorId === doctorId);
  }

  // Admin / nurse see everything for now
  res.json(filtered);
});

// --- Create event (Admin & Doctor) ---
app.post("/api/events", (req, res) => {
  const { role } = req.body._context || {};
  const data = req.body.event;

  if (!role) return res.status(400).json({ message: "Missing role" });

  if (role !== "admin" && !(role === "doctor" && data.type === "timeoff")) {
    return res.status(403).json({ message: "Not allowed to create this event" });
  }

  const newEvent = createEvent({
    ...data,
    start: new Date(data.start),
    end: new Date(data.end),
    createdByRole: role,
  });

  res.status(201).json(newEvent);
});

// --- Update event (Admin & Nurse & Doctor (own)) ---
app.put("/api/events/:id", (req, res) => {
  const { role, userId } = req.body._context || {};
  const id = Number(req.params.id);
  const changes = req.body.changes;

  const existing = events.find((e) => e.id === id);
  if (!existing) return res.status(404).json({ message: "Event not found" });

  if (role === "doctor" && existing.doctorId !== Number(userId)) {
    return res.status(403).json({ message: "Cannot edit other doctors' events" });
  }

  // Nurses and admins can modify everything for simplicity
  const updated = updateEvent(id, {
    ...changes,
    ...(changes.start ? { start: new Date(changes.start) } : {}),
    ...(changes.end ? { end: new Date(changes.end) } : {}),
  });

  res.json(updated);
});

// --- Fake alert sending (just succeeds) ---
app.post("/api/alerts", (req, res) => {
  const { message, recipients } = req.body;
  console.log("ALERT SENT:", { message, recipients });
  res.json({ success: true });
});

// --- OR status endpoints ---
app.get("/api/ors", (req, res) => {
  res.json(ors);
});

app.put("/api/ors/:id", (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;
  const updated = updateORStatus(id, status);
  if (!updated) return res.status(404).json({ message: "OR not found" });
  res.json(updated);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
