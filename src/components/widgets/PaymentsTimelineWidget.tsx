import React, { useEffect, useState } from "react";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";
import { Typography, CircularProgress, Box } from "@mui/material";
import axios from "axios";

const PaymentsTimeline = () => {
  interface Payment {
    id: string;
    type: string;
    amount: number;
    date: string;
  }
  
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch payments data
    const fetchPayments = async () => {
      try {
        const response = await axios.get("http://localhost:3001/payments");
        setPayments(response.data);
      } catch (err) {
        setError("Failed to fetch payments");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Timeline sx={{height:300,overflow:"auto"}}>
      {payments.map((payment) => (
        <TimelineItem key={payment.id}>
          <TimelineOppositeContent sx={{ flex: 0.2 }}>
              <Typography variant="caption" color="textSecondary">
                {new Date(payment.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </Typography>
            </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot color="primary" />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Typography variant="body1">
              ₹{" "}{payment.amount}
            </Typography>
            <Typography variant="caption" color="textSecondary">
            {payment.type} 
            </Typography>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};

export default PaymentsTimeline;