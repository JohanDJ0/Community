import React from 'react';
import '../css/App.css';
import { User, useAuth0 } from '@auth0/auth0-react';


function ProfilePage() {
  const {user, isAuthenticated} = useAuth0();
  return (
    isAuthenticated &&(
      <div className='first-div'>
      <div className='second-div'>
        <div className='box-div'>
          <img src={user?.picture}/>
          <h2>{user?.name}</h2>
          <p>{user?.email}</p>
        </div>
      </div>
    </div>
    )
  );
}

export default ProfilePage;