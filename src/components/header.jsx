import React from 'react';
import MenuD from '../components/MenuD';
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

// Estilos para el componente Search
const Search = styled('div')(({ theme }) => ({
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.common.white,
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

export default function Header() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: 'white' }} elevation={0}>

            <Toolbar sx={{ position: 'relative' }}>
                <Box sx={{color: 'black'}}>
                  <MenuD/>
                </Box>

                <Typography variant="h6" noWrap component="div" sx={{ color: 'black'}}>
                    Community
                </Typography>
                
                <Search sx={{ color: 'black' }}>
                    <SearchIconWrapper>
                        <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase placeholder="Escribe aquí..." inputProps={{ 'aria-label': 'search' }} />
                </Search>

                <Box sx={{ flexGrow: 1 }} />

                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                    <IconButton size="large" aria-label="show 17 new notifications" color="inherit" sx={{ color: 'black' }}>
                    <Badge badgeContent={17} color="info">
                        <NotificationsIcon />
                    </Badge>
                    </IconButton>
                </Box>

                <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                    <IconButton size="large" aria-label="Notifications" aria-haspopup="true" color="inherit" sx={{ color: 'black' }}>
                    <Badge badgeContent={17} color="info">
                        <NotificationsIcon />
                    </Badge>
                    </IconButton>
                </Box>

            </Toolbar>
            
        </AppBar>
    </Box>
  );
}