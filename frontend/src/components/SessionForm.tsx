import React from 'react';
import './SessionForm.css';

interface SessionFormProps {
  onSubmit: (data: any) => void;
  loading?: boolean;
}

export const SessionForm: React.FC<SessionFormProps> = ({ onSubmit, loading = false }) => {
  const [duration, setDuration] = React.useState(60);
  const [sRPE, setSRPE] = React.useState(5);
  const [sessionType, setSessionType] = React.useState('open_mat');
  const [gi, setGi] = React.useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      durationMin: duration,
      sRPE,
      sessionType,
      gi,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="session-form">
      <div className="form-group">
        <label>Duration (minutes)</label>
        <input
          type="number"
          min="1"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          required
        />
      </div>

      <div className="form-group">
        <label>sRPE (0-10)</label>
        <input
          type="range"
          min="0"
          max="10"
          step="0.5"
          value={sRPE}
          onChange={(e) => setSRPE(Number(e.target.value))}
        />
        <span>{sRPE}</span>
      </div>

      <div className="form-group">
        <label>Session Type</label>
        <select value={sessionType} onChange={(e) => setSessionType(e.target.value)}>
          <option value="drilling">Drilling</option>
          <option value="open_mat">Open Mat</option>
          <option value="class">Class</option>
          <option value="competition">Competition</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="form-group checkbox">
        <label>
          <input
            type="checkbox"
            checked={gi}
            onChange={(e) => setGi(e.target.checked)}
          />
          With Gi
        </label>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Log Session'}
      </button>
    </form>
  );
};
