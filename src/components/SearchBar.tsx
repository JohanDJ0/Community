import React from 'react';
import { TextField, InputAdornment, IconButton, TextFieldProps } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const tealBlue = '#2EC6BD';

interface SearchBarProps {
  width?: string | number;
  maxWidth?: string | number;
}

const SearchBar: React.FC<SearchBarProps> = ({ width, maxWidth }) => {
  return (
    <TextField
      variant="outlined"
      placeholder="Buscar..."
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position="end" sx={{ marginRight: '-14px' }}>
            <IconButton
              sx={{
                backgroundColor: tealBlue,
                color: 'white',
                '&:hover': {
                  backgroundColor: tealBlue,
                },
                borderRadius: '50%',
                padding: '15px',
                margin: '0px',
              }}
            >
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        ),
        style: {
          borderRadius: '25px',
        },
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: tealBlue,
          },
          '&:hover fieldset': {
            borderColor: tealBlue,
          },
          '&.Mui-focused fieldset': {
            borderColor: tealBlue,
          },
          borderRadius: '25px',
        },
        width: width,
        maxWidth: maxWidth,
      }}
    />
  );
}

export default SearchBar;
