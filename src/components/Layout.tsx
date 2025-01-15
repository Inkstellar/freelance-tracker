import React from 'react';
import { AppBar, Toolbar, Typography, Tabs, Tab } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const routes = ['/dashboard', '/clients', '/payments'];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const currentTab = routes.indexOf(location.pathname);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Inkstellar, Freelance Tracker
          </Typography>
          <Tabs value={currentTab}>
            <Tab 
              label="Dashboard" 
              component={Link} 
              to="/dashboard"
              sx={{
                '&.Mui-selected': {
                  color: 'white',
                  fontWeight: 'bold'
                }
              }}
            />
            <Tab 
              label="Clients" 
              component={Link} 
              to="/clients"
              sx={{
                '&.Mui-selected': {
                  color: 'white',
                  fontWeight: 'bold'
                }
              }}
            />
            <Tab 
              label="Payments" 
              component={Link} 
              to="/payments"
              sx={{
                '&.Mui-selected': {
                  color: 'white',
                  fontWeight: 'bold'
                }
              }}
            />
          </Tabs>
        </Toolbar>
      </AppBar>
      <main>{children}</main>
    </>
  );
}
