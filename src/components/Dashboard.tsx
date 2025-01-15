import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import TotalEarningsWidget from './widgets/TotalEarningsWidget';
import PaymentOverviewWidget from './widgets/PaymentOverviewWidget';
import ClientCountWidget from './widgets/ClientCountWidget';
import CalendarWidget from './widgets/CalendarWidget';
import PaymentsTimeline from './widgets/PaymentsTimelineWidget';
// import PaymentsTimeline from './widgets/PaymentsTimelineWidget';
 
const Dashboard = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <TotalEarningsWidget />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <ClientCountWidget />
            </Grid>
            <Grid item xs={12}>
              <PaymentOverviewWidget />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={4}>
          <CalendarWidget/>
          <PaymentsTimeline />
          </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;