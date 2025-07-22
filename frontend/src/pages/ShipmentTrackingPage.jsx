import React, { useState } from "react";
import api from "../api/api";

export default function ShipmentTrackingPage() {
  const [tracking, setTracking] = useState("");
  const [shipment, setShipment] = useState(null);
  const [err, setErr] = useState("");

  const handleTrack = async (e) => {
    e.preventDefault();
    setErr(""); setShipment(null);
    try {
      // Use your endpoint for tracking
      const res = await api.get(`/shipments/track/${tracking}`);
      setShipment(res.data);
    } catch (e) {
      setErr("Shipment not found.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-12 bg-white shadow p-8 rounded">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Track Shipment</h2>
      <form onSubmit={handleTrack} className="flex space-x-2 mb-4">
        <input className="flex-1 border p-2 rounded" value={tracking} onChange={e => setTracking(e.target.value)} placeholder="Tracking Number"/>
        <button className="bg-blue-700 text-white px-4 py-2 rounded" type="submit">Track</button>
      </form>
      {err && <div className="text-red-600 mb-2">{err}</div>}
      {shipment && (
        <div className="border p-4 rounded bg-blue-50">
          <div><strong>Status:</strong> {shipment.status}</div>
          <div><strong>Origin:</strong> {shipment.origin}</div>
          <div><strong>Destination:</strong> {shipment.destination}</div>
          <div><strong>Current Location:</strong> {shipment.current_location}</div>
          {/* Add more fields as needed */}
        </div>
      )}
    </div>
  );
}
