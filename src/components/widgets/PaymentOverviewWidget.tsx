import React, { useState, useEffect } from 'react';
import { Paper, Typography, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Payment {
  date: string;
  amount: number;
  projectId: string;
  type: string;
  clientId: string;
}

interface Client {
  id: string;
  name: string;
}

const PaymentOverviewWidget = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paymentsResponse, clientsResponse] = await Promise.all([
          fetch('http://localhost:3001/payments'),
          fetch('http://localhost:3001/clients')
        ]);

        if (!paymentsResponse.ok || !clientsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const paymentsData = await paymentsResponse.json();
        const clientsData = await clientsResponse.json();

        setPayments(paymentsData);
        setClients(clientsData);
      } catch (error) {
        setError('Failed to load data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedClient]);

  const processData = () => {
    const filteredPayments = selectedClient === 'all' 
      ? payments 
      : payments.filter(p => p.projectId === selectedClient.toString());
      console.log("selectedClient:",selectedClient,"filteredPayments:",filteredPayments,"payments:",payments);

    const groupedData = filteredPayments.reduce((acc, payment) => {
      const date = new Date(payment.date);
      const formattedDate = date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
      
      if (!acc[formattedDate]) {
        acc[formattedDate] = {
          date: formattedDate,
          amount: 0,
          timestamp: date.getTime(),
          payments: []
        };
      }
      acc[formattedDate].amount += payment.amount;
      acc[formattedDate].payments.push({
        amount: payment.amount,
        type: payment.type,
        clientId: payment.clientId
      });
      return acc;
    }, {} as Record<string, { date: string; amount: number; timestamp: number; payments: { amount: number; type: string; clientId: string }[] }>);

    return Object.values(groupedData)
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(({ date, amount, payments }) => ({ 
        date, 
        amount,
        payments: payments.map(p => ({
          ...p,
          clientName: clients.find(c => c.id === p.clientId)?.name || 'Unknown'
        }))
      }));
  };

  const chartData = processData();

  return (
    <Paper sx={{ p: 3, height: 400 }}>
      <Typography variant="h6" gutterBottom>
        Payment Overview
      </Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Filter by Client</InputLabel>
        <Select
          value={selectedClient}
          label="Filter by Client"
          onChange={(e) => setSelectedClient(e.target.value)}
        >
          <MenuItem value="all">All Clients</MenuItem>
          {clients.map(client => (
            <MenuItem key={client.id} value={client.id}>
              {client.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={chartData} barCategoryGap={"35%"} margin={{
            bottom: 20,
          }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const payments = payload[0].payload.payments;
    // console.log("payments:",payments);
    return (
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          {label}
        </Typography>
        {payments.map((payment: any, index: number) => (
          <div key={index}>
            <Typography variant="body2">
               {payment.type}
            </Typography>
          </div>
        ))}
        <Typography variant="subtitle2" sx={{ mt: 1 }}>
          Total: ₹{payload[0].value.toLocaleString()}
        </Typography>
      </Paper>
    );
  }

  return null;
};

export default PaymentOverviewWidget;
