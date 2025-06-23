import React, { useState } from 'react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Here you'd POST to your API endpoint or use a 3rd party email service
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section style={styles.section}>
        <div style={styles.card}>
          <h2 style={styles.title}>Thank You!</h2>
          <p style={styles.text}>Your message has been sent. We'll get back to you as soon as possible.</p>
        </div>
      </section>
    );
  }

  return (
    <section style={styles.section}>
      <div style={styles.card}>
        <h1 style={styles.title}>Contact Us</h1>
        <p style={styles.text}>Have questions or feedback? The Gauzeonde team is here for you.</p>
        <form style={styles.form} onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <textarea
            style={styles.textarea}
            name="message"
            placeholder="Type your message here..."
            value={form.message}
            onChange={handleChange}
            rows={4}
            required
          />
          <button type="submit" style={styles.button}>Send Message</button>
        </form>
        <div style={styles.infoBox}>
          <div style={{marginTop: 12}}>
            <span style={styles.infoLabel}>Email:</span> <a href="mailto:hello@gauzeonde.com" style={styles.infoLink}>hello@gauzeonde.com</a>
          </div>
          <div>
            <span style={styles.infoLabel}>Phone:</span> <a href="tel:+15551234567" style={styles.infoLink}>+1 555-123-4567</a>
          </div>
          <div>
            <span style={styles.infoLabel}>Head Office:</span> <span>123 Main St, Dallas, TX, USA</span>
          </div>
        </div>
      </div>
    </section>
  );
}

const styles = {
  section: { padding: "40px 0", background: "linear-gradient(90deg, #f3f6fb 0%, #eaf0fa 100%)" },
  card: { maxWidth: 500, margin: "auto", background: "#fff", borderRadius: 14, boxShadow: "0 8px 32px rgba(70, 118, 193, 0.12)", padding: 32 },
  title: { fontSize: 28, fontWeight: 700, color: "#1c3757" },
  text: { fontSize: 16, color: "#344b63", marginBottom: 20 },
  form: { display: "flex", flexDirection: "column", gap: 14 },
  input: { padding: "10px 12px", fontSize: 16, border: "1px solid #a2b4cc", borderRadius: 8 },
  textarea: { padding: "10px 12px", fontSize: 16, border: "1px solid #a2b4cc", borderRadius: 8 },
  button: { padding: "12px", fontWeight: 600, background: "linear-gradient(90deg, #3778c2 0%, #64b5f6 100%)", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 17, marginTop: 10 },
  infoBox: { marginTop: 25, padding: 14, background: "#f8fbff", borderRadius: 8, fontSize: 15, color: "#4a6693" },
  infoLabel: { fontWeight: 600, marginRight: 6 },
  infoLink: { color: "#3778c2", textDecoration: "none" }
};
