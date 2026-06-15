// src/components/ControlPanel/TransactionInfo.tsx
import React, { useEffect, useState } from 'react';
import type { EquipmentState } from '../../api/types';
import { usePumpContext } from '../../context/PumpContext';
import { formatCurrency, formatVolume, formatDateTime } from '../../utils/formatters';
import './TransactionInfo.css';

interface TransactionInfoProps {
  state?: EquipmentState;
}

const TransactionInfo: React.FC<TransactionInfoProps> = ({ state }) => {
  const { selectedPump } = usePumpContext();
  const [animatedVolume, setAnimatedVolume] = useState(0);
  const [animatedAmount, setAnimatedAmount] = useState(0);

  const pumpData = state?.PumpValuesCollection.find(p => p.Number === selectedPump);
  const transaction = pumpData?.Transaction;
  
  const isActiveTransaction = transaction && 
    transaction.TransactionId !== '00000000-0000-0000-0000-000000000000';

  useEffect(() => {
    if (transaction && pumpData?.Status === 5) {
      // Анимируем значения при активном наливе
      const duration = 300;
      const steps = 10;
      let step = 0;
      
      const interval = setInterval(() => {
        if (step < steps) {
          setAnimatedVolume(prev => 
            prev + (transaction.RealTimeVolume - prev) / (steps - step)
          );
          setAnimatedAmount(prev => 
            prev + (transaction.RealTimeAmount - prev) / (steps - step)
          );
          step++;
        } else {
          clearInterval(interval);
          setAnimatedVolume(transaction.RealTimeVolume);
          setAnimatedAmount(transaction.RealTimeAmount);
        }
      }, duration / steps);

      return () => clearInterval(interval);
    } else {
      setAnimatedVolume(transaction?.RealTimeVolume || 0);
      setAnimatedAmount(transaction?.RealTimeAmount || 0);
    }
  }, [transaction?.RealTimeVolume, transaction?.RealTimeAmount, pumpData?.Status]);

  if (!isActiveTransaction) {
    return (
      <div className="transaction-info empty">
        <div className="empty-state">
          <span className="empty-icon">📋</span>
          <p>Нет активной транзакции</p>
        </div>
      </div>
    );
  }

  const progress = transaction.PresetVolume > 0 
    ? (animatedVolume / transaction.PresetVolume) * 100 
    : 0;

  return (
    <div className="transaction-info">
      <h3>Текущая транзакция</h3>
      
      <div className="transaction-progress">
        <div className="progress-bar-large">
          <div 
            className="progress-fill-large"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <div className="progress-details">
          <span>{animatedVolume.toFixed(2)} л</span>
          <span>{transaction.PresetVolume} л</span>
        </div>
      </div>

      <div className="transaction-grid">
        <div className="tx-item volume">
          <span className="tx-label">Объем</span>
          <span className="tx-value">{formatVolume(animatedVolume)}</span>
        </div>
        <div className="tx-item amount">
          <span className="tx-label">Сумма</span>
          <span className="tx-value">{formatCurrency(animatedAmount)}</span>
        </div>
        <div className="tx-item price">
          <span className="tx-label">Цена за литр</span>
          <span className="tx-value">{transaction.PricePerUnit} ₽</span>
        </div>
        <div className="tx-item preset">
          <span className="tx-label">Задано</span>
          <span className="tx-value">
            {transaction.IsAmountPreset 
              ? formatCurrency(transaction.PresetAmount)
              : formatVolume(transaction.PresetVolume)
            }
          </span>
        </div>
      </div>

      <div className="transaction-timestamps">
        <div className="timestamp">
          <span className="ts-label">Начало:</span>
          <span className="ts-value">{formatDateTime(transaction.PresetTimeStamp)}</span>
        </div>
        {transaction.DoneTimeStamp && !transaction.DoneTimeStamp.startsWith('0001') && (
          <div className="timestamp">
            <span className="ts-label">Завершение:</span>
            <span className="ts-value">{formatDateTime(transaction.DoneTimeStamp)}</span>
          </div>
        )}
      </div>

      {progress >= 90 && (
        <div className="near-completion">
          <span className="warning-icon">⚠️</span>
          Налив почти завершен
        </div>
      )}
    </div>
  );
};

export default TransactionInfo;
