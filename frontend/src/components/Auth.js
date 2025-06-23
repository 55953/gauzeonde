import React, { useState } from 'react';
import { Auth, setAuthToken} from '../api/api';

// Uncomment below if you use React Router v6+
// import { useNavigate } from 'react-router-dom';

export default function AuthComponent({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  // Uncomment if you use React Router v6+
  // const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    if (!email || !password) {
      setErr('Email and password are required');
      setLoading(false);
      return;
    }
    Auth.login(email, password)
      .then(res => {
        setAuthToken(res.data.token);
          // Optionally call a parent callback
          // if (onLogin) onLogin(res.data);
        onLogin(res.data.token, res.data.user);
        // Redirect to dashboard
        // Option 1: with React Router v6+
        // navigate('/dashboard');

        // Option 2: with window.location (universal)
        window.location.href = '/dashboard';
      })
      .catch(error => {
        setErr('Login failed: ' + error.response.data.messages.error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <form onSubmit={handleLogin} className="max-w-sm mx-auto mt-12 p-8 bg-white shadow-lg rounded">
      <h2 className="text-xl font-semibold mb-6">Login</h2>
      {err && <div className="mb-3 text-red-600" style={{color:'red'}}>{err}</div>}
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full mb-4 p-2 border rounded" autoFocus/>
      <input value={password} type="password" onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full mb-4 p-2 border rounded"/>
      <button 
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
