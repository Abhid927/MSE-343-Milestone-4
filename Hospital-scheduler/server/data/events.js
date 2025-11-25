// server/data/events.js

// event types: "appointment" | "timeoff"
let events = [
    {
      id: 1,
      title: "Knee Surgery - OR1",
      start: new Date().setHours(9, 0, 0, 0),
      end: new Date().setHours(10, 30, 0, 0),
      patientName: "John Doe",
      doctorId: 3,
      createdByRole: "admin",
      type: "appointment",
    },
    {
      id: 2,
      title: "Clinic Consults",
      start: new Date().setHours(11, 0, 0, 0),
      end: new Date().setHours(13, 0, 0, 0),
      patientName: "Multiple",
      doctorId: 3,
      createdByRole: "nurse",
      type: "appointment",
    },
    {
      id: 3,
      title: "Dr. Dan – Time Off",
      start: new Date().setHours(15, 0, 0, 0),
      end: new Date().setHours(17, 0, 0, 0),
      doctorId: 3,
      createdByRole: "doctor",
      type: "timeoff",
    },
  ];
  
  let nextId = 4;
  
  function createEvent(event) {
    const newEvent = { id: nextId++, ...event };
    events.push(newEvent);
    return newEvent;
  }
  
  function updateEvent(id, changes) {
    const idx = events.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    events[idx] = { ...events[idx], ...changes };
    return events[idx];
  }
  
  module.exports = { events, createEvent, updateEvent };
  