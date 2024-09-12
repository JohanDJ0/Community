import React, { useState, useEffect } from 'react';
import HeaderP from '../components/HeaderP';
import Button from '@mui/material/Button';
import '../css/Home.css';
import { Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
const HomePage: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

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
    <div className="home-container min-h-screen flex flex-col">
      <HeaderP />
      <div className="hero-section flex flex-col items-center justify-center p-6 text-white relative">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 relative z-10 drop-shadow-lg">
          Community: Donde cada <br /> interacción cuenta
        </h1>
        <Button
          endIcon={<KeyboardArrowDownIcon />}
          variant="contained"
          onClick={handleDiscover}
          style={{
            borderRadius: '50px', // Ajusta el radio del borde según tu preferencia
            backgroundColor: '#000', // Color negro
            color: '#fff', // Color del texto blanco
            padding: '8px 16px' 
          }}
        >
          Descubra la comunidad
        </Button>
      </div>
      <div className="community-content">
        {expanded && (
          <div id="expandedContent">
            <div>
              <Typography variant="h4" align="left" fontWeight="bold" style={{ marginBottom: '16px' }}>
                Acerca de la Comunidad
              </Typography>
              <Typography variant="body1" align="justify" style={{ marginBottom: '16px' }}>
                Community es una aplicación innovadora diseñada para fomentar conexiones y promover la colaboración entre los miembros.
                Nuestra plataforma proporciona un espacio para que las personas participen en interacciones significativas, compartan recursos
                y contribuyan al crecimiento de sus comunidades locales.
              </Typography>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <img
                  src="https://juegosmoda2049.neocities.org/vida-despues-concepto-libertad-covid_23-2149068476.jpg"
                  alt="Información"
                  style={{
                    width: '400px',
                    height: '400px',
                    objectFit: 'cover',
                    marginRight: '100px'
                  }}
                />
                <div style={{ flex: 1, maxWidth: '800px' }}>
                  <Typography variant="body1" align="justify">
                    A nuestro equipo le apasiona crear tecnología que una a las personas y tenga un impacto positivo en las comunidades locales.
                    Estamos convencidos de que, al proporcionar plataformas y herramientas que faciliten la comunicación y la cooperación entre
                    individuos y grupos, podemos fortalecer el tejido social y fomentar una mayor cohesión en las comunidades. Nuestro objetivo
                    es crear un entorno donde las personas puedan colaborar fácilmente, compartir recursos y apoyarse mutuamente, contribuyendo
                    así al desarrollo de comunidades más unidas, resistentes y capaces de enfrentar los desafíos del futuro.
                  </Typography>
                </div>
              </div>

              <Typography variant="h5" align="left" fontWeight="bold" style={{ marginBottom: '16px' }}>
                Meet the Developers

              </Typography >
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '16px' }}>
                {[
                  { name: "Alex Johnson", role: "Lead Developer", avatar: "https://w.wallhaven.cc/full/o5/wallhaven-o5xmv9.jpg" },
                  { name: "Sam Lee", role: "UX Designer", avatar: "https://w.wallhaven.cc/full/o5/wallhaven-o5xmv9.jpg" },
                  { name: "Taylor Wong", role: "Community Manager", avatar: "https://w.wallhaven.cc/full/o5/wallhaven-o5xmv9.jpg" },
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
                        objectFit: 'cover'
                      }}
                    />
                    <Typography variant="h6" style={{ fontWeight: 600 }}>
                      {dev.name}
                    </Typography>
                    <Typography variant="body2" style={{ color: '#4a4a4a' }}>
                      {dev.role}
                    </Typography>

                  </div>

                ))}
              </div>
              <Typography variant="h6" align="justify" fontWeight="bold" style={{ marginBottom: '16px' }}>
                A nuestro equipo le apasiona crear tecnología que una a las personas y tenga un impacto positivo en las comunidades locales.
              </Typography>
              <Typography variant="body1" align="justify" style={{ marginBottom: '16px' }}>
                Estamos convencidos de que, al proporcionar plataformas y herramientas que faciliten la comunicación y la cooperación entre
                individuos y grupos, podemos fortalecer el tejido social y fomentar una mayor cohesión en las comunidades. Nuestro objetivo
                es crear un entorno donde las personas puedan colaborar fácilmente, compartir recursos y apoyarse mutuamente, contribuyendo
                así al desarrollo de comunidades más unidas, resistentes y capaces de enfrentar los desafíos del futuro.
              </Typography>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
