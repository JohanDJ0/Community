import React, { useState, useEffect } from 'react';
import { Chip, Button, Avatar, Divider, Stack } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import '../../css/App.css';
import { Box, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { Snackbar, Alert  } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

interface ServicesProps {
  darkMode: boolean;
}

interface Comment {
  author: string;
  text: string;
}

const ProposalDetail: React.FC<ServicesProps> = ({ darkMode }) => {
  const { serviceId, proposalId, serviceName } = useParams<{ serviceId: string, proposalId: string, serviceName: string }>();
  const { user } = useAuth0();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [inDeliberation, setInDeliberation] = useState(true); 
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [voted, setVoted] = useState(false);
  const [vote, setVote] = useState<string | null>(null);
  const [deliberationEnded, setDeliberationEnded] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null); // Mensaje de alerta
const [showAlert, setShowAlert] = useState(false); // Visibilidad de la alerta


  useEffect(() => {
    const fetchProposalDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token obtenido desde propuestas:', token);

        const response = await fetch(`/proposalsDetail/${proposalId}`);
        if (!response.ok) {
          throw new Error('Error al obtener la propuesta');
        }

        const data = await response.json();
        console.log('Propuesta cargada:', data);

        if (data && Array.isArray(data) && data.length > 0) {
          const proposalData = data[0]; // Extraemos el primer elemento

          setProposal(proposalData); // Guardamos directamente el objeto

          // Cargar comentarios si existen
          const loadedComments = proposalData.comments.map((comment: { written_by: string; message: string }) => ({
            author: comment.written_by, // Nombre o correo del autor
            text: comment.message,
          }));
          setComments(loadedComments);

          // Obtener la fecha de cierre del debate
          const closeDateDebate = new Date(proposalData.close_date_debate);
          const now = new Date();
          console.log('Fecha actual (now):', now);
          console.log('Fecha de cierre del debate (closeDateDebate):', closeDateDebate);
          console.log("id de la propuesta",proposalId);

          const timeDiff = closeDateDebate.getTime() - now.getTime();
          setTimeRemaining(Math.floor(timeDiff / 1000)); // Guardamos el tiempo restante en segundos
        } else {
          console.error('La respuesta no contiene datos válidos.');
        }
      } catch (error) {
        console.error('Error al cargar la propuesta:', error);
      }
    };

    fetchProposalDetails();
  }, [proposalId]);

  useEffect(() => {
    if (timeRemaining <= 0 && proposal?.status === 'Debate') {
      setProposal((prev: any) => ({ ...prev, status: 'Deliberación' }));
    }
  }, [timeRemaining, proposal?.status]);

  // Lógica del temporizador de deliberación
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (inDeliberation && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer!);
            setInDeliberation(false); // Termina deliberación
            setDeliberationEnded(true); // Marca que la deliberación ha terminado
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    else {
      if (timer) {
        clearInterval(timer);
      }
      setTimeRemaining(0);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [inDeliberation, timeRemaining]);

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(event.target.value);
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      const authorName = user?.name || 'Nombre no disponible';
      setComments([...comments, { author: authorName, text: newComment.trim() }]);
      setNewComment('');

      const token = localStorage.getItem('token');  // Obtener el token desde localStorage

      if (token) { // Verifica si el token existe
        const requestBody = {
          params: {
            token: token,  // Token del usuario
            name: newComment.trim(),  // Comentario que se está enviando
            serviceId: serviceId      // ID del servicio
          }
        };

        fetch(`/comment/${proposalId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Error al enviar el comentario');
            }
            return response.json();
          })
          .then((data) => {
            if (data.result && data.result.id !== null) {
              // Agregar comentario solo si se recibe un ID válido
              setComments([
                ...comments,
                { author: user?.name || 'Nombre no disponible', text: newComment.trim() }
              ]);
              setNewComment('');
              console.log('Comentario enviado con éxito:', data);
            } else {
              console.error('Error: El comentario no tiene un ID válido');
            }
          })
          .catch((error) => {
            console.error('Error al enviar el comentario:', error);
          });
      } else {
        console.error('Error: El token no está disponible');
      }
    }
  };

  const handleVote = async (option: string) => {
    try {
      const token = localStorage.getItem('token'); // Obtener el token desde localStorage
      if (!token) {
        console.error('Error: Token no disponible');
        return;
      }
  
      const requestBody = {
        params: {
          token: token,
          name: option,
        },
      };
  
      const response = await fetch(`/vote/${proposalId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error('Error al enviar el voto');
      }
  
      const data = await response.json();
      console.log('Voto enviado con éxito:', data);
  
      if (data.result && data.result.validacion === false) {
        setAlertMessage(data.result.message || 'Ya has votado en esta propuesta.');
        setShowAlert(true);
        return;
      }
  
      setVote(option);
      setVoted(true); // Marcar como votado
    } catch (error) {
      console.error('Error al enviar el voto:', error);
      setAlertMessage('Ocurrió un error al enviar el voto.');
      setShowAlert(true);
    }
  };
  
  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`;
  };
  if (!proposal) {
    return <Typography>Loading...</Typography>; // Mientras se carga la propuesta
  }

  return (
    <div className="first-div">
      <div className="second-div">
        <div className={`box-div ${darkMode ? 'dark' : 'light'}`}>
          <div style={{ display: 'flex', alignItems: 'center', textAlign: 'left', paddingBottom: '10px' }}>
            <HomeIcon style={{ marginRight: '4px' }} />
            <a onClick={() => navigate("/Services")} style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>Inicio</a>
            <span style={{ margin: '0 8px' }}>/</span>
            <a onClick={() => navigate(`/services/${serviceId}`)} style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>{serviceName}</a>
            <span style={{ margin: '0 8px' }}>/</span>
            <a onClick={() => navigate(`/proposal/${serviceId}`)} style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>Propuestas</a>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ fontWeight: 'bold' }}>{proposal.name}</span>
          </div>
          <Box display="flex">
            <Box flex={2} pr={4}>
              <Typography variant="h5" gutterBottom color={darkMode ? 'lightgray' : 'textPrimary'}>
                {proposal?.name} {/* Accede al nombre de la propuesta */}
              </Typography>

              <Typography variant="subtitle1" color={darkMode ? 'lightgray' : 'textSecondary'} gutterBottom>
                Detalles de propuesta
              </Typography>
              <Divider />
              <Typography variant="body2" mt={2} color={darkMode ? 'lightgray' : 'textSecondary'}>
                {proposal?.description === false ? 'Descripción no disponible' : proposal?.description || 'No hay detalles disponibles.'}
              </Typography>

              <Box mt={2} style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {comments.length > 0 && (
                  <Typography variant="body2" color={darkMode ? 'lightgray' : 'textSecondary'}>
                    Comentarios:
                  </Typography>
                )}
                <Stack spacing={1}>
                  {comments.map((comment, index) => {
                    // Normalizar y comparar los nombres
                    const normalizedCommentAuthor = comment.author?.trim().toLowerCase();
                    const normalizedUserName = user?.name?.trim().toLowerCase();

                    const isCurrentUser = normalizedCommentAuthor === normalizedUserName;

                    return (
                      <Box
                        key={index}
                        p={1}
                        borderRadius={1}
                        bgcolor={darkMode ? '#424242' : '#f5f5f5'}
                        border={`1px solid ${darkMode ? '#666' : '#e0e0e0'}`}
                        style={{
                          alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
                          textAlign: isCurrentUser ? 'right' : 'left',
                          maxWidth: '60%', // Mantiene un tamaño razonable
                        }}
                      >
                        <Typography
                          variant="body2"
                          color={darkMode ? 'lightgray' : 'textPrimary'}
                          style={{ fontWeight: 'bold', textAlign: isCurrentUser ? 'right' : 'left' }}
                        >
                          {comment.author}
                        </Typography>
                        <Typography
                          variant="body2"
                          color={darkMode ? 'lightgray' : 'textPrimary'}
                          style={{ textAlign: isCurrentUser ? 'right' : 'left' }}
                        >
                          {comment.text}
                        </Typography>
                      </Box>
                    );
                  })}

                </Stack>

              </Box>

              {proposal?.status !== 'Deliberación' && (
                <Box mt={2}>
                  <textarea
                    style={{ width: '100%', height: '60px' }}
                    value={newComment}
                    onChange={handleCommentChange}
                    placeholder="Escribe tu comentario aquí"
                  />
                  <Button variant="contained" color="primary" style={{ marginTop: '8px' }} onClick={handleCommentSubmit}>
                    Enviar comentario
                  </Button>
                </Box>
              )}

            </Box>

            <Box flex={1} pl={4} borderLeft={`1px solid ${darkMode ? '#666' : '#e0e0e0'}`}>
              {proposal?.status === 'Debate' && (
                <Box>
             <Box
  sx={{
    display: 'flex',
    flexDirection: 'column', // Organiza "Estado de la propuesta" y el valor en columnas
    alignItems: 'center', // Centra horizontalmente
    padding: 2,
    textAlign: 'center', // Centra el texto dentro del contenedor
    boxShadow: darkMode ? '0 4px 8px rgba(0, 0, 0, 0.3)' : '0 4px 8px rgba(0, 0, 0, 0.1)', // Sombra suave
    maxWidth: '300px', // Limitar el ancho para que no sea demasiado grande
    margin: '16px auto', // Espaciado vertical y centrado horizontal
  }}
>
  <Typography variant="body2" color={darkMode ? 'lightgray' : 'textPrimary'}>
    Estado de la propuesta:
  </Typography>
  
  <Typography
    variant="h6"
    sx={{
      marginTop: 1,
      padding: '6px 12px', // Un poco más de relleno
      backgroundColor: darkMode ? '#616161' : '#b2ebf2', // Fondo del estado
      color: darkMode ? '#fff' : '#004d40', // Color del texto
      borderRadius: '12px', // Bordes más redondeados
      fontWeight: 'bold',
      width: 'fit-content', // Ajusta el ancho al contenido
      margin: '10px auto', // Centra la etiqueta en el contenedor
    }}
  >
    {proposal?.status || 'Estado no disponible'}
  </Typography>
</Box>


                  <Typography variant="body2" color={darkMode ? 'lightgray' : 'textPrimary'}>
                    Toma de decisiones/comentarios
                  </Typography>
                  <Box
                    mt={2}
                    p={2}
                    bgcolor={darkMode ? '#424242' : '#f5f5f5'}
                    borderRadius={1}
                    border={`1px solid ${darkMode ? '#666' : '#e0e0e0'}`}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography variant="h6" color={darkMode ? '#fff' : '#000'} fontWeight="bold" sx={{ textAlign: 'center' }}>
                      Tiempo restante: {formatTime(timeRemaining)}
                    </Typography>
                  </Box>
                </Box>
              )}

              {proposal?.status === 'Deliberación' && (
                <Box mt={2}>
                  {!voted ? (
                    <>
 <Box
  sx={{
    display: 'flex',
    flexDirection: 'column', // Organiza "Estado de la propuesta" y el valor en columnas
    alignItems: 'center', // Centra horizontalmente
    padding: 2,
    textAlign: 'center', // Centra el texto dentro del contenedor
    boxShadow: darkMode ? '0 4px 8px rgba(0, 0, 0, 0.3)' : '0 4px 8px rgba(0, 0, 0, 0.1)', // Sombra suave
    maxWidth: '300px', // Limitar el ancho para que no sea demasiado grande
    margin: '16px auto', // Espaciado vertical y centrado horizontal
  }}
>
  <Typography variant="body2" color={darkMode ? 'lightgray' : 'textPrimary'}>
    Estado de la propuesta:
  </Typography>
  
  <Typography
    variant="h6"
    sx={{
      marginTop: 1,
      padding: '6px 12px', // Un poco más de relleno
      backgroundColor: darkMode ? '#616161' : '#b2ebf2', // Fondo del estado
      color: darkMode ? '#fff' : '#004d40', // Color del texto
      borderRadius: '12px', // Bordes más redondeados
      fontWeight: 'bold',
      width: 'fit-content', // Ajusta el ancho al contenido
      margin: '10px auto', // Centra la etiqueta en el contenedor
    }}
  >
    {proposal?.status || 'Estado no disponible'}
  </Typography>
</Box>


                      <Typography variant="h6" color={darkMode ? 'lightgray' : 'textPrimary'} gutterBottom>
                        Vota ahora:
                      </Typography>
                      <Stack spacing={1}>
                        <Button
                          variant="contained"
                          color={vote === 'yes' ? 'success' : 'primary'}
                          onClick={() => handleVote('yes')}
                          style={{
                            backgroundColor: vote === 'yes' ? '#388e3c' : '#1976d2',
                            color: 'white',
                          }}
                        >
                          Aprobar
                        </Button>
                        <Button
                          variant="contained"
                          color={vote === 'no' ? 'error' : 'primary'}
                          onClick={() => handleVote('no')}
                          style={{
                            backgroundColor: vote === 'no' ? '#d32f2f' : '#1976d2',
                            color: 'white',
                          }}
                        >
                          Rechazar
                        </Button>
                        <Button
                          variant="contained"
                          color={vote === 'meh' ? 'error' : 'primary'}
                          onClick={() => handleVote('meh')}
                          style={{
                            backgroundColor: vote === 'meh' ? '#d32f2f' : '#1976d2',
                            color: 'white',
                          }}
                        >
                          Me abstengo
                        </Button>
                      </Stack>
                    </>
                  ) : (
                    <Typography variant="body2" color={darkMode ? 'lightgray' : 'textPrimary'}>
                      ¡Gracias por votar!
                    </Typography>
                  )}
                </Box>
              )}
            </Box>

          </Box>
        </div>
      </div>
      <Snackbar
  open={showAlert}
  autoHideDuration={6000} // Tiempo en milisegundos (6 segundos)
  onClose={() => setShowAlert(false)} // Cerrar al terminar el tiempo o manualmente
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Posición de la alerta
>
  <Alert
    onClose={() => setShowAlert(false)}
    severity="error" // Cambiar según el tipo de alerta ('error', 'warning', 'info', 'success')
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center', // Centra el texto
      width: '100%', // Asegura que el contenido ocupe todo el ancho disponible
    }}
  >
    {alertMessage}
  </Alert>
</Snackbar>

    </div>
  );
};

export default ProposalDetail;
