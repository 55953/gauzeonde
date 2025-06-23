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
    <form onSubmit={handleSubmit} style={{maxWidth: 400, margin: '2rem auto', border: '1px solid #ccc', padding: 20, borderRadius: 8}}>
      <h2>Create Your Account</h2>
      {err && <div style={{color:'red'}}>{err}</div>}
      {msg && <div style={{color:'green'}}>{msg}</div>}
      <input
        name="name" placeholder="Full Name"
        value={form.name} onChange={handleChange}
        style={{display:'block', width:'100%', margin:'10px 0'}}
        required
      />
      <input
        name="email" type="email" placeholder="Email"
        value={form.email} onChange={handleChange}
        style={{display:'block', width:'100%', margin:'10px 0'}}
        required
      />
      <input
        name="phone" placeholder="Phone Number"
        value={form.phone} onChange={handleChange}
        style={{display:'block', width:'100%', margin:'10px 0'}}
      />
      <input
        name="password" type="password" placeholder="Password"
        value={form.password} onChange={handleChange}
        style={{display:'block', width:'100%', margin:'10px 0'}}
        required
      />
      <label>Register as:</label>
      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        style={{display:'block', width:'100%', margin:'10px 0'}}
      >
        {roleOptions.map(o => (
          <option value={o.value} key={o.value}>{o.label}</option>
        ))}
      </select>
      <button type="submit" style={{width:'100%'}} disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}
