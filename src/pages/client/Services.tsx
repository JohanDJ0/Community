import React, { useState, useEffect } from 'react';
import { Card, CardMedia, CardContent, Typography, TextField, Box } from '@mui/material';
import { Rating } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mui/material'; 
import '../../css/App.css';
import noImage from '../../assets/NoImagen.png';
import HomeIcon from '@mui/icons-material/Home';

interface Service {
  id: number;
  name: string;
  image: string;
  qualification: number;
  description: string | boolean;
}

interface ServicesProps {
  darkMode: boolean;
}

const Services: React.FC<ServicesProps> = ({ darkMode }) => {
  const [data, setData] = useState<Service[]>([]);
  const token = localStorage.getItem('token');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState<Service[]>([]);
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const dataToken = {
    params: {
      token: token
    }
  }

  useEffect(() => {
    fetch("/services", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToken),
    })
    .then((res) => res.json())
    .then((response) => {
      if (response.result && Array.isArray(response.result)) {
        const services: Service[] = response.result; // Aseguramos el tipo
        setData(services);
      } else {
        console.error("Formato de datos inesperado:", response);
      }
    })
    .catch((error) => {
      console.error("Error al obtener los datos:", error);
    });
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredData(data.filter(service => service.name.toLowerCase().includes(searchTerm.toLowerCase())));
    } else {
      setFilteredData(data); 
    }
  }, [searchTerm, data]);

  const handleServiceClick = (id: number) => {
    navigate(`/services/${id}`);
  };

  return (
    <div>
      <Box 
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '20px',
          marginTop: '-30px', // Mueve el buscador más arriba

        }}
      >
        <TextField
          label="Buscar servicio"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: isSmallScreen ? '90%' : '80%',
          }}
        />
      </Box>

      <div className='first-div'>
        <div className='second-div3'>
          <div className={`box-div ${darkMode ? 'dark' : 'light'}`}>
            {filteredData.length === 0 ? (
              <p>No se encontraron servicios</p>
            ) : (
              <div style={{ maxHeight: isSmallScreen ? '400px' : '500px', overflowY: 'auto' }}>

                <div style={{ display: 'flex', alignItems: 'center', textAlign: 'left', paddingBottom: '10px' }}>
                  <HomeIcon style={{ marginRight: '4px' }} />
                  <span style={{ fontWeight: 'bold' }}>Inicio</span>
                  {/* <span style={{ margin: '0 8px' }}>/</span>
                  <span>Sección</span>
                  <span style={{ margin: '0 8px' }}>/</span>
                  <span>Subsección</span> */}
                </div>
                {filteredData.map((item) => (
                  <Card 
                    key={item.id} 
                    style={{ marginBottom: '20px', cursor: 'pointer' }} 
                    onClick={() => handleServiceClick(item.id)}
                  >
                    <div style={{ display: isSmallScreen ? 'block' : 'flex', alignItems: isSmallScreen ? 'center' : 'flex-start' }}>
                      <CardMedia
                        component="img"
                        style={{
                          width: isSmallScreen ? '100%' : '180px',
                          height: isSmallScreen ? 'auto' : '180px',
                          objectFit: 'cover',
                          margin: isSmallScreen ? '0 auto' : '0'
                        }}
                        image={item.image ? `data:image/jpeg;base64,${atob(item.image)}` : noImage}
                        alt={item.name}
                      />
                      <CardContent style={{ textAlign: 'left' }}>
                        <Typography variant="h5" component="div">
                          {item.name}
                        </Typography>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Rating
                            name={`rating-${item.id}`}
                            value={item.qualification}
                            precision={0.5}
                            readOnly
                          />
                          <Typography variant="body2" color="text.secondary" style={{ marginLeft: '10px' }}>
                            {item.qualification.toFixed(1)}
                          </Typography>
                        </div>
                        <Typography variant="body2" color="text.secondary">
                          {typeof item.description === "string" ? item.description : "No disponible"}
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
    </div>
  );
};

export default Services;
