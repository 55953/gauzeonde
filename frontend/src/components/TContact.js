import React, { useState } from 'react';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    // Here you'd POST to your backend
    setSent(true);
  };

  return (
    <section className="py-12 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">Contact Us</h2>
        {sent ? (
          <div className="text-green-600 text-xl">Thank you! Your message has been sent.</div>
        ) : (
          <>
            <p className="mb-4 text-gray-700">Questions or feedback? Reach out to the Gauzeonde team below.</p>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <input
                className="px-4 py-2 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                name="name" placeholder="Your Name" required value={form.name} onChange={handleChange}
              />
              <input
                className="px-4 py-2 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                name="email" type="email" placeholder="Your Email" required value={form.email} onChange={handleChange}
              />
              <textarea
                className="px-4 py-2 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                name="message" rows={4} placeholder="Type your message..." required value={form.message} onChange={handleChange}
              />
              <button type="submit" className="bg-gradient-to-r from-blue-500 to-sky-400 text-white font-semibold py-2 rounded-lg mt-2 shadow-md hover:scale-105 transition">
                Send Message
              </button>
            </form>
            <div className="mt-6 bg-blue-50 p-4 rounded text-sm text-blue-700">
              <div>Email: <a className="underline" href="mailto:info@gauzeonde.com">info@gauzeonde.com</a></div>
              <div>Phone: <a className="underline" href="tel:+17753917544">+1 775-391-7544</a></div>
              <div>Office: Reno, NV, USA</div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
