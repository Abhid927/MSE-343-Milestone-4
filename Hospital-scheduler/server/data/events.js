// server/data/events.js

// event types: "appointment" | "timeoff"
let events = [
    {
      id: 1,
      title: "Knee Surgery",
      start: new Date().setHours(9, 0, 0, 0),
      end: new Date().setHours(10, 30, 0, 0),
      patientName: "John Doe",
      doctorId: 3,
      orNumber: 1,
      reason: "Elective surgery",
      createdByRole: "admin",
      type: "appointment",
    },
    {
      id: 2,
      title: "Emergency Appendectomy",
      start: new Date().setHours(11, 0, 0, 0),
      end: new Date().setHours(12, 30, 0, 0),
      patientName: "Jane Smith",
      doctorId: 4,
      orNumber: 2,
      reason: "Emergency",
      createdByRole: "nurse",
      type: "appointment",
    },
    {
      id: 3,
      title: "Dr. Dan – Time Off",
      start: new Date().setHours(15, 0, 0, 0),
      end: new Date().setHours(17, 0, 0, 0),
      patientName: "",
      doctorId: 3,
      orNumber: null,
      reason: "Conference",
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
  
  