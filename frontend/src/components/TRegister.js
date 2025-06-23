import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../config';

const roleOptions = [
  { label: 'Sender', value: 'sender' },
  { label: 'Driver', value: 'driver' }
];

export default function Register({ onRegister }) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', role: 'sender'
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setErr(''); setMsg('');
    if (!form.name || !form.email || !form.password) {
      setErr('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/auth/register`, form);
      setMsg('Registration successful! Please check your email or SMS for an activation code.');
      if (onRegister) onRegister(form.email);
    } catch (error) {
      setErr(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-8 bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-4"
      id="register"
    >
      <h2 className="text-2xl font-bold text-blue-700 mb-2">Create Account</h2>
      {err && <div className="text-red-600">{err}</div>}
      {msg && <div className="text-green-600">{msg}</div>}
      <input
        className="px-4 py-2 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        name="name" placeholder="Full Name" required value={form.name} onChange={handleChange}
      />
      <input
        className="px-4 py-2 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        name="email" type="email" placeholder="Email" required value={form.email} onChange={handleChange}
      />
      <input
        className="px-4 py-2 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange}
      />
      <input
        className="px-4 py-2 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        name="password" type="password" placeholder="Password" required value={form.password} onChange={handleChange}
      />
      <label className="text-gray-700 font-semibold mt-1">Register as:</label>
      <select
        className="px-4 py-2 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        name="role"
        value={form.role}
        onChange={handleChange}
      >
        {roleOptions.map(o => (
          <option value={o.value} key={o.value}>{o.label}</option>
        ))}
      </select>
      <button
        type="submit"
        className="bg-gradient-to-r from-blue-500 to-sky-400 text-white font-semibold py-2 rounded-lg mt-2 shadow-md hover:scale-105 transition"
        disabled={loading}
      >
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}
