// src/components/PumpGrid/NozzleIndicator.tsx
import React from 'react';
import { type NozzleValue, PumpStatus } from '../../api/types';
import './NozzleIndicator.css';

interface NozzleIndicatorProps {
  nozzle: NozzleValue;
  isSelected: boolean;
  pumpStatus: PumpStatus;
}

const NozzleIndicator: React.FC<NozzleIndicatorProps> = ({ 
  nozzle, 
  isSelected, 
  pumpStatus 
}) => {
  const getProductColor = (productName: string): string => {
    const colorMap: Record<string, string> = {
      'АИ-92': '#4CAF50',
      'АИ-95': '#2196F3',
      'АИ-95+': '#9C27B0',
      'АИ-98': '#FF9800',
      'АИ-98+': '#F44336',
      'АИ-100+': '#E91E63',
      'Дизель': '#795548',
      'Дизель+': '#607D8B',
      'AdBlue': '#00BCD4',
    };
    return colorMap[productName] || '#6c7293';
  };

  const isFueling = pumpStatus === PumpStatus.Busy || pumpStatus === PumpStatus.BusyOverflow;

  return (
    <div 
      className={`
        nozzle-indicator 
        ${isSelected ? 'selected' : ''} 
        ${isFueling ? 'fueling' : ''}
      `}
      title={`Пистолет ${nozzle.Number}: ${nozzle.ProductRef} (${nozzle.DefaultPricePerUnit} ₽/л)`}
    >
      <div 
        className="nozzle-color"
        style={{ backgroundColor: getProductColor(nozzle.ProductRef) }}
      />
      <div className="nozzle-info">
        <span className="nozzle-number">№{nozzle.Number}</span>
        <span className="nozzle-product">{nozzle.ProductRef}</span>
      </div>
    </div>
  );
};

export default NozzleIndicator;
