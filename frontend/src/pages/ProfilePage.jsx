import React, { useState, useEffect } from "react";
import { getUser, setUser } from "../auth";
import api from "../api/api";

export default function ProfilePage() {
  const [profile, setProfile] = useState(getUser() || {});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // Handle form changes
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Save changes to backend
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    try {
      // Replace '/users/me' and method as per your API
      const res = await api.put(`/users/${profile.id}`, profile);
      setUser(res.data); // Update local storage
      setMsg("Profile updated!");
    } catch (err) {
      setMsg("Update failed.");
    }
    setSaving(false);
  };

  return (
    <div className="max-w-lg mx-auto mt-12 bg-white shadow p-8 rounded">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Edit Profile</h2>
      {msg && <div className="mb-4 text-green-700">{msg}</div>}
      <form onSubmit={handleSave} className="space-y-4">
        <input
          className="w-full border rounded p-2"
          name="name"
          placeholder="Full Name"
          value={profile.name || ""}
          onChange={handleChange}
        />
        <input
          className="w-full border rounded p-2"
          name="email"
          placeholder="Email"
          type="email"
          value={profile.email || ""}
          onChange={handleChange}
        />
        {/* Add more fields as needed: phone, address, etc. */}
        <button
          className="bg-blue-700 text-white px-4 py-2 rounded"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}
