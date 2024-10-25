import React, { useState, useEffect } from 'react';
import HeaderP from '../../components/Menu';
import Button from '@mui/material/Button';
import '../../css/Home.css';
import { Typography, Box, useMediaQuery  } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ImageCarousel from "../../components/ImageCarousel";
import { Card, CardContent } from "@mui/material";
import Footer from 'components/Footer';

interface ServicesProps {
  darkMode: boolean;
}
const HomePage: React.FC<ServicesProps> = ({ darkMode }) => {
  const [expanded, setExpanded] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);
  }, []);

  const handleDiscover = () => {
    setExpanded(true);
    document.body.style.overflow = 'auto';

    setTimeout(() => {
      document.getElementById('expandedContent')?.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  return (
    
    <div className={`home-container min-h-screen flex flex-col ${darkMode ? 'dark' : 'light'}`}>
   
   <HeaderP />
      {/* Sección Hero */}
      <div className={`hero-section flex flex-col items-center justify-center p-6 ${darkMode ? 'text-white' : 'text-black'} relative`}>
        <h1 className={`text-4xl md:text-5xl font-bold text-center mb-6 relative z-10 drop-shadow-lg ${darkMode ? 'text-white' : 'text-black'}`}>
          Community: Donde cada <br /> interacción cuenta
        </h1>

        {/* Botón para expandir contenido */}
        <Button
          endIcon={<KeyboardArrowDownIcon />}
          variant="contained"
          onClick={handleDiscover}
          style={{
            borderRadius: '50px',
            backgroundColor: darkMode ? '#333' : '#000', // Cambiar color según el modo
            color: '#fff',
            padding: '8px 16px'
          }}
        >
          Descubra la comunidad
        </Button>
      </div>

      {/* Contenido expandido */}
      <div className="community-content">
        {expanded && (
          <div id="expandedContent">
  <Card
      style={{
        width: "100%",
        backgroundColor: darkMode ? '#333' : '#ffda79',
        margin: 0,
        padding: '20px',
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        minHeight: '600px',
        marginBottom: '80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <CardContent>
        <Typography
          variant="h3"
          style={{
            marginBottom: '16px',
            fontFamily: "'Poppins', sans-serif",
            whiteSpace: 'pre-line',
            overflowWrap: 'break-word',
            maxWidth: '90%',
            color: darkMode ? '#fff' : '#000',
            fontSize: isSmallScreen ? '1.5rem' : '2rem', // Tamaño de fuente responsivo
          }}
        >
          Únete a nuestra comunidad: Descubre cómo formar parte de algo más grande
        </Typography>

        <Typography
          variant="body2"
          style={{
            marginBottom: '16px',
            padding: '0 20px',
            maxWidth: '90%',
            fontSize: isSmallScreen ? '1rem' : '1.25rem', // Tamaño de fuente responsivo
            color: darkMode ? '#ccc' : '#555',
          }}
        >
          Community es una aplicación innovadora diseñada para fomentar conexiones y promover la colaboración entre los miembros. Nuestra plataforma proporciona un espacio para que las personas participen en interacciones significativas.
          Puedes acceder a una amplia gama de servicios que ofrecen los usuarios de la comunidad. A continuación, te presentamos una selección de estos servicios:
        </Typography>

        {/* Botón de registro */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            style={{
              backgroundColor: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '20px',
              padding: '10px 20px',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#333')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#000')}
          >
            Regístrate
          </button>
        </div>
        <div style={{ textAlign: 'center', marginTop: '20px', color: '#555' }}>
          <Typography
            variant="body2"
            style={{
              fontSize: isSmallScreen ? '0.75rem' : '0.875rem', // Tamaño de fuente responsivo
              fontStyle: 'italic',
              color: darkMode ? '#ccc' : '#555',
            }}
          >
            ¿Estás listo para dar el siguiente paso y formar parte de una comunidad que te inspire y te apoye?
          </Typography>
        </div>
      </CardContent>
    </Card>


            <ImageCarousel />

            {/* Sección con Imagen y Texto */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 4,
                p: 4,
                bgcolor: darkMode ? '#444' : '#b1d8d9', // Cambiar color de fondo
                borderRadius: 2,
                boxShadow: 3,
              }}
            >
              <Box
                component="img"
                src="https://juegosmoda2049.neocities.org/vida-despues-concepto-libertad-covid_23-2149068476.jpg"
                alt="Información"
                sx={{
                  width: 400,
                  height: 400,
                  objectFit: 'cover',
                  mr: 10,
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              />
              <Box sx={{ flex: 1, maxWidth: 800 }}>
                <Typography variant="body1" align="justify" sx={{ color: darkMode ? '#ccc' : 'text.primary', lineHeight: 1.6 }}>
                  A nuestro equipo le apasiona crear tecnología que una a las personas y tenga un impacto positivo en las comunidades locales.
                  Estamos convencidos de que, al proporcionar plataformas y herramientas que faciliten la comunicación y la cooperación entre
                  individuos y grupos, podemos fortalecer el tejido social y fomentar una mayor cohesión en las comunidades.
                </Typography>
              </Box>
            </Box>

            <Typography
              variant="h5"
              align="left"
              fontWeight="bold"
              style={{ marginBottom: '16px', color: darkMode ? '#fff' : '#000' }} // Cambiar color del texto
            >
              Meet the Developers
            </Typography>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '16px' }}>
              {[
                { name: "Miguel Angel", role: "Lead Developer", avatar: "https://w.wallhaven.cc/full/o5/wallhaven-o5xmv9.jpg" },
                { name: "Martha", role: "UX Designer", avatar: "https://w.wallhaven.cc/full/o5/wallhaven-o5xmv9.jpg" },
                { name: "Johan De Jesus", role: "Front end developer", avatar: "https://juegosmoda2049.neocities.org/IMG-20221103-WA0011.jpg" },
                { name: "Marcos", role: "Community Manager", avatar: "https://w.wallhaven.cc/full/o5/wallhaven-o5xmv9.jpg" },
                { name: "Sandra", role: "Community Manager", avatar: "https://w.wallhaven.cc/full/o5/wallhaven-o5xmv9.jpg" },
              ].map((dev) => (
                <div key={dev.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img
                    src={dev.avatar}
                    alt={dev.name}
                    style={{
                      width: '200px',
                      height: '200px',
                      borderRadius: '50%',
                      marginBottom: '8px',
                      objectFit: 'cover',
                    }}
                  />
                  <Typography variant="h6" style={{ fontWeight: 600, color: darkMode ? '#fff' : '#000' }}>
                    {dev.name}
                  </Typography>
                  <Typography variant="body2" style={{ color: darkMode ? '#ccc' : '#555' }}>
                    {dev.role}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
