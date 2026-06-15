// src/components/ControlPanel/PresetControls.tsx
import React from 'react';
import { usePumpContext } from '../../context/PumpContext';
import './PresetControls.css';

const PresetControls: React.FC = () => {
  const { 
    presetMode, 
    presetValue, 
    setPresetMode, 
    setPresetValue,
    selectedPump,
    selectedNozzle 
  } = usePumpContext();

  if (!selectedPump || !selectedNozzle) return null;

  const quickValues = presetMode === 'volume' 
    ? [10, 20, 30, 50, 100] 
    : [500, 1000, 1500, 2000, 3000];

  return (
    <div className="preset-controls">
      <div className="preset-mode">
        <button 
          className={`mode-btn ${presetMode === 'volume' ? 'active' : ''}`}
          onClick={() => setPresetMode('volume')}
        >
          <span className="mode-icon">🪣</span>
          Литры
        </button>
        <button 
          className={`mode-btn ${presetMode === 'amount' ? 'active' : ''}`}
          onClick={() => setPresetMode('amount')}
        >
          <span className="mode-icon">💰</span>
          Сумма
        </button>
      </div>

      <div className="preset-input-group">
        <div className="input-wrapper">
          <input
            type="number"
            value={presetValue}
            onChange={(e) => setPresetValue(e.target.value)}
            placeholder={presetMode === 'volume' ? 'Объем (л)' : 'Сумма (₽)'}
            className="preset-input"
            min="0"
            step={presetMode === 'volume' ? '1' : '10'}
          />
          <span className="input-unit">
            {presetMode === 'volume' ? 'л' : '₽'}
          </span>
        </div>
      </div>

      <div className="quick-values">
        {quickValues.map((value) => (
          <button
            key={value}
            className={`quick-btn ${presetValue === value.toString() ? 'active' : ''}`}
            onClick={() => setPresetValue(value.toString())}
          >
            {value}{presetMode === 'volume' ? 'л' : '₽'}
          </button>
        ))}
      </div>

      {presetValue && (
        <div className="preset-summary">
          {presetMode === 'volume' ? (
            <p>Будет налито: <strong>{presetValue} литров</strong></p>
          ) : (
            <p>На сумму: <strong>{presetValue} ₽</strong></p>
          )}
        </div>
      )}
    </div>
  );
};

export default PresetControls;
