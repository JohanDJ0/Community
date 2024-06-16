import React from 'react';
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
import { Typography } from '@mui/material';
import PersonSharpIcon from '@mui/icons-material/PersonSharp';
import EmojiEventsSharpIcon from '@mui/icons-material/EmojiEventsSharp';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import GTranslateSharpIcon from '@mui/icons-material/GTranslateSharp';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import logo from '../assets/Logo.png';
import PersonIcon from '@mui/icons-material/Person';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SearchIcon from '@mui/icons-material/Search';

const MenuD = () => {
  const [open, setOpen] = React.useState(false);
  const [selectedLanguage, setSelectedLanguage] = React.useState('');

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const DrawerList = (
    <Box sx={{ width: 250, display: 'flex', flexDirection: 'column', height: '100%' }} role="presentation" onClick={toggleDrawer(false)}>
      <Box sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
        <img src={logo} alt="logo" style={{ width: 50, height: 50, marginRight: 10 }} />
        <Typography variant="h5">Community</Typography>
      </Box>
      <List>
        <ListItem key='Servicios' disablePadding>
          <ListItemButton component={Link} to="/Services">
            <ListItemIcon>
              <Groups2SharpIcon />
            </ListItemIcon>
            <ListItemText primary='Servicios' />
          </ListItemButton >
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
              <SearchIcon/>
            </ListItemIcon>
            <ListItemText primary='Unirse a un negocio' />
          </ListItemButton>
        </ListItem>
      </List>
      <Box sx={{ mt: 'auto' }}>
        <List>

          <ListItem key='Modo oscuro' disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <DarkModeIcon />
              </ListItemIcon>
              <ListItemText primary='Modo oscuro' />
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
            <ListItemButton>
              <ListItemIcon>
                <LoginRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Cerrar sesión"/>
            </ListItemButton>
          </ListItem>

        </List>
      </Box>
    </Box>
  );

  return (
    <div>
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
    </div>
  );
};

export default MenuD;
