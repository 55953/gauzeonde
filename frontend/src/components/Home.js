import React from 'react';

export default function Home() {
  return (
    <div style={{maxWidth: 700, margin: '2rem auto', textAlign: 'center'}}>
      <h1>Welcome to Gauzeonde Transport</h1>
      <p>
        Gauzeonde is an innovative long-haul shipping platform that connects drivers and senders for fast, reliable, and flexible logistics across the country.
      </p>
      <h3>Why Choose Gauzeonde?</h3>
      <ul style={{textAlign: 'left', margin: '0 auto', maxWidth: 500}}>
        <li>🚚 Real-time shipment tracking on a live map</li>
        <li>🧑‍✈️ Verified drivers and transparent driver ratings</li>
        <li>🔄 Flexible shipment handoffs and dynamic routing</li>
        <li>📦 Easy booking and management for senders</li>
        <li>🖥️ Dispatcher dashboard for batch tracking and analytics</li>
      </ul>
      <h3>Ready to get started?</h3>
      <p>
        <b>Create an account</b> or <b>log in</b> to begin tracking your shipments or earning as a driver!
      </p>
    </div>
  );
}
