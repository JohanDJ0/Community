import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Groups2SharpIcon from '@mui/icons-material/Groups2Sharp';
import Typography from '@mui/material/Typography';
import PersonSharpIcon from '@mui/icons-material/PersonSharp';
import EmojiEventsSharpIcon from '@mui/icons-material/EmojiEventsSharp';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import GTranslateSharpIcon from '@mui/icons-material/GTranslateSharp';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import PersonIcon from '@mui/icons-material/Person';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SearchIcon from '@mui/icons-material/Search';
import logo from '../assets/Logo.png';
import { useAuth0 } from '@auth0/auth0-react';
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const MenuD: React.FC = () => {
  const { logout } = useAuth0();
  const [open, setOpen] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  
  const theme = createTheme({
    palette: {
      mode,
      ...(mode === 'dark' && {
        background: {
          default: '#000000', // Color de fondo negro personalizado
          paper: '#1E1E1E',   // Negro más suave para elementos como tarjetas
        },
        text: {
          primary: '#ffffff', // Asegurar que el texto sea legible en modo oscuro
        },
      }),
    },
  });

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    setSelectedLanguage(event.target.value as string);
  };

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  const DrawerList = (
    <Box sx={{ width: 250, display: 'flex', flexDirection: 'column', height: '100%' }} role="presentation" onClick={toggleDrawer(false)}>
      <Box sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
        <img src={logo} alt="logo" style={{ width: 50, height: 50, marginRight: 10 }} />
        <Typography variant="h5" sx={{ color: 'black', fontWeight: 'bold' }}>Community</Typography>
      </Box>
      <List>
        <ListItem key='Servicios' disablePadding>
          <ListItemButton component={Link} to="/Services">
            <ListItemIcon>
              <Groups2SharpIcon />
            </ListItemIcon>
            <ListItemText primary='Servicios' />
          </ListItemButton>
        </ListItem>

        <ListItem key='Seguidos' disablePadding>
          <ListItemButton component={Link} to="/seguidos">
            <ListItemIcon>
              <PersonSharpIcon />
            </ListItemIcon>
            <ListItemText primary='Seguidos' />
          </ListItemButton>
        </ListItem>
        <Divider sx={{ padding: 2 }} />

        <ListItem key='Recompensas' disablePadding>
          <ListItemButton component={Link} to="/Rewards">
            <ListItemIcon>
              <EmojiEventsSharpIcon />
            </ListItemIcon>
            <ListItemText primary='Recompensas' />
          </ListItemButton>
        </ListItem>
        <ListItem key='Lenguaje' disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <GTranslateSharpIcon />
            </ListItemIcon>
            <FormControl>
              <Select
                value={selectedLanguage}
                onChange={handleLanguageChange}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Seleccione el idioma
                </MenuItem>
                <MenuItem value={'es'}>Español</MenuItem>
                <MenuItem value={'en'}>Inglés</MenuItem>
              </Select>
            </FormControl>
          </ListItemButton>
        </ListItem>
        <ListItem key='Unirse a un negocio' disablePadding>
          <ListItemButton component={Link} to="/JoinBusiness">
            <ListItemIcon>
              <SearchIcon />
            </ListItemIcon>
            <ListItemText primary='Unirse a un negocio' />
          </ListItemButton>
        </ListItem>
      </List>
      <Box sx={{ mt: 'auto' }}>
        <List>
        <ListItem key='Modo oscuro' disablePadding>
      <ListItemButton onClick={() => setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))}>
        <ListItemIcon>
          <DarkModeIcon />
        </ListItemIcon>
        <ListItemText primary={`Modo ${mode === 'light' ? 'oscuro' : 'claro'}`} />
      </ListItemButton>
    </ListItem>

          <ListItem key='Perfil' disablePadding>
            <ListItemButton component={Link} to="/Profile">
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary='Mi Perfil' />
            </ListItemButton>
          </ListItem>

          <ListItem key='Cerrar sesión' disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon >
                <LoginRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Cerrar sesión" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={toggleDrawer(true)}
      >
        <MenuIcon />
      </IconButton>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </ThemeProvider>
  );
};

export default MenuD;
