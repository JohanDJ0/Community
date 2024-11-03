// ProposalDetail.tsx
import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box, Button, Stack, Rating } from '@mui/material';
import GradeIcon from '@mui/icons-material/Grade';
import ShareIcon from '@mui/icons-material/Share';
import BackHandIcon from '@mui/icons-material/BackHand';
import AddIcon from '@mui/icons-material/Add';
import { useMediaQuery } from '@mui/material';
import Novedades from 'components/Propuestas';
interface ProposalsProps {
  darkMode: boolean;
}

const ProposalDetail: React.FC<ProposalsProps> = ({ darkMode }) => {
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  return (
    <div className='first-div'>
      <div className='second-div'>
        <div className={`box-div ${darkMode ? 'dark' : 'light'}`}>
          <Card style={{ maxHeight: isSmallScreen ? '400px' : '500px', overflowY: 'auto' }}>
            <Box position="relative" width="100%" height={isSmallScreen ? '200px' : '300px'}>
              <CardMedia
                component="img"
                height={isSmallScreen ? '200' : '300'}
                image="https://w.wallhaven.cc/full/o5/wallhaven-o5xmv9.jpg"
                alt="Nombre de la Propuesta"
                className='image-service'
                style={{ filter: 'brightness(0.7)' }}
              />
              <Typography
                variant={isSmallScreen ? "h5" : "h1"}
                style={{
                  position: 'absolute',
                  bottom: '30px',
                  left: '10px',
                  color: 'white',
                  padding: '5px',
                }}
              >
                Nombre de la Propuesta
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  color: 'white',
                  padding: '5px',
                }}
              >
                <Rating name="read-only" value={4.5} readOnly />
              </Typography>
            </Box>

            <CardContent>
              <Stack spacing={1} direction="row">
                <Button
                  variant="contained"
                  startIcon={<GradeIcon />}
                  style={{ fontSize: isSmallScreen ? '0.7rem' : '0.9rem', padding: isSmallScreen ? '4px 8px' : '6px 12px' }}
                >
                  Novedades
                </Button>
                <Button
                  variant="contained"
                  startIcon={<BackHandIcon />}
                  style={{ fontSize: isSmallScreen ? '0.7rem' : '0.9rem', padding: isSmallScreen ? '4px 8px' : '6px 12px' }}
                >
                  Reseñas
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ShareIcon />}
                  style={{ fontSize: isSmallScreen ? '0.7rem' : '0.9rem', padding: isSmallScreen ? '4px 8px' : '6px 12px' }}
                >
                  Compartir
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  style={{ fontSize: isSmallScreen ? '0.7rem' : '0.9rem', padding: isSmallScreen ? '4px 8px' : '6px 12px' }}
                >
                  Seguir
                </Button>
              </Stack>
              <Typography variant="body2" color="text.secondary" align='left' paddingBottom={'5px'}>
                Descripción: Descripción breve de la propuesta.
              </Typography>

              {/* Uso del componente Novedades */}
              <Novedades />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ProposalDetail;
