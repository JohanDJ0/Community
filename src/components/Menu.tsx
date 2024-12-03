import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import logo from '../img/Abstract Colorful Technology Solutions Professional Logo (1).png';
import { useAuth0 } from '@auth0/auth0-react';
import { Stack } from '@mui/material';

const MenuP: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  const handleSignUp = () => {
    localStorage.setItem('isSignUp', 'true');

    loginWithRedirect({
      authorizationParams: {
        screen_hint: 'signup',
        redirect_uri: `${window.location.origin}/VistaRol`,
      },
    });
  };

  const handleLogin = () => {
    loginWithRedirect();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar sx={{ backgroundColor: 'white' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="Logo" style={{ marginRight: '10px', height: '40px' }} />
            <Typography
              variant="h6"
              component="div"
              sx={{
                color: 'black',
                fontWeight: 'bold',
                display: { xs: 'none', sm: 'block' }, // Ocultar en pantallas pequeñas
              }}
            >
              Community
            </Typography>
          </Box>
          <Box>
            <Stack spacing={2} direction="row">
              <Button
                variant="contained"
                onClick={handleLogin}
                color="inherit"
                sx={{ color: 'black' }}
              >
                Iniciar sesión
              </Button>
              <Button
                variant="outlined"
                onClick={handleSignUp}
                color="inherit"
                sx={{ color: 'black' }}
              >
                Regístrate
              </Button>
            </Stack>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default MenuP;
