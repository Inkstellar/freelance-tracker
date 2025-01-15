import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';

interface Payment {
  id: number;
  clientName: string;
  date: string;
  amount: number;
  projectId: string;
  type: string;
}
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar, PickersDay, PickersDayProps } from '@mui/x-date-pickers';
import { styled } from '@mui/material/styles';
import { Paper, Tooltip, Typography } from '@mui/material';


const HighlightedDay = styled(PickersDay)(({ theme }) => ({
  '&&': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
})) as typeof PickersDay;

export default function ResponsiveDatePickers() {
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    axios.get<Payment[]>('http://localhost:3001/payments')
      .then((response) => {
        setPayments(response.data);
      })
      .catch((error: Error) => {
        console.error('Error fetching payment dates:', error);
      });
  }, []);

  const getPaymentsForDate = (date: Dayjs) => {
    return payments.filter(payment => payment.date === date.format('YYYY-MM-DD'));
  };

  return (
    <Paper sx={{ p: 3 }}>
       <Typography variant="h6" component="h2" gutterBottom>
        Payments Calendar
      </Typography>
    <LocalizationProvider dateAdapter={AdapterDayjs} >
      <DateCalendar 
      sx={{m:0,width:"100%"}}
        defaultValue={payments.length > 0 ? dayjs(payments[0].date) : dayjs()}
        slots={{
          day: (props: PickersDayProps<Dayjs>) => {
            const { day, ...other } = props;
            const paymentsForDay = getPaymentsForDate(day);
            return paymentsForDay.length > 0 ? (
              <Tooltip 
              placement='top'
                title={
                  <div>
                    {paymentsForDay.map(payment => (
                      <div key={payment.id}>
                        {payment.clientName}: ₹{payment.amount} ({payment.type})
                      </div>
                    ))}
                  </div>
                }
                arrow
              >
                <HighlightedDay {...other} day={day} />
              </Tooltip>
            ) : (
              <PickersDay {...props} />
            );
          },
        }}
      />
    </LocalizationProvider>
    </Paper>
  );
}
