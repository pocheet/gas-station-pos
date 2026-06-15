// src/components/ControlPanel/ControlPanel.tsx
import React from 'react';
import type { Configuration } from '../../api/types';
import type { EquipmentState } from '../../api/types';
import { usePumpContext } from '../../context/PumpContext';
import ProductSelector from './ProductSelector';
import PresetControls from './PresetControls';
import TransactionInfo from './TransactionInfo';
import './ControlPanel.css';

interface ControlPanelProps {
  config: Configuration;
  state?: EquipmentState;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ config, state }) => {
  const { selectedPump } = usePumpContext();

  const selectedPumpData = state?.PumpValuesCollection.find(
    p => p.Number === selectedPump
  );

  return (
    <div className="control-panel">
      {!selectedPump ? (
        <div className="no-selection">
          <div className="no-selection-content">
            <div className="placeholder-icon">⛽</div>
            <h2>Выберите ТРК</h2>
            <p>Нажмите на карточку топливо-раздаточной колонки для начала работы</p>
            <div className="instruction-steps">
              <div className="step">
                <span className="step-number">1</span>
                <span>Выберите колонку</span>
              </div>
              <div className="step">
                <span className="step-number">2</span>
                <span>Выберите тип топлива</span>
              </div>
              <div className="step">
                <span className="step-number">3</span>
                <span>Укажите объем или сумму</span>
              </div>
              <div className="step">
                <span className="step-number">4</span>
                <span>Начните налив</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="control-content">
          <div className="panel-header">
            <div className="panel-title">
              <h2>ТРК №{selectedPump}</h2>
              {selectedPumpData && (
                <span className={`status-indicator status-${selectedPumpData.Status}`}>
                  Статус: {selectedPumpData.Status}
                </span>
              )}
            </div>
            <button 
              className="close-btn"
              onClick={() => {/* reset selection */}}
            >
              ✕
            </button>
          </div>

          <ProductSelector 
            config={config} 
            state={state} 
          />
          
          <PresetControls />
          
          <button className="start-fueling-btn">
            <span className="btn-icon">⛽</span>
            Начать налив
          </button>

          <TransactionInfo state={state} />
        </div>
      )}
    </div>
  );
};

export default ControlPanel;
