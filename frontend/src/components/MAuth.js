import React, { useState } from 'react';
import { Auth } from '../api/api';
import { Paper, Typography, TextField, Button, Alert } from '@mui/material';

export default function AuthComponent({ onLogin, emailPrefill }) {
  const [email, setEmail] = useState(emailPrefill || '');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await Auth.login(email, password);
      onLogin(res.data.token, res.data.user);
    } catch (error) {
      setErr('Login failed');
    }
  };

  return (
    <Paper elevation={4} sx={{ maxWidth: 400, mx: 'auto', mt: 8, p: 5, borderRadius: 4 }}>
      <Typography variant="h5" color="primary" fontWeight={700} mb={2}>Login</Typography>
      {err && <Alert severity="error">{err}</Alert>}
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <TextField value={email} onChange={e=>setEmail(e.target.value)} label="Email" type="email" required fullWidth />
        <TextField value={password} onChange={e=>setPassword(e.target.value)} label="Password" type="password" required fullWidth />
        <Button type="submit" variant="contained" color="primary">
          Login
        </Button>
      </form>
    </Paper>
  );
}
