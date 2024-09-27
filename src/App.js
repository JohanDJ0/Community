import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/client/HomePage';
import SeguidosPage from './pages/client/SeguidosPage';
import RewardsPage from './pages/client/RewardsPage';
import JoinBusinessPage from './pages/client/JoinBusinessPage';
import ProfilePage from './pages/client/ProfilePage';
import Header from './components/Header';
import Services from './pages/client/Services';
import Login from './pages/client/Login';
import ServiceDetail from './pages/client/ServiceDetail';
import VistaRol from './pages/owner/VistaRol';


const Layout = ({ children }) => {
  const location = useLocation();



  return (
    <>
{location.pathname !== '/' && location.pathname !== '/Login'&& location.pathname !== '/VistaRol' && <Header />}
      <div className="App">
        <div className="content">
          {children}
        </div>
      </div>
    </>
  );
};




const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Seguidos" element={<SeguidosPage />} />
          <Route path="/Rewards" element={<RewardsPage />} />
          <Route path="/JoinBusiness" element={<JoinBusinessPage />} />
          <Route path="/Profile" element={<ProfilePage />} />
          <Route path="/Services" element={<Services />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path='/VistaRol' element={<VistaRol />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;