// src/components/Layout/Header.tsx
import React, { useState, useEffect } from 'react';
import './Header.css';

const Header: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="header">
      <div className="header-left">
        <div className="header-logo">⛽</div>
        <div>
          <h1>АЗС Терминал</h1>
          <p className="header-subtitle">Система управления наливом топлива</p>
        </div>
      </div>
      
      <div className="header-center">
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-icon">🟢</span>
            <span className="stat-label">Активных ТРК:</span>
            <span className="stat-value">6</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">⛽</span>
            <span className="stat-label">В работе:</span>
            <span className="stat-value">2</span>
          </div>
        </div>
      </div>

      <div className="header-right">
        <div className="header-time">
          <span className="time-icon">🕐</span>
          <span className="time-value">
            {currentTime.toLocaleTimeString('ru-RU', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </span>
        </div>
        <div className="header-date">
          {currentTime.toLocaleDateString('ru-RU', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>
    </header>
  );
};

export default Header;
