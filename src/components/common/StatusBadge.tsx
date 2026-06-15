// src/components/common/StatusBadge.tsx
import React from 'react';
import { PumpStatus } from '../../api/types';
import { getStatusInfo } from '../../utils/statusHelpers';
import './StatusBadge.css';

interface StatusBadgeProps {
  status: PumpStatus;
  size?: 'small' | 'medium' | 'large';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'medium' }) => {
  const statusInfo = getStatusInfo(status);

  return (
    <div 
      className={`status-badge status-badge-${size}`}
      style={{
        backgroundColor: statusInfo.bgColor,
        color: statusInfo.color,
        border: `1px solid ${statusInfo.color}20`,
      }}
    >
      <span className="status-badge-icon">{statusInfo.icon}</span>
      <span className="status-badge-text">{statusInfo.text}</span>
    </div>
  );
};

export default StatusBadge;
