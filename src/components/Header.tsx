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

// Estilos para el componente Search
const Search = styled('div')(({ theme }) => ({
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.default,
  '&:hover': {
    backgroundColor: theme.palette.background.default,
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const NotificationsWrapper = styled('div')(({ theme }) => ({
  width: '300px',
  maxHeight: '400px',
  overflowY: 'auto',
}));

const Notifications = () => (
  <NotificationsWrapper>
    <List>
      <ListItem button>
        <ListItemText primary="Flexible Identifiers Important Update: New Error Codes and Improved Signup Experience for Organization Invitations" />
      </ListItem>
      <ListItem button>
        <ListItemText primary="A new profile for Access Tokens is now Generally Available" />
      </ListItem>
    </List>
  </NotificationsWrapper>
);

const Header: React.FC<{ toggleDarkMode: () => void }> = ({ toggleDarkMode }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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

          <Search sx={{ color: (theme) => theme.palette.text.primary, display: { xs: 'none', sm: 'block' } }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase placeholder="Escribe aquí..." inputProps={{ 'aria-label': 'search' }} />
          </Search>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
              sx={{ color: (theme) => theme.palette.text.primary }} 
              onClick={handleClick}
            >
              <Badge badgeContent={2} color="info">
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
              <Badge badgeContent={2} color="info">
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
