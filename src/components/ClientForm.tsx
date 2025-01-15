import React, { useState, useEffect } from 'react';
import { Client } from '../types';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
   InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  projectName: string;
  budget: number;
  dueDate: Date | null;
}

interface ClientFormProps {
  onClientAdded: () => void;
  selectedClient: Client | null;
  onClearSelection: () => void;
}

const ClientForm = ({ onClientAdded, selectedClient, onClearSelection }: ClientFormProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    email: '',
    phone: '',
    projectName: '',
    budget: 0,
    dueDate: null,
  });

  useEffect(() => {
    if (selectedClient) {
      setIsEditMode(true);
      setFormData({
        name: selectedClient.name,
        email: selectedClient.email,
        phone: selectedClient.phone,
        projectName: selectedClient.projectName || '',
        budget: selectedClient.budget || 0,
        dueDate: selectedClient.dueDate ? new Date(selectedClient.dueDate) : null,
      });
    } else {
      setIsEditMode(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        projectName: '',
        budget: 0,
        dueDate: null,
      });
    }
  }, [selectedClient]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEditMode 
        ? `http://localhost:3001/clients/${selectedClient?.id}`
        : 'http://localhost:3001/clients';
        
      const response = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
      
      // Reset form and notify parent
      onClearSelection();
      onClientAdded();
      
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          {isEditMode ? 'Edit Client' : 'Add New Client'}
        </Typography>
      <Grid container spacing={2}>
        <Grid size={12}>
          <TextField
            fullWidth
            label="Client Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </Grid>
        <Grid size={12}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </Grid>
        <Grid size={12}>
          <TextField
            fullWidth
            label="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            required
          />
        </Grid>
        <Grid size={12}>
          <TextField
            fullWidth
            label="Project Name"
            value={formData.projectName}
            onChange={(e) => setFormData({...formData, projectName: e.target.value})}
            required
          />
        </Grid>
        <Grid size={12}>
          <TextField
            fullWidth
            label="Budget"
            type="number"
            value={formData.budget}
            onChange={(e) => setFormData({...formData, budget: parseFloat(e.target.value)})}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
            required
          />
        </Grid>
        <Grid size={12}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Due Date"
              value={formData.dueDate}
              onChange={(newValue: Date | null) => {
                setFormData({...formData, dueDate: newValue});
              }}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid size={12}>
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth
            size="large"
          >
            {isEditMode ? 'Update Client' : 'Add Client'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ClientForm;
