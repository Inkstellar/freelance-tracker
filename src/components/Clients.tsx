import React, { useEffect, useState } from 'react';
import { Box, Typography, Snackbar, Alert } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import ClientForm from './ClientForm';
import Grid from '@mui/material/Grid2';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Client Name', width: 200 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'phone', headerName: 'Phone', width: 150 },
];

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
}

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const fetchClients = async () => {
    try {
      const response = await fetch('http://localhost:3001/clients');
      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleClientAdded = () => {
    fetchClients();
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  return (
    <>
      <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Clients
      </Typography>
      <Grid container spacing={3}>
        <Grid size={8}>
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={clients}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10, page: 0 },
                },
              }}
              pageSizeOptions={[5,10,15]}
              checkboxSelection
              rowSelectionModel={selectedClient ? [selectedClient.id] : []}
              onRowSelectionModelChange={async (selection) => {
                if (selection.length > 0) {
                  const selectedId = selection[0] as string;
                  try {
                    const response = await fetch(`http://localhost:3001/clients/${selectedId}`);
                    if (!response.ok) {
                      throw new Error('Failed to fetch client details');
                    }
                    const client = await response.json();
                    setSelectedClient(client);
                  } catch (error) {
                    console.error('Error fetching client details:', error);
                    setSelectedClient(null);
                  }
                } else {
                  setSelectedClient(null);
                }
              }}
            />
          </div>
        </Grid>
        <Grid size={4}>
          <ClientForm 
            onClientAdded={handleClientAdded} 
            selectedClient={selectedClient}
            onClearSelection={() => setSelectedClient(null)}
          />
        </Grid>
      </Grid>
      </Box>
      <Snackbar
      open={openSnackbar}
      autoHideDuration={3000}
      onClose={handleCloseSnackbar}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
        Client added successfully!
      </Alert>
      </Snackbar>
    </>
  );
};

export default Clients;
