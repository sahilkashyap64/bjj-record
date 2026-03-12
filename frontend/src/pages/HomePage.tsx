import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { useOnline } from '../hooks';
import apiClient from '../services/api';
import idbService from '../services/idb';
import { SessionForm } from '../components/SessionForm';
import { Dashboard } from '../components/Dashboard';
import { WeeklyReport } from '../types';
import './HomePage.css';

export const HomePage: React.FC = () => {
  const { user, setUser } = useAppStore();
  const navigate = useNavigate();
  const isOnline = useOnline();

  const [report, setReport] = useState<WeeklyReport | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWeeklyReport = async () => {
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekStartStr = weekStart.toISOString().split('T')[0];

      try {
        const weeklyReport = await apiClient.getWeeklyReport(weekStartStr);
        setReport(weeklyReport);
      } catch (error) {
        console.error('Failed to fetch report:', error);
      }
    };

    if (isOnline) {
      fetchWeeklyReport();
    }
  }, [isOnline]);

  const handleSessionSubmit = async (data: any) => {
    setLoading(true);

    try {
      const session = await apiClient.createSession({
        durationMin: data.durationMin,
        sRPE: data.sRPE,
        sessionType: data.sessionType,
        gi: data.gi,
      });

      // Also save to IndexedDB
      await idbService.saveSession({ ...session, userId: user?.id });

      // Refresh weekly report
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekStartStr = weekStart.toISOString().split('T')[0];
      const weeklyReport = await apiClient.getWeeklyReport(weekStartStr);
      setReport(weeklyReport);

      alert('Session logged successfully!');
    } catch (error) {
      console.error('Failed to log session:', error);
      alert('Failed to log session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="home-page">
      <header className="header">
        <div className="header-content">
          <h1>BJJ Record</h1>
          <div className="header-actions">
            <span className={`online-indicator ${isOnline ? 'online' : 'offline'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
            {user && <span className="user-info">{user.email}</span>}
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="home-layout">
            <div className="session-section">
              <h2>Quick Session Entry</h2>
              <p className="subtitle">Log your session in ~2 minutes</p>
              <SessionForm onSubmit={handleSessionSubmit} loading={loading} />
            </div>

            <div className="dashboard-section">
              {report ? (
                <Dashboard report={report} type="weekly" />
              ) : (
                <div className="loading">Loading report...</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
