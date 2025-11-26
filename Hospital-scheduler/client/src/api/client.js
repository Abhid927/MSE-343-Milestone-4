// client/src/api/client.js
const API_BASE = "http://localhost:4000/api";

async function handleRes(res) {
  if (!res.ok) {
    let msg = "Request failed";
    try {
      const data = await res.json();
      if (data?.message) msg = data.message;
    } catch {
      // ignore
    }
    throw new Error(msg);
  }
  return res.json();
}

export async function apiLogin(email) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return handleRes(res);
}

export async function apiGetEvents(role, userId) {
  const params = new URLSearchParams();
  if (role) params.append("role", role);
  if (userId) params.append("userId", userId);
  const res = await fetch(`${API_BASE}/events?` + params.toString());
  return handleRes(res);
}

export async function apiCreateEvent(role, userId, event) {
  const res = await fetch(`${API_BASE}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ _context: { role, userId }, event }),
  });
  return handleRes(res);
}

export async function apiUpdateEvent(role, userId, id, changes) {
  const res = await fetch(`${API_BASE}/events/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ _context: { role, userId }, changes }),
  });
  return handleRes(res);
}

export async function apiDeleteEvent(role, userId, eventId) {
    const res = await fetch(
      `${API_BASE}/events/${eventId}?role=${encodeURIComponent(role)}&userId=${encodeURIComponent(
        userId
      )}`,
      {
        method: "DELETE",
      }
    );
    return handleRes(res);
  }  

export async function apiSendAlert(message, recipients) {
  const res = await fetch(`${API_BASE}/alerts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, recipients }),
  });
  return handleRes(res);
}

export async function apiGetORs() {
  const res = await fetch(`${API_BASE}/ors`);
  return handleRes(res);
}

export async function apiUpdateOR(id, status, busyUntil = null) {
    const res = await fetch(`${API_BASE}/ors/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, busyUntil }),
    });
    return handleRes(res);
  }

export async function apiGetDoctors() {
  const res = await fetch(`${API_BASE}/doctors`);
  return handleRes(res);
}

