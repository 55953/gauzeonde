'use client'

import React from 'react';
import { useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export default function Navbar({ page, setPage, user, setUser }) {
  return (
    <nav className="bg-white shadow-sm py-3 px-6 flex items-center justify-between mb-8">
      <div className="text-2xl font-bold text-blue-600 tracking-wide cursor-pointer" onClick={()=>setPage('home')}>Gauzeonde</div>
      <div className="space-x-2">
        <NavBtn active={page==='home'} onClick={()=>setPage('home')}>Home</NavBtn>
        <NavBtn active={page==='about'} onClick={()=>setPage('about')}>About</NavBtn>
        <NavBtn active={page==='contact'} onClick={()=>setPage('contact')}>Contact</NavBtn>
        {!user && <NavBtn active={page==='login'} onClick={()=>setPage('login')}>Login</NavBtn>}
        {!user && <NavBtn active={page==='register'} onClick={()=>setPage('register')}>Register</NavBtn>}
        {user && <NavBtn active={page==='dashboard'} onClick={()=>setPage('dashboard')}>Dashboard</NavBtn>}
        {user && <NavBtn active={page==='tracking'} onClick={()=>setPage('tracking')}>Track</NavBtn>}
        {user && <NavBtn onClick={() => { setUser(null); setPage('home'); }}>Logout</NavBtn>}
      </div>
    </nav>
  );
}

function NavBtn({active, children, ...props}) {
  return (
    <button
      className={`px-4 py-2 rounded-md font-medium transition 
        ${active ? "bg-gradient-to-r from-blue-500 to-sky-400 text-white shadow-md" : "text-blue-600 hover:bg-blue-50"}`}
      {...props}
    >
      {children}
    </button>
  );
}
