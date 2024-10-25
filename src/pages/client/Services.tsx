import React, { useState, useEffect } from 'react';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';
import { Rating } from '@mui/material'; 
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mui/material'; // Importar el hook useMediaQuery
import '../../css/App.css';

interface Service {
  id: number;
  name: string;
  image: string;
  qualification: number;
  description: string | boolean;
}

// Agrega 'darkMode' como prop
interface ServicesProps {
  darkMode: boolean;
}

const Services: React.FC<ServicesProps> = ({ darkMode }) => {
  const [data, setData] = useState<Service[]>([]);
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery('(max-width:600px)'); // Verificar si la pantalla es menor a 600px

  useEffect(() => {
    fetch("/services")
      .then((res) => res.json())
      .then((result: Service[]) => {
        if (Array.isArray(result)) {
          setData(result);
        } else {
          console.error("Formato de datos inesperado:", result);
        }
        console.log(result);
      })
      .catch((error) => {
        console.error('Error al obtener los datos:', error);
      });
  }, []);

  const handleServiceClick = (id: number) => {
    navigate(`/services/${id}`);
  };

  return (
    <div className='first-div'>
      <div className='second-div'>
        <div className={`box-div ${darkMode ? 'dark' : 'light'}`}> 
          {data.length === 0 ? (
            <p>Cargando...</p>
          ) : (
            <div style={{ maxHeight: isSmallScreen ? '400px' : '500px', overflowY: 'auto' }}>
              {data.map((item) => (
                <Card key={item.id} style={{ marginBottom: '20px', cursor: 'pointer' }} onClick={() => handleServiceClick(item.id)}>
                  <div style={{ display: isSmallScreen ? 'block' : 'flex', alignItems: isSmallScreen ? 'center' : 'flex-start' }}>
                    <CardMedia
                      component="img"
                      style={{
                        width: isSmallScreen ? '100%' : '180px', // 100% en pantallas pequeñas, 180px en pantallas grandes
                        height: isSmallScreen ? 'auto' : '180px', // auto en pantallas pequeñas, 180px en pantallas grandes
                        objectFit: 'cover', // Mantiene la proporción y cubre el área
                        margin: isSmallScreen ? '0 auto' : '0' // Centrar imagen si es pantalla pequeña
                      }} 
                      image={item.image ? `data:image/jpeg;base64,${atob(item.image)}` : "https://w.wallhaven.cc/full/o5/wallhaven-o5xmv9.jpg"}
                      alt={item.name}
                    />
                    <CardContent style={{ textAlign: 'left' }}>
                      <Typography variant="h5" component="div">
                        {item.name}
                      </Typography>
                      <Rating
                        name={`rating-${item.id}`} 
                        value={item.qualification} 
                        precision={0.5} 
                        readOnly 
                      />
                      <Typography variant="body2" color="text.secondary">
                        Descripción: {typeof item.description === "string" ? item.description : "No disponible"}
                      </Typography>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Services;
