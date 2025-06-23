import React from 'react';
import { Box, Paper, Typography, Button, Grid } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

export default function Home() {
  return (
    <Box sx={{ py: 6, background: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)', minHeight: '80vh' }}>
      <Paper elevation={4} sx={{ maxWidth: 700, mx: 'auto', p: 5, borderRadius: 4 }}>
        <Typography variant="h3" color="primary" fontWeight={700} align="center" mb={3}>
          Welcome to Gauzeonde
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center" mb={4}>
          Gauzeonde is redefining long-haul logistics—connecting drivers and senders with real-time tracking, live route transfers, and a transparent, modern dashboard.
        </Typography>
        <Grid container spacing={3} mb={4}>
          <Feature icon={<LocalShippingIcon color="primary" />} text="Live shipment tracking" />
          <Feature icon={<VerifiedUserIcon color="primary" />} text="Verified drivers & ratings" />
          <Feature icon={<AutorenewIcon color="primary" />} text="Smart handoffs & flexible routes" />
          <Feature icon={<AssignmentTurnedInIcon color="primary" />} text="Easy booking & management" />
        </Grid>
        <Box textAlign="center">
          <Button variant="contained" size="large" color="primary" href="#register">
            Get Started
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

function Feature({ icon, text }) {
  return (
    <Grid item xs={12} sm={6} display="flex" alignItems="center" gap={2}>
      {icon}
      <Typography variant="subtitle1">{text}</Typography>
    </Grid>
  );
}
