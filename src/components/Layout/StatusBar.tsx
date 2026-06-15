// src/components/Layout/StatusBar.tsx
import React from 'react';
import './StatusBar.css';

interface StatusBarProps {
  sessionId?: string;
  messages?: number;
  lastUpdate?: string;
}

const StatusBar: React.FC<StatusBarProps> = ({ 
  sessionId = '—', 
  messages = 0, 
  lastUpdate = '—' 
}) => {
  return (
    <footer className="status-bar">
      <div className="status-left">
        <div className="status-item">
          <span className="status-dot connected"></span>
          <span>Подключено</span>
        </div>
        <div className="status-item">
          <span className="status-label">Сессия:</span>
          <span className="status-value">{sessionId.substring(0, 8)}...</span>
        </div>
      </div>

      <div className="status-center">
        <div className="status-item">
          <span className="status-label">Сообщений в очереди:</span>
          <span className={`status-value ${messages > 0 ? 'has-messages' : ''}`}>
            {messages}
          </span>
        </div>
      </div>

      <div className="status-right">
        <div className="status-item">
          <span className="status-label">Последнее обновление:</span>
          <span className="status-value">{lastUpdate}</span>
        </div>
        <div className="status-item">
          <span className="status-label">Частота опроса:</span>
          <span className="status-value">1000 мс</span>
        </div>
      </div>
    </footer>
  );
};

export default StatusBar;
