import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import {
  Container,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  CircularProgress,
  Box
} from '@mui/material';
import PaymentForm from './PaymentForm';

const Payments: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('http://localhost:3001/clients');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new TypeError("Response is not JSON");
        }
        
        const clients = await response.json();
        
        // Map clients to projects
        const projects = clients.map((client: any) => ({
          id: client.id.toString(),
          name: client.projectName,
          balance: client.budget,
          clientId: client.id.toString()
        }));
        
        setProjects(projects);
      } catch (err) {
        setError('Failed to load projects');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handlePaymentSuccess = (amount: number) => {
    if (!selectedProject) return;
    
    // Update project balance
    const updatedProjects = projects.map(p => 
      p.id === selectedProject.id ? 
      { ...p, balance: p.balance - amount } : 
      p
    );
    setProjects(updatedProjects);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
       <Typography variant="h4" component="h1" gutterBottom>
        Payments
      </Typography>
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="project-select-label">Select Project</InputLabel>
          <Select
            labelId="project-select-label"
            value={selectedProject?.id || ''}
            label="Select Project"
            onChange={(e) => {
              const project = projects.find(p => p.id === e.target.value);
              setSelectedProject(project || null);
            }}
          >
            <MenuItem value="">
              <em>Select a project</em>
            </MenuItem>
            {projects.map(project => (
              <MenuItem key={project.id} value={project.id}>
                {project.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {selectedProject && (
        <PaymentForm 
          project={selectedProject}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </Container>
    </Box>
  );
};

export default Payments;
