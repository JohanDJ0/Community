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
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth0();

  console.log("ID de la propuesta:", id);

  const [inDeliberation, setInDeliberation] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [voted, setVoted] = useState(false);
  const [vote, setVote] = useState<string | null>(null);
  const [deliberationEnded, setDeliberationEnded] = useState(false); // Nuevo estado

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (inDeliberation) {
      setTimeRemaining(30);
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
    } else {
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
  }, [inDeliberation]);

  const handleDeliberationClick = () => {
    setInDeliberation(true);
  };

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(event.target.value);
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      const authorName = user?.name || "Nombre no disponible";
      setComments([...comments, { author: authorName, text: newComment.trim() }]);
      setNewComment('');
    }
  };

  const handleVote = (option: string) => {
    setVote(option);
    setVoted(true);
  };

  return (
    <div className='first-div'>
      <div className='second-div'>
        <div className={`box-div ${darkMode ? 'dark' : 'light'}`}>
          <Box display="flex">
            <Box flex={2} pr={4}>
              <Typography variant="h5" gutterBottom color={darkMode ? 'lightgray' : 'textPrimary'}>
                Propuesta de ejemplo {id}
              </Typography>
              <Typography variant="subtitle1" color={darkMode ? 'lightgray' : 'textSecondary'} gutterBottom>
                Detalles de propuesta
              </Typography>
              <Divider />
              <Typography variant="body2" mt={2} color={darkMode ? 'lightgray' : 'textSecondary'}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque volutpat dui sed
                est varius, in pellentesque mi scelerisque. Morbi at mauris scelerisque diam gravida
                varius. Sed lacinia auctor eleifend. Pellentesque cursus felis vel dui facilisis, et
                viverra turpis volutpat. Integer dolor massa, condimentum ut fringilla non, semper quis
                sem. Vivamus vitae egestas purus. Donec quis tellus a dolor malesuada euismod. Nunc
                aliquam finibus risus, vitae commodo tellus imperdiet eget.
              </Typography>

              {/* Contenedor para los comentarios */}
              <Box mt={2} style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {comments.length > 0 && (
                  <Typography variant="body2" color={darkMode ? 'lightgray' : 'textSecondary'}>
                    Comentarios existentes:
                  </Typography>
                )}
                <Stack spacing={1} alignItems="flex-start">
                  {comments.map((comment, index) => (
                    <Box key={index} p={1} borderRadius={1} bgcolor={darkMode ? '#424242' : '#f5f5f5'} border={`1px solid ${darkMode ? '#666' : '#e0e0e0'}`}>
                      <Typography variant="body2" color={darkMode ? 'lightgray' : 'textPrimary'}>
                        <strong>{comment.author}</strong>
                      </Typography>
                      <Typography variant="body2" color={darkMode ? 'lightgray' : 'textPrimary'}>
                        {comment.text}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>

              {/* Área para agregar un nuevo comentario */}
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

            {/* Sección de estado de la propuesta */}
            <Box flex={1} pl={4} borderLeft={`1px solid ${darkMode ? '#666' : '#e0e0e0'}`}>
              {/* Mostrar solo si la deliberación no ha terminado */}
              {!deliberationEnded && !inDeliberation ? (
                <>
                  <Typography variant="subtitle1" gutterBottom color={darkMode ? 'lightgray' : 'textPrimary'}>
                    Estado
                  </Typography>

                  <Box mb={2}>
                    <Chip
                      label="Borrador"
                      style={{ backgroundColor: '#f48fb1', color: 'white' }}
                      icon={<Avatar style={{ backgroundColor: '#f48fb1', width: 12, height: 12 }} />}
                    />
                  </Box>

                  <Typography variant="body2" color={darkMode ? 'lightgray' : 'textSecondary'} gutterBottom>
                    Revisores
                  </Typography>
                  <Chip label="Todos los miembros" variant="outlined" />

                  <Box mt={2}>
     
                    <Button variant="contained" color="success">
                      Establecer tiempo
                    </Button>
                  </Box>
                  <Divider sx={{ my: 2 }} />

                  <Stack spacing={1}>
                    <Box display="flex" alignItems="center">
                      <Avatar style={{ backgroundColor: '#cfd8dc', width: 12, height: 12 }} />
                      <Typography variant="body2" ml={1} color={darkMode ? 'lightgray' : 'textSecondary'}>
                        Debate
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <Avatar style={{ backgroundColor: '#cfd8dc', width: 12, height: 12 }} />
                      <Typography variant="body2" ml={1} color={darkMode ? 'lightgray' : 'textSecondary'}>
                        Deliberación
                      </Typography>
                    </Box>
                    <Button variant="outlined" onClick={handleDeliberationClick}>
                      Deliberación
                    </Button>
                  </Stack>
                </>
              ) : null}

              {/* Sección de deliberación */}
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
                    <Typography
                      variant="h6"
                      color={darkMode ? '#fff' : '#000'}
                      fontWeight="bold"
                      sx={{ textAlign: 'center' }}
                    >
                      Tiempo restante: {timeRemaining} seg.
                    </Typography>
                  </Box>
                </Box>
              )}

               {/* // Dentro de la sección de votación*/}
              {deliberationEnded && (
                <Box mt={2}>
                  <Typography variant="h6" color={darkMode ? 'lightgray' : 'textPrimary'} gutterBottom>
                    ¿Se aprueba esta propuesta?
                  </Typography>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Elige una opción</FormLabel>
                    <RadioGroup
                      aria-label="voto"
                      name="radio-buttons-group"
                      onChange={(event) => handleVote(event.target.value)}
                    >
                      <FormControlLabel value="Sí" control={<Radio />} label="Sí" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Me abstengo" control={<Radio />} label="Me abstengo" />
                    </RadioGroup>
                  </FormControl>

                  {/* Mostrar el resultado de la votación si ya se votó */}
                  {voted && (
                    <Typography variant="body2" color={darkMode ? 'lightgray' : 'textPrimary'} mt={2}>
                      Has votado: {vote}
                    </Typography>
                  )}
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
