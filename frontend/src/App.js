import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ListingList from './pages/ListingList';
import AddListing from './pages/AddListing';
import ListingDetail from './pages/ListingDetail';
import PasswordModal from './components/PasswordModal';
import './App.css';

function App() {
  const [auth, setAuth] = useState(() => localStorage.getItem('facdoc_auth') === 'ok');
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // 인증 성공 시 localStorage에 저장
  const handleAuthSuccess = useCallback(() => {
    setAuth(true);
    localStorage.setItem('facdoc_auth', 'ok');
    setModalOpen(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }, [pendingAction]);

  // 로그아웃 기능
  const handleLogout = useCallback(() => {
    setAuth(false);
    localStorage.removeItem('facdoc_auth');
  }, []);

  // 로그인 모달 열기
  const handleLogin = useCallback(() => {
    setModalOpen(true);
  }, []);

  // 인증 필요시 모달 열기
  const requireAuth = useCallback((action) => {
    if (auth) {
      if (action) action();
    } else {
      setPendingAction(() => action);
      setModalOpen(true);
    }
  }, [auth]);

  return (
    <Router>
      <div className="App">
        <Navbar auth={auth} onLogin={handleLogin} onLogout={handleLogout} />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home requireAuth={requireAuth} auth={auth} />} />
            <Route path="/listings" element={<ListingList requireAuth={requireAuth} auth={auth} />} />
            <Route path="/add" element={<AddListing requireAuth={requireAuth} auth={auth} />} />
            <Route path="/listing/:id" element={<ListingDetail requireAuth={requireAuth} auth={auth} />} />
          </Routes>
        </div>
        <PasswordModal open={modalOpen} onSuccess={handleAuthSuccess} onClose={() => setModalOpen(false)} />
      </div>
    </Router>
  );
}

export default App; 