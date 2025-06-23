import React, { useState } from 'react';
import { Auth } from '../api/api';

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
    <form
      onSubmit={handleLogin}
      className="max-w-md mx-auto mt-12 bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-4"
    >
      <h2 className="text-2xl font-bold text-blue-700 mb-2">Login</h2>
      {err && <div className="text-red-600">{err}</div>}
      <input
        className="px-4 py-2 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" required
      />
      <input
        className="px-4 py-2 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={password} type="password" onChange={e=>setPassword(e.target.value)} placeholder="Password" required
      />
      <button
        type="submit"
        className="bg-gradient-to-r from-blue-500 to-sky-400 text-white font-semibold py-2 rounded-lg mt-2 shadow-md hover:scale-105 transition"
      >
        Login
      </button>
    </form>
  );
}
