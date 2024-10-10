import React from 'react';
import '../../css/App.css';
// Agrega 'darkMode' como prop
interface ServicesProps {
  darkMode: boolean;
}

const Seguidos : React.FC<ServicesProps> = ({ darkMode }) =>{
  return (
    <div className='first-div'>
      <div className='second-div'>
      <div className={`box-div ${darkMode ? 'dark' : 'light'}`}> 
          <h2>Vista de Seguidos</h2>
          {/*<MenuD />*/}
          <p>Bienvenido a la página de inicio.</p>
        </div>
      </div>
    </div>
  );
};

export default Seguidos;
