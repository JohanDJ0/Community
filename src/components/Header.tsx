import React, { useState, useEffect } from 'react';
import MenuD from './MenuD';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Popover from '@mui/material/Popover';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import {API_BASE_URL} from './bdd';
import { useTranslation } from 'react-i18next';

interface Notis {
  id: number;
  message: string;
  route: string;
  number: string;
  tipo: string;
  usuario_mencionado: string;
  objeto_solicitado: string;
  servicio_mencionado: string;
}



const NotificationsWrapper = styled('div')(({ theme }) => ({
  width: '300px',
  maxHeight: '400px',
  overflowY: 'auto',
}));

const Header: React.FC<{ toggleDarkMode: () => void }> = ({ toggleDarkMode }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [notis, setNotis] = useState<Notis[]>([]);
  const { t, i18n } = useTranslation("notifications");

  const fetchNotifications = () => {
    const dataN = {
      params: { token: localStorage.getItem('token') }
    };

    fetch(`${API_BASE_URL}/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataN)
    })
    .then((res) => res.json())
    .then((result) => {
      const finalRes = result.result;
      console.log(finalRes);
      setNotis(finalRes);  // Guarda las notificaciones
    })
    .catch((error) => {
      console.error('Error al obtener los datos:', error);
    });
  };


  // useEffect para cargar las notificaciones al montar el componente y cada 5 segundos
  useEffect(() => {
    // Cargar las notificaciones inmediatamente
    fetchNotifications();

    // Configurar el intervalo para actualizar las notificaciones cada 5 segundos
    const intervalId = setInterval(fetchNotifications, 5000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const clickNoti = (route: string, id: number) => {
    fetch(`${API_BASE_URL}/notifications/read/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Notificación leida con éxito");
      })
      .catch((error) => {
        console.error("Error al leer la notificacion:", error.message || "Error desconocido");
      });
      
    handleClose();
    navigate(route);
  };

  const Notifications = () => (
    <NotificationsWrapper>
      <List>
        {notis.length === 0 ? (
          <ListItemText sx={{ padding: '16px' }}>{t("emptyNoti")}</ListItemText>
        ) : (
          notis.map((item) => (
            <ListItem button onClick={() => clickNoti(item.route, item.id)}>
              {item.tipo === 'new_employee' ? (
                  <ListItemText primary={t("newEmployeeMsg") + item.usuario_mencionado} />
              ) : item.tipo === 'redeemed_reward' ? (
                  <ListItemText primary={item.usuario_mencionado + t("redeemReward") + item.objeto_solicitado }/>
              ) : item.tipo === 'new_reward' ? (
                  <ListItemText primary={t("new_reward") + item.objeto_solicitado} />
              ) : item.tipo === 'new_proposal_owner' ? (
                  <ListItemText primary={t("new_proposal_owner") + item.servicio_mencionado + ' : ' + item.objeto_solicitado } />
              ) : item.tipo === 'new_review' ? (
                  <ListItemText primary={item.usuario_mencionado + t("new_review") + item.objeto_solicitado} />
              ) : item.tipo === 'new_news' ? (
                  <ListItemText primary={t("new_news") + item.servicio_mencionado} />
              ) : null}
            </ListItem>
          ))
        )}
      </List>
    </NotificationsWrapper>
  );

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: (theme) => theme.palette.background.default }} elevation={0}>
        <Toolbar sx={{ position: 'relative' }}>
          <Box sx={{ color: (theme) => theme.palette.text.primary }}>
            {/* Oculta el botón de hamburguesa en pantallas pequeñas */}
            {windowWidth >= 600 && <MenuD toggleDarkMode={toggleDarkMode} />}
          </Box>

          <Typography variant="h6" noWrap component="div" sx={{ color: (theme) => theme.palette.text.primary }}>
            Community
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
              sx={{ color: (theme) => theme.palette.text.primary }} 
              onClick={handleClick}
            >
              <Badge badgeContent={notis.length} color="info">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Box>

          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="Notifications"
              aria-haspopup="true"
              color="inherit"
              sx={{ color: (theme) => theme.palette.text.primary }} 
              onClick={handleClick}
            >
              <Badge badgeContent={notis.length} color="info">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Box 
        sx={{ 
          display: { xs: 'flex', md: 'none' }, 
          justifyContent: 'space-around', 
          backgroundColor: (theme) => theme.palette.background.default, 
          position: 'fixed', 
          bottom: '0', // Ajusta esta distancia para elevar la barra
          left: 0, 
          right: 0, 
          padding: '8px 0',
          zIndex: 1000 // Asegúrate de que esté por encima de otros elementos
        }} 
      >
        <IconButton aria-label="search" color="inherit">
          <SearchIcon />
        </IconButton>
        <IconButton aria-label="home" color="inherit">
          <HomeIcon />
        </IconButton>
        <IconButton aria-label="menu" color="inherit">
        <MenuD toggleDarkMode={toggleDarkMode} />
        </IconButton>
      </Box>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Notifications />
      </Popover>
    </Box>
  );
};

export default Header;
