import React, { useState, useEffect } from 'react';
import '../css/App.css';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface Service {
  id: number;
  name: string;
  image: string;
  qualification: number;
  description: string | boolean;
}

const Services: React.FC = () => {
  const [data, setData] = useState<Service[]>([]);
  const navigate = useNavigate();

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
  }

  return (
    <div className='first-div'>
      <div className='second-div'>
        <div className='box-div'>
          {data.length === 0 ? (
            <p>Cargando...</p>
          ) : (
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {data.map((item) => (
                <Card key={item.id} style={{ marginBottom: '20px', cursor: 'pointer' }} onClick={() => handleServiceClick(item.id)}>
                  <div style={{ display: 'flex' }}>
                  <CardMedia
                      component="img"
                      style={{ width: '180px', height: 'auto' }}
                      image={item.image ?` data:image/jpeg;base64,${atob(item.image)} `: "https://w.wallhaven.cc/full/o5/wallhaven-o5xmv9.jpg"}
                      alt={item.name}
                    />
                    
                    
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Calificación: {item.qualification}
                      </Typography>
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
}

export default Services;
