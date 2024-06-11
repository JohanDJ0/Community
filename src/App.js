import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import HomePage from './pages/HomePage';
import SeguidosPage from './pages/SeguidosPage';
import RewardsPage from './pages/RewardsPage';
import JoinBusinessPage from './pages/JoinBusinessPage';
import ProfilePage from './pages/ProfilePage';
import './css/App.css';
import Header from './components/header'

const App = () => {
  return (
    
    <Router>
      <Header />
      <div className="App">
        <div className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/Seguidos" element={<SeguidosPage />} />
            <Route path="/Rewards" element={<RewardsPage/>}/>
            <Route path="/JoinBusiness" element={<JoinBusinessPage/>}/>
            <Route path="/Profile" element={<ProfilePage/>}/>
          </Routes> 
        </div>
      </div>
    </Router>
  );
};

export default App;
