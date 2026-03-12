import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/appStore';
import apiClient from './services/api';
import idbService from './services/idb';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { SessionsPage } from './pages/SessionsPage';
import './App.css';

const App: React.FC = () => {
  const { isLoggedIn, token, setUser, setToken } = useAppStore();

  useEffect(() => {
    // Initialize IndexedDB
    idbService.init();

    // Check for existing session
    const savedToken = localStorage.getItem('auth_token');
    if (savedToken) {
      setToken(savedToken);
      apiClient.setToken(savedToken);
      
      // Fetch user data
      apiClient.getMe()
        .then(user => setUser(user))
        .catch(() => {
          localStorage.removeItem('auth_token');
          setToken(null);
        });
    }
  }, [setUser, setToken]);

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          {isLoggedIn ? (
            <>
              <Route path="/" element={<HomePage />} />
              <Route path="/sessions" element={<SessionsPage />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
