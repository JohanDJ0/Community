import React from 'react';
import '../css/App.css';
import { useAuth0 } from '@auth0/auth0-react';
import Avatar from '@mui/material/Avatar';
import { Stack } from '@mui/material';

function ProfilePage() {
  const { user, isAuthenticated } = useAuth0();
  return (
    isAuthenticated && (
      <div className='first-div'>
        <div className='second-div'>
          <div className='box-div'>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar src={user?.picture} sx={{ width: 200, height: 200 }} />
              <Stack direction="column" spacing={1}>
                <h2>{user?.name}</h2>
                <p>{user?.email}</p>
              </Stack>
            </Stack>
          </div>
        </div>
      </div>
    )
  );
}



export default ProfilePage;
