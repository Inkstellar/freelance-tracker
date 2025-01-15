import React, { useState, useEffect } from 'react';
import { Paper, Typography, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid';

const ClientCountWidget = () => {
  const [clientCount, setClientCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClientCount = async () => {
      try {
        const response = await fetch('http://localhost:3001/clients');
        if (!response.ok) {
          throw new Error('Failed to fetch clients');
        }
        const clients = await response.json();
        setClientCount(clients.length);
      } catch (error) {
        setError('Failed to load client count');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientCount();
  }, []);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Total Clients
      </Typography>
      
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {clientCount}
            </Typography>
          </Grid>
        </Grid>
      )}
    </Paper>
  );
};

export default ClientCountWidget;
