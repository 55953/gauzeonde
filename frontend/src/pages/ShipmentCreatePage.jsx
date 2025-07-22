import React, { useState } from "react";
import api from "../api/api";
import { getUser } from "../auth";

export default function ShipmentCreatePage() {
  const user = getUser();
  const [form, setForm] = useState({
    sender_id: user?.id,
    recipient_name: "",
    recipient_phone: "",
    origin: "",
    destination: "",
    package_details: "",
    weight: "",
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      // Use your actual endpoint
      const res = await api.post("/shipments", form);
      setMsg("Shipment created! Tracking #: " + res.data.tracking_number);
    } catch (err) {
      setMsg("Failed to create shipment.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto mt-12 bg-white shadow p-8 rounded">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Create Shipment</h2>
      {msg && <div className="mb-4 text-green-700">{msg}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full border p-2 rounded" name="recipient_name" placeholder="Recipient Name" value={form.recipient_name} onChange={handleChange} required/>
        <input className="w-full border p-2 rounded" name="recipient_phone" placeholder="Recipient Phone" value={form.recipient_phone} onChange={handleChange} required/>
        <input className="w-full border p-2 rounded" name="origin" placeholder="Origin Address" value={form.origin} onChange={handleChange} required/>
        <input className="w-full border p-2 rounded" name="destination" placeholder="Destination Address" value={form.destination} onChange={handleChange} required/>
        <textarea className="w-full border p-2 rounded" name="package_details" placeholder="Package Details" value={form.package_details} onChange={handleChange} required/>
        <input className="w-full border p-2 rounded" name="weight" placeholder="Weight (kg)" value={form.weight} onChange={handleChange} type="number" min={0} required/>
        <button className="bg-blue-700 text-white px-4 py-2 rounded" disabled={loading}>{loading ? "Creating..." : "Create Shipment"}</button>
      </form>
    </div>
  );
}
