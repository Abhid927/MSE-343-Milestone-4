// server/data/ors.js

let ors = [
    { id: 1, name: "OR-1", status: "available", busyUntil: null },
    { id: 2, name: "OR-2", status: "available", busyUntil: null },
    { id: 3, name: "OR-3", status: "available", busyUntil: null },
    { id: 4, name: "OR-4", status: "available", busyUntil: null },
  ];
  
  function updateORStatus(id, status, busyUntil = null) {
    const idx = ors.findIndex((o) => o.id === id);
    if (idx === -1) return null;
    ors[idx] = { ...ors[idx], status, busyUntil };
    return ors[idx];
  }
  
  module.exports = { ors, updateORStatus };
  