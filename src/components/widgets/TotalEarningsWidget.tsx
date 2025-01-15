import React, { useState, useEffect } from 'react';
import { Paper, Typography, CircularProgress } from '@mui/material';

interface Payment {
  amount: number;
}

interface TotalEarningsWidgetProps {
  onLoadingChange?: (loading: boolean) => void;
}

const TotalEarningsWidget: React.FC<TotalEarningsWidgetProps> = ({ onLoadingChange }) => {
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch('http://localhost:3001/payments');
        if (!response.ok) {
          throw new Error('Failed to fetch payments');
        }
        const payments: Payment[] = await response.json();
        const total = payments.reduce((sum, payment) => sum + payment.amount, 0);
        setTotalEarnings(total);
      } catch (error) {
        setError('Failed to load earnings data');
        console.error(error);
      } finally {
        setLoading(false);
        onLoadingChange?.(false);
      }
    };

    fetchPayments();
  }, [onLoadingChange]);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Total Earnings
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          ₹{totalEarnings.toLocaleString()}
        </Typography>
      )}
    </Paper>
  );
};

export default TotalEarningsWidget;
