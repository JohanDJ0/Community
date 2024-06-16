import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import logo from '../img/Abstract Colorful Technology Solutions Professional Logo (1).png';
import { Link } from 'react-router-dom';

export default function MenuP() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: 'white' }}> 
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="Logo" style={{ marginRight: '10px', height: '40px' }} />
            <Typography variant="h6" component="div" sx={{ color: 'black' }}> 
              Community 
            </Typography>
          </Box>
          <Box>
            <Button component={Link} to="/login" color="inherit" sx={{ color: 'black' }}>
              Sign in
            </Button>
            <Link to="/Login" style={{ color: 'black', textDecoration: 'none', marginLeft: '10px' }}>
              Sign up
            </Link>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
