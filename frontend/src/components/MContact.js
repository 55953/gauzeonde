import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Alert } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    // You would POST to your backend here
    setSent(true);
  };

  return (
    <Box sx={{ py: 6, background: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)' }}>
      <Paper elevation={3} sx={{ maxWidth: 500, mx: 'auto', p: 5, borderRadius: 4 }}>
        <Typography variant="h4" color="primary" fontWeight={700} mb={2}>Contact Us</Typography>
        {sent ? (
          <Alert severity="success" sx={{ mb: 2 }}>Thank you! Your message has been sent.</Alert>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <TextField
              name="name" label="Your Name" variant="outlined" fullWidth required
              value={form.name} onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              name="email" label="Your Email" type="email" variant="outlined" fullWidth required
              value={form.email} onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              name="message" label="Message" variant="outlined" fullWidth required multiline rows={4}
              value={form.message} onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" color="primary" size="large" sx={{ mt: 1 }}>
              Send Message
            </Button>
          </form>
        )}
        <Box mt={4} bgcolor="#e3f2fd" p={2} borderRadius={2}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <EmailIcon color="primary" /><Typography>hello@gauzeonde.com</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <PhoneIcon color="primary" /><Typography>+1 555-123-4567</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <HomeIcon color="primary" /><Typography>123 Main St, Dallas, TX, USA</Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
