import React, { useState } from 'react';
import { RadioGroup, FormControlLabel, Radio, Button, Typography, TextField, Fade } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Importar el hook useNavigate

function VistaRol() {
  const [rol, setRol] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [businessImage, setBusinessImage] = useState<File | null>(null); // Especificar que puede ser un File o null
  const navigate = useNavigate(); // Inicializar useNavigate

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRol(event.target.value);
    // Resetear los campos del formulario al cambiar de rol
    if (event.target.value === 'cliente') {
      setBusinessName('');
      setBusinessDescription('');
      setBusinessImage(null);
    }
  };

  const handleSubmit = () => {
    if (rol) {
      console.log(`Rol seleccionado: ${rol}`);

      // Redireccionar basado en el rol seleccionado
      if (rol === 'cliente') {
        navigate('/services'); // Redirigir a /services si el rol es Cliente
      } else if (rol === 'dueño') {
        // Aquí podrías manejar el envío del formulario o los datos de negocio
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
        height: '100vh', // Altura completa de la pantalla
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
            Vista para seleccionar un rol
          </Typography>
          <RadioGroup
            value={rol}
            onChange={handleChange}
            style={{
              display: 'flex',
              flexDirection: 'row', // Alineación horizontal
              justifyContent: 'center', // Centrar los radios horizontalmente
            }}
          >
            <FormControlLabel value="cliente" control={<Radio />} label="Cliente" />
            <FormControlLabel value="dueño" control={<Radio />} label="Dueño" />
          </RadioGroup>

          {/* Botón de Submit Superior, que se oculta al desplegar el formulario */}
          {rol !== 'dueño' && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              style={{ marginTop: '20px' }}
            >
              Submit
            </Button>
          )}

          {/* Formulario para el rol de Dueño */}
          <Fade in={rol === 'dueño'} timeout={500}>
            <div style={{ marginTop: '20px', display: rol === 'dueño' ? 'block' : 'none' }}>
              <Typography variant="h6">Formulario de Registro del Negocio</Typography>
              <TextField
                label="Nombre del Negocio"
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
                      setBusinessImage(e.target.files[0]); // Ahora es seguro acceder a e.target.files
                    }
                  }}
                  style={{
                    display: 'block',
                    margin: '0 auto',
                    padding: '10px',
                    border: '2px dashed #3f51b5', // Bordes del campo de archivo
                    borderRadius: '5px',
                    backgroundColor: '#f9f9f9',
                    cursor: 'pointer',
                  }}
                />
                <Typography variant="caption" color="textSecondary" style={{ marginTop: '5px' }}>
                  Agregar imagen del negocio
                </Typography>
              </div>

              {/* Botón de Submit Inferior */}
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
