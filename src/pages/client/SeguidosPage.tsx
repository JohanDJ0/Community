import React, { useState, useEffect } from 'react';
import { Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import { Rating } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import '../../css/App.css';
import { useNavigate } from 'react-router-dom';
import noImage from '../../assets/NoImagen.png';
import PersonIcon from '@mui/icons-material/Person';

interface Followed {
  id: number,
  name: string,
  direction: string,
  qualification: number,
  description: string,
  image: string
}

interface ServicesProps {
  darkMode: boolean;
}

const Seguidos: React.FC<ServicesProps> = ({ darkMode }) => {
  const [data, setData] = useState<Followed[]>([]);
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const tokenU = localStorage.getItem('token');
  const serviciosSeguidos = [
    {
      id: 1,
      name: "Ciber1",
      image: "https://w.wallhaven.cc/full/o5/wallhaven-o5xmv9.jpg", 
      qualification: 4.5,
      description: "Descripción del Servicio A",
    }
  ];

  useEffect(() => {
    fetch("/followed", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        params: {
          token: tokenU
        }
      })
    })
    .then((res) => res.json())
    .then((response) => {
      // Asegúrate de que 'response.result' sea un array antes de actualizar el estado
      if (response.result && Array.isArray(response.result)) {
        setData(response.result);
      } else {
        console.error("Formato de datos inesperado:", response);
        setData([]); // Establece un array vacío si el resultado no es un array
      }
    })
    .catch((error) => {
      console.error('Error al obtener los datos:', error);
      setData([]); // Establece un array vacío en caso de error
    });
  }, []);

  const unfollowService = (id: number) => {
    fetch(`/followed/unlink/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        params: {
          token: tokenU
        }
      })
    })
    .then((res) => res.json())
    .then((response) => {
      console.log("Se dejo de seguir al negocio")
      setData((prev) => prev.filter((servicio) => servicio.id !== id));
    })
    .catch((error) => {
      console.error('Error al obtener los datos:', error);
    });
  };

  return (
    <div className='first-div'>
      <div className='second-div'>
        <div className={`box-div ${darkMode ? 'dark' : 'light'}`}>
          <div style={{ display: 'flex', alignItems: 'center', textAlign: 'left', paddingBottom: '10px' }}>
            <PersonIcon style={{ marginRight: '4px' }} />
            <span style={{ fontWeight: 'bold' }}>Seguidos</span>
            {/* <span style={{ margin: '0 8px' }}>/</span>
            <span>Sección</span>
            <span style={{ margin: '0 8px' }}>/</span>
            <span>Subsección</span> */}
          </div>
          <div style={{  overflowY: 'auto' }}>
            {data.length > 0 ? (
              data.map((servicio) => (
                <Card 
                  key={servicio.id} 
                  style={{ 
                    marginBottom: '20px', 
                    display: 'flex', 
                    flexDirection: isSmallScreen ? 'column' : 'row',
                    cursor: 'pointer'
                  }}
                >
                  <CardMedia
                    component="img"
                    style={{ 
                      width: isSmallScreen ? '100%' : '180px',
                      height: isSmallScreen ? 'auto' : '180px',
                      objectFit: 'cover',
                      marginBottom: isSmallScreen ? '10px' : '0'
                    }} 
                    image={servicio.image ? `data:image/jpeg;base64,${atob(servicio.image)}` : noImage}
                    alt={servicio.name}
                    onClick={() => navigate(`/services/${servicio.id}`)}
                  />
                  <CardContent style={{ flex: 1, position: 'relative', paddingBottom: '20px' }}>
                    <div style={{ textAlign: 'left' }}>
                      <Typography variant="h5" component="div" onClick={() => navigate(`/services/${servicio.id}`)}>
                        {servicio.name} | {servicio.direction}
                      </Typography>
                      <Button 
                        onClick={() => unfollowService(servicio.id)}
                        variant="contained" 
                        style={{ 
                          backgroundColor: '#2EC6BD', 
                          color: 'white', 
                          padding: '5px 10px',
                          marginTop: '5px'
                        }} 
                      >
                        Dejar de seguir
                      </Button>
                    </div>
                    <div style={{ marginTop: '10px', textAlign: 'left' }}>
                      <Rating
                        name={`rating-${servicio.id}`}
                        value={servicio.qualification}
                        precision={0.5}
                        readOnly
                      />
                      <Typography variant="body2" color="text.secondary" onClick={() => navigate(`/services/${servicio.id}`)}>
                        {servicio.description}
                      </Typography>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography variant="body1" color="text.secondary" style={{ textAlign: 'center', marginTop: '20px' }}>
                No tienes servicios seguidos.
              </Typography>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Seguidos;