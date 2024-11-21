import React, { useState, useEffect } from 'react';
import { Chip, Button, Avatar, Divider, Stack } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import '../../css/App.css';
import { Box, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';

interface ServicesProps {
  darkMode: boolean;
}

interface Comment {
  author: string;
  text: string;
}

const ProposalDetail: React.FC<ServicesProps> = ({ darkMode }) => {
  const { serviceId, proposalId } = useParams<{ serviceId: string, proposalId: string }>();
  const { user } = useAuth0();
  const [proposal, setProposal] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [inDeliberation, setInDeliberation] = useState(true); // Iniciar directamente en deliberación
  const [timeRemaining, setTimeRemaining] = useState(0); // Tiempo restante basado en la fecha
  const [voted, setVoted] = useState(false);
  const [vote, setVote] = useState<string | null>(null);
  const [deliberationEnded, setDeliberationEnded] = useState(false);

  useEffect(() => {
    console.log("Service ID:", serviceId);
    console.log("Proposal ID:", proposalId);
    const token = localStorage.getItem('token');
    console.log("Token obtenido desde propuestas:", token);

    fetch(`/proposalsDetail/${proposalId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener la propuesta');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Propuesta cargada:', data);
        setProposal(data[0]);

        // Cargar comentarios si existen
        const loadedComments = data[0].comments.map((comment: { written_by: string; message: string }) => ({
          author: comment.written_by, // Nombre o correo del autor
          text: comment.message,
        }));
        setComments(loadedComments);

        // Obtener la fecha de cierre del debate
        const closeDateDebate = new Date(data[0].close_date_debate);
        const now = new Date();
        // Agregar console.log para verificar las fechas y la diferencia de tiempo
        console.log('Fecha actual (now):', now);
        console.log('Fecha de cierre del debate (closeDateDebate):', closeDateDebate);
        const timeDiff = closeDateDebate.getTime() - now.getTime();
        setTimeRemaining(Math.floor(timeDiff / 1000)); // Guardamos el tiempo restante en segundos
      })

      .catch((error) => {
        console.error('Error al cargar la propuesta:', error);
      });

    fetch(`/services/${serviceId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener el servicio');
        }
        return response.json();
      })
      .then((serviceData) => {
        console.log('Detalles del servicio:', serviceData);
      })
      .catch((error) => {
        console.error('Error al cargar el servicio:', error);
      });
  }, [serviceId, proposalId]);

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

  const handleVote = (option: string) => {
    setVote(option);
    setVoted(true);
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
                    Comentarios existentes:
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

              {inDeliberation && !voted && (
                <Box mt={2}>
                  <Typography variant="body2" color={darkMode ? 'lightgray' : 'textSecondary'}>
                    Agregar comentario:
                  </Typography>
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
              {inDeliberation && (
                <Box>
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

              {deliberationEnded && !voted && (
                <Box mt={2}>
                  <Typography variant="h6" color={darkMode ? 'lightgray' : 'textPrimary'} gutterBottom>
                    El debate ha terminado. Vota ahora:
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
                  </Stack>
                </Box>
              )}

              {voted && (
                <Box mt={2}>
                  <Typography variant="body2" color={darkMode ? 'lightgray' : 'textPrimary'}>
                    ¡Gracias por votar!
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default ProposalDetail;
