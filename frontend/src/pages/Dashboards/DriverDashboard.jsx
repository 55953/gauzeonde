import React, { useEffect, useRef, useState } from 'react';
import api from "../../api/api";
import { getUser, logout } from "../../auth";

export default function DriverDashboard({ user }) {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
   // For demo: compute total earnings
  const totalEarnings = shipments.reduce((sum, s) => sum + (s.payout || 0), 0);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    // Adjust endpoint as per your API
    api.get(`/drivers/${user.id}/shipments`)
      .then(res => setShipments(res.data))
      .catch(() => setShipments([]))
      .finally(() => setLoading(false));
  }, [user]);

 return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.name || user.email} (Driver)</h1>
      <div className="mb-6">
        <div className="font-semibold">Total Shipments: {shipments.length}</div>
        <div className="font-semibold">Total Earnings: ${totalEarnings.toFixed(2)}</div>
      </div>
      <h2 className="text-lg font-semibold mb-2">Current Shipments</h2>
      {loading ? (
        <div>Loading shipments...</div>
      ) : shipments.length === 0 ? (
        <div>No shipments assigned.</div>
      ) : (
        <table className="w-full border text-sm mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Tracking #</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Origin</th>
              <th className="border px-2 py-1">Destination</th>
              <th className="border px-2 py-1">Payout</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map(sh => (
              <tr key={sh.id}>
                <td className="border px-2 py-1">{sh.tracking_number}</td>
                <td className="border px-2 py-1">{sh.status}</td>
                <td className="border px-2 py-1">{sh.origin}</td>
                <td className="border px-2 py-1">{sh.destination}</td>
                <td className="border px-2 py-1">${sh.payout?.toFixed(2) || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
