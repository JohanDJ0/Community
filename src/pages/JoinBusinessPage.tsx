import React from 'react';
import { TextField, Button, Box } from '@mui/material';
import '../css/App.css';

function JoinBusinessPage() {
  return (
    <div className='first-div'>
      <div className='second-div'>
        <div className='box-div'>
          <h2>Unirse a un negocio</h2>
          <Box mt={2}>
            <TextField
              label="Nombre del negocio"  
              variant="filled"
              fullWidth
              style={{ marginBottom: '10px' }}  
            />
          </Box>
          <Box mt={2} display="flex" justifyContent="center">
            <Button
              variant='contained'
              sx={{
                backgroundColor: '#2EC6BD',
                '&:hover': {
                  backgroundColor: '#2EC6BD',
                },
              }}
            >
              Unirse
            </Button>
          </Box>
        </div>
      </div>
    </div>
  );
}

export default JoinBusinessPage;
