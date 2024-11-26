import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
import { useAuth0 } from '@auth0/auth0-react';
import { useTranslation } from 'react-i18next';
import logo from '../assets/Logo.png';
import Groups2SharpIcon from '@mui/icons-material/Groups2Sharp';
import PersonSharpIcon from '@mui/icons-material/PersonSharp';
import EmojiEventsSharpIcon from '@mui/icons-material/EmojiEventsSharp';
import GTranslateSharpIcon from '@mui/icons-material/GTranslateSharp';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import PersonIcon from '@mui/icons-material/Person';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import StoreIcon from '@mui/icons-material/Store';
import FiberSmartRecordIcon from '@mui/icons-material/FiberSmartRecord';

const MenuD: React.FC<{ toggleDarkMode: () => void }> = ({ toggleDarkMode }) => {
  const { logout } = useAuth0();
  const [open, setOpen] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('es');
  const [userRole, setUserRole] = useState<string | null>(null); // Nueva variable de rol
  const [userToken, setUserToken] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("menu");

  useEffect(() => {
    const role = localStorage.getItem('rol');
    const token = localStorage.getItem('token');
    console.log("Token obtenido desdde menu:", token); // Mostrar el token en la consola

    setUserRole(role);  // Guardar el rol del usuario
    setUserToken(token); // Guardar el token

    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const newLanguage = event.target.value;
    setSelectedLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  const handleLogout = () => {
    localStorage.clear();
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
        <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 'bold', marginTop: 1 }}>
          Community
        </Typography>
      </Box>
      <Divider />
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
        <Divider />
        <ListItem key='Recompensas' disablePadding>
          <ListItemButton component={Link} to="/Rewards">
            <ListItemIcon>
              <EmojiEventsSharpIcon />
            </ListItemIcon>
            <ListItemText primary={t("itemListRewards")} />
          </ListItemButton>
        </ListItem>
        <ListItem key='Mi negocio' disablePadding>
          <ListItemButton component={Link} to="/MyService">
            <ListItemIcon>
              <StoreIcon />
            </ListItemIcon>
            <ListItemText primary={t("itemListMyService")} />
          </ListItemButton>
        </ListItem>
        <ListItem key='Empleados' disablePadding>
          <ListItemButton component={Link} to="/Empleados">
            <ListItemIcon>
              <PersonIcon /> 
            </ListItemIcon>
            <ListItemText primary="Empleados" /> 
          </ListItemButton>
        </ListItem>
        <ListItem key='Mis recompensas' disablePadding>
          <ListItemButton component={Link} to="/MyRewards">
            <ListItemIcon>
              <FiberSmartRecordIcon />
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
      <Divider />
      <Box sx={{ mt: 'auto' }}>
        <List>
          <ListItem key='Modo oscuro' disablePadding>
            <ListItemButton onClick={toggleDarkMode}>
              <ListItemIcon>
                <DarkModeIcon />
              </ListItemIcon>
              <ListItemText primary={t('itemListDarkMode')} />
            </ListItemButton>
          </ListItem>
          <ListItem key='Perfil' disablePadding>
            <ListItemButton component={Link} to="/Profile">
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary={t('itemListMyProfile')} />
            </ListItemButton>
          </ListItem>
          <ListItem key='Cerrar sesión' disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LoginRoundedIcon />
              </ListItemIcon>
              <ListItemText primary={t('itemListLogOut')} />
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
        <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 'bold', marginTop: 1 }}>
          Community
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem key='Servicios' disablePadding>
          <ListItemButton component={Link} to="/Services">
            <ListItemIcon>
              <Groups2SharpIcon />
            </ListItemIcon>
            <ListItemText primary={t("itemListServices")} />
          </ListItemButton>
        </ListItem>
        <ListItem key='Recompensas' disablePadding>
          <ListItemButton component={Link} to="/Rewards">
            <ListItemIcon>
              <EmojiEventsSharpIcon />
            </ListItemIcon>
            <ListItemText primary={t("itemListRewards")} />
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
      <Divider />
      <Box sx={{ mt: 'auto' }}>
        <List>
          <ListItem key='Modo oscuro' disablePadding>
            <ListItemButton onClick={toggleDarkMode}>
              <ListItemIcon>
                <DarkModeIcon />
              </ListItemIcon>
              <ListItemText primary={t('itemListDarkMode')} />
            </ListItemButton>
          </ListItem>
          <ListItem key='Perfil' disablePadding>
            <ListItemButton component={Link} to="/Profile">
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary={t('itemListMyProfile')} />
            </ListItemButton>
          </ListItem>
          <ListItem key='Cerrar sesión' disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LoginRoundedIcon />
              </ListItemIcon>
              <ListItemText primary={t('itemListLogOut')} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <div>
      <IconButton onClick={toggleDrawer(true)} edge="start" color="inherit" aria-label="menu">
        <MenuIcon />
      </IconButton>
      <Drawer anchor='left' open={open} onClose={toggleDrawer(false)}>
        {userRole === "client" ? DrawerListClient : DrawerListOwner}
      </Drawer>
    </div>
  );
};

export default MenuD;
