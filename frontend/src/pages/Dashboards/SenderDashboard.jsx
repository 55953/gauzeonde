import React, { useEffect, useRef, useState } from 'react';
import api from "../../api/api";
import { getUser, logout } from "../../auth";

export default function DriverDashboard({ user }) {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome {user.name}!</h1>
      <p>Track your sent shipments, view delivery status, request pickups, etc.</p>
      {/* Add shipment creation, tracking, etc. */}
    </div>
  );
}
