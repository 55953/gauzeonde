import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function Navbar({ page, setPage, user, setUser }) {
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main', cursor: 'pointer' }} onClick={() => setPage('home')}>
          Gauzeonde
        </Typography>
        <Box>
          <NavBtn active={page === 'home'} onClick={() => setPage('home')}>Home</NavBtn>
          <NavBtn active={page === 'about'} onClick={() => setPage('about')}>About</NavBtn>
          <NavBtn active={page === 'contact'} onClick={() => setPage('contact')}>Contact</NavBtn>
          {!user && <NavBtn active={page === 'login'} onClick={() => setPage('login')}>Login</NavBtn>}
          {!user && <NavBtn active={page === 'register'} onClick={() => setPage('register')}>Register</NavBtn>}
          {user && <NavBtn active={page === 'dashboard'} onClick={() => setPage('dashboard')}>Dashboard</NavBtn>}
          {user && <NavBtn active={page === 'tracking'} onClick={() => setPage('tracking')}>Track</NavBtn>}
          {user && <Button variant="outlined" sx={{ ml: 2 }} onClick={() => { setUser(null); setPage('home'); }}>Logout</Button>}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

function NavBtn({ active, children, ...props }) {
  return (
    <Button
      variant={active ? 'contained' : 'text'}
      sx={{
        mx: 0.5,
        bgcolor: active ? 'primary.main' : undefined,
        color: active ? '#fff' : 'primary.main',
        fontWeight: active ? 600 : 500
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
