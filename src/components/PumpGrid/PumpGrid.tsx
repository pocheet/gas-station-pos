// src/components/PumpGrid/PumpGrid.tsx
import React from 'react';
import type { PumpValue, Configuration } from '../../api/types';
import PumpCard from './PumpCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { usePumpContext } from '../../context/PumpContext';
import './PumpGrid.css';

interface PumpGridProps {
  pumps: PumpValue[];
  config: Configuration;
  isLoading: boolean;
}

const PumpGrid: React.FC<PumpGridProps> = ({ pumps, config, isLoading }) => {
  const { selectedPump } = usePumpContext();

  if (isLoading && pumps.length === 0) {
    return (
      <div className="pump-grid-loading">
        <LoadingSpinner size="large" />
        <p>Загрузка состояния ТРК...</p>
      </div>
    );
  }

  // Сортируем pumps по номеру
  const sortedPumps = [...pumps].sort((a, b) => a.Number - b.Number);

  return (
    <div className="pump-grid-container">
      <div className="pump-grid-header">
        <h2>Топливо-раздаточные колонки</h2>
        <div className="pump-grid-stats">
          <span className="stat-badge">
            Всего: {pumps.length}
          </span>
          <span className="stat-badge active">
            Активно: {pumps.filter(p => p.EnableService).length}
          </span>
          <span className="stat-badge busy">
            В работе: {pumps.filter(p => p.Status === 5).length}
          </span>
        </div>
      </div>
      
      <div className="pump-grid">
        {sortedPumps.map((pump) => (
          <PumpCard
            key={pump.Number}
            pump={pump}
            config={config}
            isSelected={selectedPump === pump.Number}
          />
        ))}
      </div>
    </div>
  );
};

export default PumpGrid;
