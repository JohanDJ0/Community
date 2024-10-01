import React, { useState, useEffect } from 'react';
import { RadioGroup, FormControlLabel, Radio, Button, Typography, TextField, Fade } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

function VistaRol() {
  const [rol, setRol] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [businessImage, setBusinessImage] = useState<File | null>(null);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("Nombre del usuario:", user.name);
      console.log("Email del usuario:", user.email);
      console.log("Picture URL:", user.picture);
      console.log("Sub ID (Auth0 ID):", user.sub);
      const sendUserData = async () => {
        try {
          // Realiza la petición POST a tu servidor de Odoo
          const response = await fetch('/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              "params": {
                name: user.name,
                email: user.email,
                //password: 'password123', // Puedes establecer una contraseña aquí
                user_type: 'user', // Se usa el rol seleccionado en el formulario
              }
            }),
          });

          if (!response.ok) {
            throw new Error('Error al enviar los datos al servidor');
          }

          const data = await response.json();
          console.log('Datos enviados con éxito:', data);

          if (data.status) {
            navigate('/services'); // Redirigir a /services si la respuesta es exitosa
          } else {
            console.error('Error en la respuesta del servidor:', data.message);
          }
        } catch (error) {
          console.error('Error al enviar los datos:', error);
        }
      };

      sendUserData();
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRol(event.target.value);
    if (event.target.value === 'cliente') {
      setBusinessName('');
      setBusinessDescription('');
      setBusinessImage(null);
    }
  };

  const handleSubmit = () => {
    if (rol) {
      console.log(`Rol seleccionado: ${rol}`);

      if (rol === 'cliente') {
        navigate('/services');
      } else if (rol === 'owner') {
        console.log('Datos del negocio:', { businessName, businessDescription, businessImage });
      }
    } else {
      console.log('Por favor, selecciona un rol.');
    }
  };

  return (
    <div
      className='first-div'
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
      }}
    >
      <div className='second-div'>
        <div
          className='box-div'
          style={{
            backgroundColor: '#f5f5f5',
            padding: '30px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography variant="h5" gutterBottom>
            Ya casí acabamos...
          </Typography>
          <RadioGroup
            value={rol}
            onChange={handleChange}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <FormControlLabel value="user" control={<Radio />} label="Cliente" />
            <FormControlLabel value="owner" control={<Radio />} label="Dueño" />
          </RadioGroup>

          {rol !== 'owner' && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              style={{ marginTop: '20px' }}
            >
              Submit
            </Button>
          )}

          <Fade in={rol === 'owner'} timeout={500}>
            <div style={{ marginTop: '20px', display: rol === 'owner' ? 'block' : 'none' }}>
              <Typography variant="h6">Registro de Negocio</Typography>
              <TextField
                label="Nombre del Negocio"
                variant="outlined"
                fullWidth
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                style={{ marginBottom: '10px' }}
              />
              <TextField
                label="Dirección"
                variant="outlined"
                fullWidth
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                style={{ marginBottom: '10px' }}
              />
              <TextField
                label="Número de teléfono"
                variant="outlined"
                fullWidth
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                style={{ marginBottom: '10px' }}
              />
              <TextField
                label="Correo"
                variant="outlined"
                fullWidth
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                style={{ marginBottom: '10px' }}
              />
              <TextField
                label="Descripción del Negocio"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                style={{ marginBottom: '10px' }}
              />
              <div style={{ marginBottom: '10px' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) {
                      setBusinessImage(e.target.files[0]);
                    }
                  }}
                  style={{
                    display: 'block',
                    margin: '0 auto',
                    padding: '10px',
                    border: '2px dashed #3f51b5',
                    borderRadius: '5px',
                    backgroundColor: '#f9f9f9',
                    cursor: 'pointer',
                  }}
                />
                <Typography variant="caption" color="textSecondary" style={{ marginTop: '5px' }}>
                  Agregar imagen del negocio
                </Typography>
              </div>

              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                style={{ marginTop: '20px' }}
              >
                Submit
              </Button>
            </div>
          </Fade>
        </div>
      </div>
    </div>
  );
}

export default VistaRol;
