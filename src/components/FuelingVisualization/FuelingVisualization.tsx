// src/components/FuelingVisualization/FuelingVisualization.tsx
import React, { useEffect, useState } from 'react';
import { EquipmentState } from '../../api/types';
import { usePumpContext } from '../../context/PumpContext';
import CounterAnimation from './CounterAnimation';
import ProgressBar from './ProgressBar';
import './FuelingVisualization.css';

interface FuelingVisualizationProps {
  state?: EquipmentState;
}

const FuelingVisualization: React.FC<FuelingVisualizationProps> = ({ state }) => {
  const { selectedPump } = usePumpContext();
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'fueling' | 'complete'>('idle');

  const pumpData = state?.PumpValuesCollection.find(p => p.Number === selectedPump);
  const transaction = pumpData?.Transaction;
  const isFueling = pumpData?.Status === 5;

  useEffect(() => {
    if (isFueling) {
      setAnimationPhase('fueling');
    } else if (pumpData?.Status === 8 || pumpData?.Status === 10) {
      setAnimationPhase('complete');
    } else {
      setAnimationPhase('idle');
    }
  }, [pumpData?.Status, isFueling]);

  if (!selectedPump || !transaction || !isFueling) return null;

  const progress = transaction.PresetVolume > 0 
    ? (transaction.RealTimeVolume / transaction.PresetVolume) * 100 
    : 0;

  return (
    <div className={`fueling-visualization ${animationPhase}`}>
      <div className="visualization-header">
        <h3>Процесс налива</h3>
        <span className="pump-badge">ТРК №{selectedPump}</span>
      </div>

      <div className="nozzle-animation">
        <svg viewBox="0 0 200 300" className="nozzle-svg">
          {/* Бак автомобиля */}
          <rect x="60" y="200" width="80" height="60" rx="10" fill="#1e1e32" stroke="#2a2a45" strokeWidth="2" />
          <rect x="70" y="210" width="60" height="40" rx="5" fill="#12121f" />
          
          {/* Горловина бака */}
          <rect x="90" y="185" width="20" height="20" rx="3" fill="#2a2a45" />
          <circle cx="100" cy="195" r="8" fill="#12121f" stroke="#3d3d6b" strokeWidth="2" />
          
          {/* Пистолет */}
          <g transform="translate(85, 130) rotate(-15)">
            <rect x="0" y="0" width="30" height="15" rx="3" fill="#4a4a6a" />
            <rect x="5" y="15" width="20" height="30" rx="2" fill="#3d3d5c" />
            <rect x="8" y="45" width="14" height="20" rx="2" fill="#2d2d3d" />
            {/* Наконечник пистолета */}
            <rect x="10" y="65" width="10" height="15" rx="1" fill="#1e1e32" />
          </g>

          {/* Поток топлива */}
          {animationPhase === 'fueling' && (
            <>
              <line x1="100" y1="200" x2="100" y2="230" stroke="#00d4aa" strokeWidth="4" opacity="0.8">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="0.5s" repeatCount="indefinite" />
              </line>
              
              {/* Капли */}
              <circle cx="100" cy="235" r="3" fill="#00d4aa" opacity="0.6">
                <animate attributeName="cy" values="230;250" dur="1s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0" dur="1s" repeatCount="indefinite" />
              </circle>
              <circle cx="100" cy="245" r="2" fill="#00d4aa" opacity="0.4">
                <animate attributeName="cy" values="235;255" dur="0.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0" dur="0.8s" repeatCount="indefinite" />
              </circle>
              
              {/* Волны топлива в баке */}
              <path d="M75 240 Q85 235 95 240 Q105 245 115 240" 
                    fill="none" stroke="#00d4aa" strokeWidth="2" opacity="0.3">
                <animate attributeName="d" 
                         values="M75 240 Q85 235 95 240 Q105 245 115 240;
                                M75 240 Q85 245 95 240 Q105 235 115 240;
                                M75 240 Q85 235 95 240 Q105 245 115 240" 
                         dur="2s" repeatCount="indefinite" />
              </path>
            </>
          )}
        </svg>
      </div>

      <div className="fueling-metrics">
        <CounterAnimation 
          label="ОБЪЕМ"
          value={transaction.RealTimeVolume}
          unit="л"
          color="#00d4aa"
        />
        <CounterAnimation 
          label="СУММА"
          value={transaction.RealTimeAmount}
          unit="₽"
          color="#ffd700"
        />
      </div>

      <ProgressBar 
        current={transaction.RealTimeVolume}
        total={transaction.PresetVolume}
        label="Прогресс налива"
      />

      <div className="fueling-speed">
        <span className="speed-label">Скорость потока:</span>
        <span className="speed-value">~2.5 л/с</span>
      </div>
    </div>
  );
};

export default FuelingVisualization;
