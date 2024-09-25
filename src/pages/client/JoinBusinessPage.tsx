import React, { useState } from 'react'; // Importamos React y el hook useState para manejar el estado del componente
import { TextField, Button, Box } from '@mui/material'; // Importamos componentes de Material UI
import '../../css/App.css';

// Definimos el componente funcional JoinBusinessPage
const JoinBusinessPage: React.FC = () => {
  // Definimos dos variables de estado:
  // - businessName para almacenar el valor del input (nombre del negocio)
  // - isValid para controlar la clase de validación (si es válido o no)
  const [businessName, setBusinessName] = useState(''); 
  const [isValid, setIsValid] = useState(true); 

  // Función que se ejecuta cuando se hace clic en el botón "Unirse"
  const handleJoinClick = async () => {
    console.log('Nombre del negocio:', businessName); // Mostramos el valor ingresado en la consola

    const id_user = 14; // ID de usuario estático para esta prueba (se puede reemplazar dinámicamente)

    // Definimos el cuerpo de la solicitud que se enviará al servidor
    const data = {
      "params": {
        access_code: businessName // El código de acceso se toma del valor del input (businessName)
      }
    };

    // Realizamos una solicitud POST al backend usando fetch:
    // - Método POST para enviar datos
    // - Cabecera para indicar que el contenido es JSON
    // - El cuerpo de la solicitud contiene el objeto data con el código de acceso
    const response = await fetch(`/search_service/${id_user}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), // Convertimos el objeto a formato JSON
    });
    

    // Convertimos la respuesta a JSON y la mostramos en la consola
    const result = await response.json();
    console.log(result); 

    // Validamos si el campo businessName está vacío:
    // - Si está vacío, se establece isValid en false (invalid)
    // - Si tiene contenido, se establece isValid en true (valid)
    if (businessName.trim() === '') {
      setIsValid(false); // Si el campo está vacío, indicamos que no es válido
    } else {
      setIsValid(true); // Si hay texto, indicamos que es válido
    }
  };

  return (
    // Estructura principal del componente:
    <div className='first-div'>
      <div className='second-div'>
        <div className='box-div'>
          <h2>Unirse a un negocio</h2> {/* Título de la página */}

          {/* Caja de texto para ingresar el código de acceso del negocio */}
          <Box mt={2}>
            <TextField
              label="Nombre del negocio" // Etiqueta del campo
              variant="filled" // Estilo del input
              fullWidth // Ancho completo
              style={{ marginBottom: '10px' }} // Margen inferior
              value={businessName} // Enlazamos el valor del input con el estado businessName
              onChange={(e) => setBusinessName(e.target.value)} // Actualizamos el estado cuando el usuario escribe
            />
          </Box>

          {/* Botón para unirse al negocio */}
          <Box mt={2} display="flex" justifyContent="center">
            <Button
              variant='contained' // Estilo de botón con relleno
              sx={{
                backgroundColor: '#2EC6BD', // Color del botón
                '&:hover': {
                  backgroundColor: '#2EC6BD', // Color al hacer hover
                },
              }}
              onClick={handleJoinClick} // Llamamos a la función handleJoinClick al hacer clic en el botón
            >
              Unirse
            </Button>
          </Box>

          {/* Muestra el mensaje de validación (basado en el estado isValid) */}
          <div className={isValid ? 'invalid' : 'valid'}>
            Validación
          </div>
        </div>
      </div>
    </div>
  );
}

export default JoinBusinessPage; // Exportamos el componente para que pueda ser usado en otras partes de la aplicación