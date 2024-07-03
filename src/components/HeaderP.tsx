import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import logo from '../img/Abstract Colorful Technology Solutions Professional Logo (1).png'; 
import {useAuth0} from '@auth0/auth0-react'
import { Stack } from '@mui/material';

const MenuP: React.FC = () => {
const { loginWithRedirect} = useAuth0()

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
            <Stack spacing={2} direction="row">
            <Button variant="contained" onClick={() => loginWithRedirect()} color="inherit" sx={{ color: 'black' }}>
              Login
            </Button>
            <Button variant="outlined" onClick={() => loginWithRedirect()} color="inherit" sx={{ color: 'black' }}>
              Sign up
            </Button>
            </Stack>

          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default MenuP;
