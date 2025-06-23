import React from 'react';

export default function About() {
  return (
    <section style={styles.section}>
      <div style={styles.card}>
        <h1 style={styles.title}>About Gauzeonde Transport</h1>
        <p style={styles.text}>
          <b>Gauzeonde Transport</b> is revolutionizing long-haul shipping by connecting independent drivers and businesses with senders across the country. Our mission is to make logistics:
        </p>
        <ul style={styles.list}>
          <li><span style={styles.bullet}>•</span> Fast, flexible, and affordable</li>
          <li><span style={styles.bullet}>•</span> Safe and reliable through verified drivers</li>
          <li><span style={styles.bullet}>•</span> Transparent with live GPS tracking and handoff records</li>
          <li><span style={styles.bullet}>•</span> Simple to use for both shippers and drivers</li>
        </ul>
        <div style={styles.mission}>
          <h3 style={styles.subtitle}>Our Vision</h3>
          <p style={styles.text}>
            We empower small businesses, drivers, and anyone who needs to ship or earn by making logistics technology accessible to all. Every shipment is tracked, every handoff is secure, and every driver is supported by advanced tools and a passionate community.
          </p>
        </div>
      </div>
    </section>
  );
}

const styles = {
  section: { padding: "40px 0", background: "linear-gradient(90deg, #f3f6fb 0%, #eaf0fa 100%)" },
  card: { maxWidth: 650, margin: "auto", background: "#fff", borderRadius: 14, boxShadow: "0 8px 32px rgba(70, 118, 193, 0.11)", padding: 32 },
  title: { fontSize: 32, fontWeight: 700, margin: "0 0 10px 0", color: "#1c3757" },
  subtitle: { fontSize: 24, fontWeight: 600, margin: "22px 0 8px 0", color: "#4a6693" },
  text: { fontSize: 17, color: "#2a384b", margin: "12px 0" },
  list: { listStyle: "none", padding: 0, color: "#3a4e6e", fontSize: 17 },
  bullet: { color: "#3778c2", fontWeight: "bold", fontSize: 22, marginRight: 6 },
  mission: { marginTop: 24, background: "#f8fbff", borderRadius: 10, padding: 20 }
};
