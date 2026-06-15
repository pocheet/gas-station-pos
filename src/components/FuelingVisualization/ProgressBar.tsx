// src/components/FuelingVisualization/ProgressBar.tsx
import React from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  current: number;
  total: number;
  label: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, label }) => {
  const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0;
  
  const getProgressColor = () => {
    if (percentage >= 90) return '#ffa502';
    if (percentage >= 70) return '#ffd700';
    return '#00d4aa';
  };

  return (
    <div className="progress-bar-container">
      <div className="progress-header">
        <span className="progress-label">{label}</span>
        <span className="progress-percentage">{percentage.toFixed(1)}%</span>
      </div>
      <div className="progress-track">
        <div 
          className="progress-fill"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: getProgressColor()
          }}
        />
        <div className="progress-glow" />
      </div>
      <div className="progress-values">
        <span>{current.toFixed(2)}</span>
        <span>{total} л</span>
      </div>
    </div>
  );
};

export default ProgressBar;
