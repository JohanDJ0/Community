import React from 'react'
interface ServicesProps {
  darkMode: boolean;
}
const MyServicePage: React.FC<ServicesProps> = ({ darkMode }) => {
  return (
    <div className='first-div'>
      <div className='second-div'>
      <div className={`box-div ${darkMode ? 'dark' : 'light'}`}> 
          <h2>Vista de My Servicio</h2>
        </div>
      </div>
    </div>
  );
};
export default MyServicePage
