import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './Components/MainPage/MainPage';
import EventPage from './Components/EventPage/EventPage';
import Category from './Components/Category/Category';
import Navbar from './Components/Navbar/Navbar';
import Profile from './Components/Profile/Profile';
import LeaderBoard from './Components/LeaderBoard/LeaderBoard';
import ScrollToTop from './ScrollToTop';

function App() {

  return (
    <Router>
      <div className='App'>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/category/:category" element={<Category />} />
          <Route path="/event/:id" element={<EventPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/leaderboard" element={<LeaderBoard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
