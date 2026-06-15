// src/components/common/LoadingSpinner.tsx
import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  color = '#00d4aa' 
}) => {
  const sizeMap = {
    small: 24,
    medium: 48,
    large: 72,
  };

  return (
    <div className="loading-spinner-container">
      <svg
        width={sizeMap[size]}
        height={sizeMap[size]}
        viewBox="0 0 50 50"
        className="loading-spinner"
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="31.415, 31.415"
          className="spinner-circle"
        />
      </svg>
      <style>{`
        .spinner-circle {
          animation: spinner-dash 1.5s ease-in-out infinite,
                     spinner-rotate 2s linear infinite;
          transform-origin: center;
        }
        
        @keyframes spinner-rotate {
          100% { transform: rotate(360deg); }
        }
        
        @keyframes spinner-dash {
          0% { stroke-dashoffset: 31.415; }
          50% { stroke-dashoffset: 78.5375; transform: rotate(45deg); }
          100% { stroke-dashoffset: 31.415; transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
