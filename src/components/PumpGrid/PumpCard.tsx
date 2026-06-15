// src/components/PumpGrid/PumpCard.tsx
import React, { useMemo } from 'react';
import  { PumpStatus } from '../../api/types';
import type { PumpValue, Configuration } from '../../api/types';
import { getStatusInfo, isPumpBusy } from '../../utils/statusHelpers';
import { formatCurrency, formatVolume, formatProgress } from '../../utils/formatters';
import { usePumpContext } from '../../context/PumpContext';
import NozzleIndicator from './NozzleIndicator';
import './PumpCard.css';

interface PumpCardProps {
  pump: PumpValue;
  config: Configuration;
  isSelected: boolean;
}

const PumpCard: React.FC<PumpCardProps> = ({ pump, config, isSelected }) => {
  const { selectPump } = usePumpContext();
  const statusInfo = getStatusInfo(pump.Status);
  const isBusy = isPumpBusy(pump.Status);
  const transaction = pump.Transaction;
  const hasActiveTransaction = transaction.TransactionId !== '00000000-0000-0000-0000-000000000000';

  const progress = useMemo(() => {
    if (!hasActiveTransaction || !transaction.PresetVolume) return 0;
    return formatProgress(transaction.RealTimeVolume, transaction.PresetVolume);
  }, [transaction.RealTimeVolume, transaction.PresetVolume, hasActiveTransaction]);

  const isClickable = pump.EnableService && !isBusy;

  const pumpConfig = config.Pumps?.find(p => p.Number === pump.Number);

  return (
    <div 
      className={`
        pump-card 
        ${isSelected ? 'selected' : ''} 
        ${!pump.EnableService ? 'disabled' : ''}
        ${isBusy ? 'busy' : ''}
        ${pump.Status === PumpStatus.Error ? 'error' : ''}
      `}
      onClick={() => isClickable && selectPump(pump.Number)}
    >
      <div className="pump-card-header">
        <div className="pump-number">
          <span className="pump-label">ТРК</span>
          <span className="pump-value">№{pump.Number}</span>
        </div>
        <div className={`status-badge ${isBusy ? 'busy' : ''}`}
             style={{
               backgroundColor: statusInfo.bgColor,
               color: statusInfo.color,
             }}>
          <span className="status-icon">{statusInfo.icon}</span>
          <span className="status-text">{statusInfo.text}</span>
        </div>
      </div>

      {isBusy && hasActiveTransaction && (
        <div className="fueling-progress">
          <div className="progress-header">
            <span className="progress-label">Выполняется налив</span>
            <span className="progress-percentage">{progress.toFixed(1)}%</span>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="fueling-details">
            <div className="detail-row">
              <span className="detail-label">Объем:</span>
              <span className="detail-value volume">
                {formatVolume(transaction.RealTimeVolume)}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Сумма:</span>
              <span className="detail-value amount">
                {formatCurrency(transaction.RealTimeAmount)}
              </span>
            </div>
          </div>
          <div className="flow-indicator">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flow-dot" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </div>
      )}

      {!isBusy && hasActiveTransaction && (
        <div className="last-transaction">
          <div className="transaction-summary">
            <span className="transaction-label">Последняя транзакция:</span>
            <span className="transaction-value">
              {formatVolume(transaction.PresetVolume)} / {formatCurrency(transaction.PresetAmount)}
            </span>
          </div>
        </div>
      )}

      {pumpConfig && (
        <div className="nozzle-indicators">
          {pump.Nozzles.map((nozzle) => (
            <NozzleIndicator
              key={nozzle.Number}
              nozzle={nozzle}
              isSelected={pump.SelectedNozzle === nozzle.Number}
              pumpStatus={pump.Status}
            />
          ))}
        </div>
      )}

      {pump.PollException && (
        <div className="poll-exception">
          ⚠️ {pump.PollException}
        </div>
      )}

      {!pump.EnableService && (
        <div className="disabled-overlay">
          <span>🔒 Сервис отключен</span>
        </div>
      )}
    </div>
  );
};

export default React.memo(PumpCard);
