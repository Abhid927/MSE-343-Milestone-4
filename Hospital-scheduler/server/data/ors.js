// server/data/ors.js

let ors = [
    { id: 1, name: "OR-1", status: "occupied" }, // "available" | "occupied" | "cleaning"
    { id: 2, name: "OR-2", status: "available" },
    { id: 3, name: "OR-3", status: "cleaning" },
    { id: 4, name: "OR-4", status: "available" },
  ];
  
  function updateORStatus(id, status) {
    const idx = ors.findIndex((o) => o.id === id);
    if (idx === -1) return null;
    ors[idx] = { ...ors[idx], status };
    return ors[idx];
  }
  
  module.exports = { ors, updateORStatus };
  