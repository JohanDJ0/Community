import React from 'react';
import HeaderP from '../components/HeaderP';
import Button from '@mui/material/Button'; 
import '../css/Home.css';

function HomePage() {
  const scrollToBenefits = () => {
    document.getElementById('benefits').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="home-container">
      <HeaderP />
      <div className="hero-section">
        <h1>Community: Donde cada <br />interacción cuenta</h1>
        <Button variant="contained" onClick={scrollToBenefits}>
          Descubra la comunidad
        </Button>
      </div>
      <div className="community-content">
        <div className="community-benefits" id="benefits">
          <h2>Beneficios de la comunidad</h2>
          <ul>
            <li>Conexión con otros usuarios</li>
            <li>Compartir ideas y experiencias</li>
            <li>Aprender de otros</li>
            <li>Sentirse apoyado y valorado</li>
            <li>Hacer un impacto positivo en el mundo</li>
            
          </ul>
          <ul>
            <li>Conexión con otros usuarios</li>
            <li>Compartir ideas y experiencias</li>
            <li>Aprender de otros</li>
            <li>Sentirse apoyado y valorado</li>
            <li>Hacer un impacto positivo en el mundo</li>
            
          </ul>
          <ul>
            <li>Conexión con otros usuarios</li>
            <li>Compartir ideas y experiencias</li>
            <li>Aprender de otros</li>
            <li>Sentirse apoyado y valorado</li>
            <li>Hacer un impacto positivo en el mundo</li>
            
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
