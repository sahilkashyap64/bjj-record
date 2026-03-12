import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/appStore';
import apiClient from '../services/api';
import { SessionLog } from '../types';
import './SessionsPage.css';

export const SessionsPage: React.FC = () => {
  const { user } = useAppStore();
  const [sessions, setSessions] = useState<SessionLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const data = await apiClient.getSessions(undefined, undefined, 50);
        setSessions(data);
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [user?.id]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculateLoad = (duration: number, sRPE: number) => {
    return (duration * sRPE).toFixed(0);
  };

  return (
    <div className="sessions-page">
      <h2>Training Sessions</h2>

      {loading && <p>Loading sessions...</p>}

      {sessions.length === 0 && !loading && (
        <p className="empty">No sessions logged yet. Start by logging your first session!</p>
      )}

      <div className="sessions-list">
        {sessions.map((session) => (
          <div key={session.id} className="session-card">
            <div className="session-header">
              <div>
                <div className="session-date">{formatDate(session.createdAt)}</div>
                <div className="session-type">{session.sessionType}</div>
              </div>
              <div className="session-badge">{session.gi ? 'Gi' : 'No Gi'}</div>
            </div>

            <div className="session-stats">
              <div className="stat">
                <span className="label">Duration</span>
                <span className="value">{session.durationMin} min</span>
              </div>
              <div className="stat">
                <span className="label">sRPE</span>
                <span className="value">{session.sRPE}</span>
              </div>
              <div className="stat">
                <span className="label">Load</span>
                <span className="value">{calculateLoad(session.durationMin, session.sRPE)}</span>
              </div>
              <div className="stat">
                <span className="label">Status</span>
                <span className={`value ${session.syncStatus}`}>{session.syncStatus}</span>
              </div>
            </div>

            {session.rounds && session.rounds.length > 0 && (
              <div className="rounds-info">
                {session.rounds.length} round{session.rounds.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
