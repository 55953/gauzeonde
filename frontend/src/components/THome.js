import React from 'react';

export default function Home() {
  return (
    <section className="py-12 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-[80vh]">
      <div className="max-w-3xl mx-auto text-center bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">Welcome to Gauzeonde Transport</h1>
        <p className="text-lg text-gray-700 mb-6">
          Gauzeonde is redefining long-haul logistics—connecting drivers and senders with real-time tracking, live route transfers, and a transparent, modern dashboard.
        </p>
        <div className="grid grid-cols-2 gap-6 mb-8 max-w-xl mx-auto">
          <Feature icon="🚚" text="Live shipment tracking" />
          <Feature icon="🧑‍✈️" text="Verified drivers & ratings" />
          <Feature icon="🔄" text="Smart handoffs & flexible routes" />
          <Feature icon="📦" text="Easy booking & management" />
        </div>
        <div>
          <a href="#register" className="inline-block px-6 py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-500 to-sky-400 shadow-lg transition hover:scale-105">
            Get Started
          </a>
        </div>
      </div>
    </section>
  );
}

function Feature({icon, text}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-2xl">{icon}</span>
      <span className="text-base text-gray-600">{text}</span>
    </div>
  );
}
