// client/src/api/client.js
const API_BASE = "http://localhost:4000/api";

export async function apiLogin(email) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function apiGetEvents(role, userId) {
  const params = new URLSearchParams();
  if (role) params.append("role", role);
  if (userId) params.append("userId", userId);
  const res = await fetch(`${API_BASE}/events?` + params.toString());
  return res.json();
}

export async function apiCreateEvent(role, event) {
  const res = await fetch(`${API_BASE}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ _context: { role }, event }),
  });
  if (!res.ok) throw new Error("Cannot create event");
  return res.json();
}

export async function apiUpdateEvent(role, userId, id, changes) {
  const res = await fetch(`${API_BASE}/events/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ _context: { role, userId }, changes }),
  });
  if (!res.ok) throw new Error("Cannot update event");
  return res.json();
}

export async function apiSendAlert(message, recipients) {
  const res = await fetch(`${API_BASE}/alerts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, recipients }),
  });
  return res.json();
}

export async function apiGetORs() {
  const res = await fetch(`${API_BASE}/ors`);
  return res.json();
}

export async function apiUpdateOR(id, status) {
  const res = await fetch(`${API_BASE}/ors/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return res.json();
}
