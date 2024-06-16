import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SeguidosPage from './pages/SeguidosPage';
import RewardsPage from './pages/RewardsPage';
import JoinBusinessPage from './pages/JoinBusinessPage';
import ProfilePage from './pages/ProfilePage';
import Header from './components/Header';
import Services from './pages/Services';
import Login from './pages/Login';

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <>
      {location.pathname !== '/' && location.pathname !== '/Login' && <Header />}
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
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
