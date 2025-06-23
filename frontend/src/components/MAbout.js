import React from 'react';
import { Box, Paper, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function About() {
  return (
    <Box sx={{ py: 6, background: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)' }}>
      <Paper elevation={3} sx={{ maxWidth: 600, mx: 'auto', p: 5, borderRadius: 4 }}>
        <Typography variant="h4" color="primary" fontWeight={600} mb={2}>About Gauzeonde</Typography>
        <Typography color="text.secondary" mb={3}>
          <b>Gauzeonde Transport</b> is a digital logistics platform bringing speed, transparency, and control to nationwide shipping. Our mission is to connect senders and drivers, empower local businesses, and make every shipment traceable, reliable, and secure.
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
            <ListItemText primary="Real-time shipment and driver tracking" />
          </ListItem>
          <ListItem>
            <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
            <ListItemText primary="Trusted, KYC-verified driver network" />
          </ListItem>
          <ListItem>
            <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
            <ListItemText primary="Live route optimization and shipment handoff" />
          </ListItem>
          <ListItem>
            <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
            <ListItemText primary="Modern tools for dispatchers and fleet managers" />
          </ListItem>
        </List>
        <Box mt={4} p={2} borderRadius={2} bgcolor="#f1f8e9">
          <Typography variant="h6" color="primary" fontWeight={500} mb={1}>Our Vision</Typography>
          <Typography color="text.secondary">
            Empower businesses, drivers, and customers with technology to move goods efficiently and safely—no matter the distance.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
