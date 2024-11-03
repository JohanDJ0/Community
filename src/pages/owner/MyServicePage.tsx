import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ServicesProps {
  darkMode: boolean;
}

const MyServicePage: React.FC<ServicesProps> = ({ darkMode }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const service = localStorage.getItem('service')
    console.log(service)
  }, []);

  return (
    <div className='first-div'>
      <div className='second-div'>
        <div className={`box-div ${darkMode ? 'dark' : 'light'}`}> 
          <h2>Vista de My Servicio</h2>
        </div>
      </div>
    </div>
  );
};

export default MyServicePage;