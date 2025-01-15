import React, { useState, useEffect } from 'react';
import { Project, Payment } from '../types';
import {
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

interface PaymentFormProps {
  project: Project;
  onPaymentSuccess: (amount: number) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ project, onPaymentSuccess }) => {
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentType, setPaymentType] = useState<'Consulting Fee' | 'Bonus'>('Consulting Fee');
  const [submitting, setSubmitting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch(`http://localhost:3001/payments?projectId=${project.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch payments');
        }
        const data = await response.json();
        setPayments(data);
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setLoadingPayments(false);
      }
    };

    fetchPayments();
  }, [project.id]);

  const totalPaid = payments
    .filter(payment => payment.type === 'Consulting Fee')
    .reduce((sum, payment) => sum + payment.amount, 0);
    
  const totalBonuses = payments
    .filter(payment => payment.type === 'Bonus')
    .reduce((sum, payment) => sum + payment.amount, 0);
    
  const remainingBalance = project.balance - totalPaid;

  const handleAddPayment = async () => {
    const newPayment: Payment = {
      clientName: project.name,
      date: paymentDate,
      amount: paymentAmount,
      projectId: project.id,
      type: paymentType
    };

    setSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:3001/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPayment)
      });

      if (!response.ok) {
        throw new Error('Failed to save payment');
      }

      const savedPayment = await response.json();
      setPayments([...payments, savedPayment]);
      onPaymentSuccess(paymentAmount);
      setSnackbarMessage('Payment saved successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      // Clear form
      setPaymentDate('');
      setPaymentAmount(0);
    } catch (err) {
      setSnackbarMessage('Failed to save payment');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Add Payment for {project.name}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(Number(e.target.value))}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Payment Type</InputLabel>
              <Select
                value={paymentType}
                label="Payment Type"
                onChange={(e) => setPaymentType(e.target.value as 'Consulting Fee' | 'Bonus')}
              >
                <MenuItem value="Consulting Fee">Consulting Fee</MenuItem>
                <MenuItem value="Bonus">Bonus</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={handleAddPayment}
              fullWidth
              size="large"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : 'Add Payment'}
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, mt: 2, backgroundColor: '#f5f5f5' }}>
              <Typography variant="h6" gutterBottom>
                Payment Summary
              </Typography>
              <Typography>
                Total Budget: ₹{project.balance.toLocaleString()}
              </Typography>
              <Typography>
                Total Paid: ₹{totalPaid.toLocaleString()}
              </Typography>
              <Typography>
                Total Bonuses: ₹{totalBonuses.toLocaleString()}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Remaining Balance: ₹{remainingBalance.toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Payment History
              </Typography>
              {loadingPayments ? (
                <Typography>Loading payments...</Typography>
              ) : payments.length > 0 ? (
                <List>
                  {payments.map((payment) => (
                    <React.Fragment key={payment.id}>
                      <ListItem>
                        <ListItemText
                          primary={`₹${payment.amount.toLocaleString()} (${payment.type})`}
                          secondary={`Paid on ${new Date(payment.date).toLocaleDateString()}`}
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography>No payments recorded yet</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PaymentForm;
