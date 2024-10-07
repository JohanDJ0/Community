import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import StoreIcon from '@mui/icons-material/Store';
import FiberSmartRecordIcon from '@mui/icons-material/FiberSmartRecord';
import { useTranslation  } from 'react-i18next';
import { Suspense } from 'react';

const MenuD: React.FC = () => {
  const { logout } = useAuth0();
  const [open, setOpen] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('es');
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("menu");

  useEffect(() => {
    const userRole = localStorage.getItem('rol');
    const userToken = localStorage.getItem('token');

    console.log("Rol: ", userRole);
    console.log("Token: ", userToken);
    
    setUserRole(userRole);
    setUserToken(userToken);

    if (!userToken) {
      // Si el token es null, redirige a la página de inicio
      navigate('/');
    }
  }, [userToken, navigate]);
  
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
    const newLanguage = event.target.value;
    setSelectedLanguage(newLanguage);  // Cambiar el estado local
    i18n.changeLanguage(newLanguage);  // Cambiar el idioma en i18next
  };

  const handleLogout = () => {
    // Limpia el almacenamiento local antes de cerrar sesión
    localStorage.clear();

    // Llama a la función de logout de Auth0
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  const DrawerListOwner = (
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
            <ListItemText primary={t("itemListServices")} />
          </ListItemButton>
        </ListItem>

        <ListItem key='Seguidos' disablePadding>
          <ListItemButton component={Link} to="/seguidos">
            <ListItemIcon>
              <PersonSharpIcon />
            </ListItemIcon>
            <ListItemText primary={t("itemListFollowing")} />
          </ListItemButton>
        </ListItem>
        <Divider sx={{ padding: 2 }} />

        <ListItem key='Recompensas' disablePadding>
          <ListItemButton component={Link} to="/Rewards">
            <ListItemIcon>
              <EmojiEventsSharpIcon />
            </ListItemIcon>
            <ListItemText primary={t("itemListRewards")} />
          </ListItemButton>
        </ListItem>
        <ListItem key='Empleados' disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary={t("itemListEmployees")} />
          </ListItemButton>
        </ListItem>
        <ListItem key='Mi negocio' disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <StoreIcon/>
            </ListItemIcon>
            <ListItemText primary={t("itemListMyService")} />
          </ListItemButton>
        </ListItem>
        <ListItem key='Mis recompensas' disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <FiberSmartRecordIcon/>
            </ListItemIcon>
            <ListItemText primary={t("itemListMyRewards")} />
          </ListItemButton>
        </ListItem>
        <ListItem key='Lenguaje' disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <GTranslateSharpIcon />
            </ListItemIcon>
            <FormControl>
              <Select value={selectedLanguage} onChange={handleLanguageChange} displayEmpty>
              <MenuItem value="es">{t('SpanishLn')}</MenuItem>
              <MenuItem value="en">{t('EnglishLn')}</MenuItem>
              </Select>
            </FormControl>
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
        <ListItemText primary={t(mode === 'light' ? 'itemListDarkMode' : 'itemListLightMode')}/>
      </ListItemButton>
    </ListItem>

          <ListItem key='Perfil' disablePadding>
            <ListItemButton component={Link} to="/Profile">
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary={t("itemListMyProfile")} />
            </ListItemButton>
          </ListItem>

          <ListItem key='Cerrar sesión' disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon >
                <LoginRoundedIcon />
              </ListItemIcon>
              <ListItemText primary={t("itemListLogOut")} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  const DrawerListClient = (
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
              <Select value={selectedLanguage} onChange={handleLanguageChange} displayEmpty >
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
    <Suspense fallback="Cargando traducciones">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)} >
          <MenuIcon />
        </IconButton>
        <Drawer open={open} onClose={toggleDrawer(false)}>
          {userRole === 'owner' ? DrawerListOwner : DrawerListClient}
        </Drawer>
      </ThemeProvider>
    </Suspense>
  );
};

export default MenuD;
