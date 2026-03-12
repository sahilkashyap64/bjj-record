import React from 'react';
import { WeeklyReport, MonthlyReport } from '../types';
import './Dashboard.css';

interface DashboardProps {
  report: WeeklyReport | MonthlyReport;
  type: 'weekly' | 'monthly';
}

export const Dashboard: React.FC<DashboardProps> = ({ report, type }) => {
  return (
    <div className="dashboard">
      <h2 className="dashboard-title">
        {type === 'weekly' ? 'Weekly' : 'Monthly'} Summary
      </h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Sessions</div>
          <div className="stat-value">{report.sessionsCount}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Mat Minutes</div>
          <div className="stat-value">{report.totalDurationMin}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Total Load</div>
          <div className="stat-value">{report.totalLoad}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Avg sRPE</div>
          <div className="stat-value">{report.averageSRPE.toFixed(1)}</div>
        </div>
      </div>

      <div className="kpi-section">
        <h3>Key Performance Indicators</h3>
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-label">Escape Rate</div>
            <div className="kpi-value">{(report.kpis.escapeRate * 100).toFixed(1)}%</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-label">Guard Pass Defense</div>
            <div className="kpi-value">{(report.kpis.guardPassDefenseRate * 100).toFixed(1)}%</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-label">Submission Finish Rate</div>
            <div className="kpi-value">{(report.kpis.submissionFinishRate * 100).toFixed(1)}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};
