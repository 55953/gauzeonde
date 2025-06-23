import React, { useState } from 'react';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import AuthComponent from './components/Auth';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ShipmentTracker from './components/ShipmentTracker';
import { setAuthToken } from './api/api';
import logo from './logo.svg';
import './App.css';

function Navbar({ page, setPage, user, setUser }) {
  return (
    <nav style={navStyle}>
      <div style={{fontWeight:800, fontSize:24, color:'#3778c2', letterSpacing:1}}>Gauzeonde</div>
      <div>
        <button style={navBtn(page==='home')} onClick={()=>setPage('home')}>Home</button>
        <button style={navBtn(page==='about')} onClick={()=>setPage('about')}>About</button>
        <button style={navBtn(page==='contact')} onClick={()=>setPage('contact')}>Contact</button>
        {!user && <button style={navBtn(page==='login')} onClick={()=>setPage('login')}>Login</button>}
        {!user && <button style={navBtn(page==='register')} onClick={()=>setPage('register')}>Register</button>}
        {user && <button style={navBtn(page==='dashboard')} onClick={()=>setPage('dashboard')}>Dashboard</button>}
        {user && <button style={navBtn(page==='tracking')} onClick={()=>setPage('tracking')}>Track Shipment</button>}
        {user && <button style={navBtn()} onClick={() => { setUser(null); setPage('home'); }}>Logout</button>}
      </div>
    </nav>
  );
}

const navStyle = { display:'flex', justifyContent:'space-between', alignItems:'center', background:'#f8fbff', padding:'10px 40px', borderBottom:'1px solid #dde5f2', marginBottom:24 };
const navBtn = (active=false) => ({
  background: active ? "linear-gradient(90deg,#3778c2,#64b5f6)" : "none",
  color: active ? "#fff" : "#3778c2",
  border: "none", borderRadius: 6, padding: "8px 16px", margin: "0 5px", cursor:"pointer", fontWeight: 600, fontSize:16
});

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [page, setPage] = useState('home');
  const [tracking, setTracking] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');

  const handleLogin = (jwt, userObj) => {
    setUser(userObj);
    setToken(jwt);
    setAuthToken(jwt);
    setPage('dashboard');
  };

  const handleRegister = (email) => {
    setRegisteredEmail(email);
    setPage('login');
  };
  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    setPage('home');
  }

  return (
    <div>
      <Navbar page={page} setPage={setPage} user={user} setUser={setUser}/>
      <div style={{maxWidth:1000, margin:"auto"}}>
        {page === 'home' && <Home />}
        {page === 'about' && <About />}
        {page === 'contact' && <Contact />}
        {!user && page === 'login' && (
          <>
            <AuthComponent onLogin={handleLogin} emailPrefill={registeredEmail}/>
            <div style={{textAlign:'center'}}><button onClick={()=>setPage('register')}>Need an account? Register</button></div>
          </>
        )}
        {!user && page === 'register' && (
          <>
            <Register onRegister={handleRegister}/>
            <div style={{textAlign:'center'}}><button onClick={()=>setPage('login')}>Already have an account? Login</button></div>
          </>
        )}
        {user && page === 'dashboard' && <Dashboard />}
        {user && page === 'tracking' && (
          <div style={{margin:'20px auto', maxWidth:450}}>
            <h3>Track a Shipment</h3>
            <input
              value={tracking}
              onChange={e => setTracking(e.target.value)}
              placeholder="Enter tracking number"
              style={{width:'100%', padding:12, fontSize:16, borderRadius:8, border:'1px solid #dde5f2', marginBottom:10}}
            />
            {tracking && <ShipmentTracker trackingNumber={tracking} />}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
