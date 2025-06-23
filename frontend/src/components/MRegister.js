import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../config';
import { Box, Paper, Typography, TextField, Button, MenuItem, Alert } from '@mui/material';

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
    <Paper elevation={4} sx={{ maxWidth: 400, mx: 'auto', mt: 6, p: 5, borderRadius: 4 }}>
      <Typography variant="h5" color="primary" fontWeight={700} mb={2}>Create Account</Typography>
      {err && <Alert severity="error">{err}</Alert>}
      {msg && <Alert severity="success">{msg}</Alert>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <TextField name="name" label="Full Name" value={form.name} onChange={handleChange} required fullWidth />
        <TextField name="email" label="Email" type="email" value={form.email} onChange={handleChange} required fullWidth />
        <TextField name="phone" label="Phone Number" value={form.phone} onChange={handleChange} fullWidth />
        <TextField name="password" label="Password" type="password" value={form.password} onChange={handleChange} required fullWidth />
        <TextField
          name="role"
          label="Register as"
          select
          value={form.role}
          onChange={handleChange}
          fullWidth
        >
          {roleOptions.map(o => (
            <MenuItem value={o.value} key={o.value}>{o.label}</MenuItem>
          ))}
        </TextField>
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </Button>
      </form>
    </Paper>
  );
}
