import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function AdminDashboard() {
  const [shipments, setShipments] = useState([]);
  const [users, setUsers] = useState([]);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    api.get("/shipments").then(res => setShipments(res.data)).catch(() => {});
    api.get("/users").then(res => setUsers(res.data)).catch(() => {});
    api.get("/drivers").then(res => setDrivers(res.data)).catch(() => {});
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-8 bg-white shadow p-8 rounded">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Admin Management</h2>

      <h3 className="text-xl font-semibold mt-6 mb-2">Shipments</h3>
      <table className="w-full mb-6 border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Tracking #</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Origin</th>
            <th className="border px-2 py-1">Destination</th>
          </tr>
        </thead>
        <tbody>
          {shipments.map(sh => (
            <tr key={sh.id}>
              <td className="border px-2 py-1">{sh.tracking_number}</td>
              <td className="border px-2 py-1">{sh.status}</td>
              <td className="border px-2 py-1">{sh.origin}</td>
              <td className="border px-2 py-1">{sh.destination}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="text-xl font-semibold mt-6 mb-2">Users</h3>
      <table className="w-full mb-6 border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="border px-2 py-1">{user.name}</td>
              <td className="border px-2 py-1">{user.email}</td>
              <td className="border px-2 py-1">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="text-xl font-semibold mt-6 mb-2">Drivers</h3>
      <table className="w-full mb-6 border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Last Location</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map(driver => (
            <tr key={driver.id}>
              <td className="border px-2 py-1">{driver.name}</td>
              <td className="border px-2 py-1">{driver.status}</td>
              <td className="border px-2 py-1">{driver.last_location || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
