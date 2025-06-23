import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import AuthComponent from './components/Auth';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ShipmentTracker from './components/ShipmentTracker';
import { setAuthToken } from './api/api';

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('home');
  const [tracking, setTracking] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');

  const handleLogin = (jwt, userObj) => {
    setUser(userObj);
    setAuthToken(jwt);
    setPage('dashboard');
  };

  const handleRegister = (email) => {
    setRegisteredEmail(email);
    setPage('login');
  };

  return (
    <div className="bg-white">
      <Navbar page={page} setPage={setPage} user={user} setUser={setUser}/>
      <div className="absolute inset-x-0 top-0 z-50">
         <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
        {page === 'home' && <Home />}
        {page === 'about' && <About />}
        {page === 'contact' && <Contact />}
        {!user && page === 'login' && (
          <>
            <AuthComponent onLogin={handleLogin} emailPrefill={registeredEmail}/>
            <div className="text-center mt-3">
              <button className="text-blue-600 hover:underline" onClick={()=>setPage('register')}>Need an account? Register</button>
            </div>
          </>
        )}
        {!user && page === 'register' && (
          <>
            <Register onRegister={handleRegister}/>
            <div className="text-center mt-3">
              <button className="text-blue-600 hover:underline" onClick={()=>setPage('login')}>Already have an account? Login</button>
            </div>
          </>
        )}
        {user && page === 'dashboard' && <Dashboard />}
        {user && page === 'tracking' && (
          <div className="max-w-lg mx-auto mt-6">
            <h3 className="text-xl font-semibold mb-2">Track a Shipment</h3>
            <input
              className="px-4 py-2 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full mb-3"
              value={tracking}
              onChange={e => setTracking(e.target.value)}
              placeholder="Enter tracking number"
            />
            {tracking && <ShipmentTracker trackingNumber={tracking} />}
          </div>
        )}
        </nav>
      </div>
    </div>
  );
}

export default App;
