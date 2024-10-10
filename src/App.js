import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/client/HomePage';
import SeguidosPage from './pages/client/SeguidosPage';
import RewardsPage from './pages/client/RewardsPage';
import JoinBusinessPage from './pages/client/JoinBusinessPage';
import ProfilePage from './pages/client/ProfilePage';
import Header from './components/Header';
import Services from './pages/client/Services';
import Login from './pages/client/Login';
import ServiceDetail from './pages/client/ServiceDetail';
import VistaRol from './pages/owner/VistaRol';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const Layout = ({ children, toggleDarkMode }) => {
  const location = useLocation();

  // Controlar el scroll del body
   // Bloquear el scroll del body en todas las vistas
   useEffect(() => {
    document.body.style.overflow = 'hidden'; // Desactiva el scroll en todas las páginas

    // Limpiar el efecto al desmontar el componente
    return () => {
      document.body.style.overflow = 'auto'; // O restablecer si es necesario
    };
  }, [location.pathname]);

  return (
    <>
      {location.pathname !== '/' && location.pathname !== '/Login' && location.pathname !== '/VistaRol' && (
        <Header toggleDarkMode={toggleDarkMode} />
      )}
      <div className="App">
        <div className="content">{children}</div>
      </div>
    </>
  );
};

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Asegúrate de establecer el data-theme en el body
  useEffect(() => {
    document.body.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout toggleDarkMode={toggleDarkMode}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/Seguidos" element={<SeguidosPage darkMode={darkMode} />} />
            <Route path="/Rewards" element={<RewardsPage darkMode={darkMode} />} />
            <Route path="/JoinBusiness" element={<JoinBusinessPage darkMode={darkMode} />} />
            <Route path="/Profile" element={<ProfilePage darkMode={darkMode} />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Services" element={<Services darkMode={darkMode} />} />
            <Route path="/services/:id" element={<ServiceDetail darkMode={darkMode} />} />
            <Route path="/VistaRol" element={<VistaRol darkMode={darkMode} />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

export default App;
