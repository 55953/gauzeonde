import React from 'react';

export default function About() {
  return (
    <section className="py-12 bg-gradient-to-r from-blue-50 via-white to-blue-100">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-2">About Gauzeonde</h2>
        <p className="text-gray-700 mb-4">
          <span className="font-semibold text-blue-600">Gauzeonde Transport</span> is a digital logistics platform bringing speed, transparency, and control to nationwide shipping. Our mission is to connect senders and drivers, empower local businesses, and make every shipment traceable, reliable, and secure.
        </p>
        <ul className="list-disc ml-6 text-gray-600 mb-4">
          <li>Real-time shipment and driver tracking</li>
          <li>Trusted, KYC-verified driver network</li>
          <li>Live route optimization and shipment handoff</li>
          <li>Modern tools for dispatchers and fleet managers</li>
        </ul>
        <div className="mt-6 p-4 rounded-lg bg-blue-50">
          <h3 className="text-xl font-semibold text-blue-500 mb-1">Our Vision</h3>
          <p className="text-gray-700">
            Empower businesses, drivers, and customers with technology to move goods efficiently and safely—no matter the distance.
          </p>
        </div>
      </div>
    </section>
  );
}
