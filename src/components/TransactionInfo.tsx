// src/components/TransactionInfo.tsx
import { type PumpValue, PUMP_STATUS } from '../types/schemas';
import { CircularProgress } from '@mui/material';

interface TransactionInfoProps {
  pump?: PumpValue;
  pumpNumber: number;
  selectedNozzle: number | null;
  onStop: () => void;
  onContinue: () => void;
  onReset: () => void;
  isStopping: boolean;
  isContinuing: boolean;
  isResetting: boolean;
  onStart?: () => void;
  isStarting?: boolean;
  canStart?: boolean;
  presetMode?: 'volume' | 'amount';
  presetValue?: string;
  pricePerUnit?: number;
  discountPercent?: number | null;
}

export default function TransactionInfo({
  pump,
  pumpNumber,
  selectedNozzle,
  onStop,
  onContinue,
  onReset,
  isStopping,
  isContinuing,
  isResetting,
  onStart,
  isStarting = false,
  canStart = false,
  presetMode = 'volume',
  presetValue = '0',
  pricePerUnit = 0,
  discountPercent = null,
}: TransactionInfoProps) {
  const status = pump?.Status ?? PUMP_STATUS.OFF;
  const transaction = pump?.Transaction;
  const isActiveTransaction = transaction && transaction.TransactionId !== '00000000-0000-0000-0000-000000000000';

  const isPumpReady = status === PUMP_STATUS.OFF || status === PUMP_STATUS.PRESET;
  const isFueling = status === PUMP_STATUS.BUSY || status === PUMP_STATUS.BUSY_OVERFLOW;
  const isStopped = status === PUMP_STATUS.WAIT_OFF_REMAINDER;
  const canReset = status === PUMP_STATUS.WAIT_OFF_REMAINDER || 
                   status === PUMP_STATUS.WAIT_OFF_OVERFLOW || 
                   status === PUMP_STATUS.WAIT_RESET;
  const isProcessing = isResetting || isStopping || isContinuing || isStarting;

  const nozzle = selectedNozzle 
    ? pump?.Nozzles.find(n => n.Number === selectedNozzle)
    : isActiveTransaction
      ? pump?.Nozzles.find(n => n.Number === transaction.NozzleNumber)
      : null;

  const getStatusText = () => {
    switch (status) {
      case PUMP_STATUS.OFF: return 'Свободна';
      case PUMP_STATUS.PRESET: return 'Установлена доза';
      case PUMP_STATUS.BUSY: return 'Идет отпуск';
      case PUMP_STATUS.BUSY_OVERFLOW: return 'Перелив';
      case PUMP_STATUS.WAIT_RESET: return 'Ожидает сброса';
      case PUMP_STATUS.WAIT_OFF_REMAINDER: return 'Остаток';
      case PUMP_STATUS.WAIT_OFF: return 'Повесьте пистолет';
      default: return 'Обработка';
    }
  };

  const getStatusColor = () => {
    if (isFueling) return '#3b82f6';
    if (isStopped || canReset) return '#ffa502';
    return '#4ade80';
  };

  const formatAmount = (n: number) => isNaN(n) ? '0,00' : n.toFixed(2).replace('.', ',');
  const formatVolume = (n: number) => isNaN(n) ? '0,00' : n.toFixed(2).replace('.', ',');

  // Расчетные значения
  const displayValue = parseFloat(presetValue) || 0;
  const calculatedAmount = presetMode === 'volume' 
    ? displayValue * pricePerUnit 
    : displayValue;
  const calculatedVolume = presetMode === 'amount' && pricePerUnit > 0
    ? displayValue / pricePerUnit 
    : displayValue;

  // Значения для отображения
  const showVolume = isActiveTransaction && (isFueling || isStopped || canReset)
    ? transaction.RealTimeVolume
    : calculatedVolume;
  const showAmount = isActiveTransaction && (isFueling || isStopped || canReset)
    ? transaction.RealTimeAmount
    : calculatedAmount;

  // Прогресс
  const progress = isActiveTransaction && transaction.PresetVolume > 0 
    ? (transaction.RealTimeVolume / transaction.PresetVolume) * 100 
    : 0;
  const showProgress = isFueling || isStopped || isActiveTransaction;

  const btnBase = `
    flex-1 py-3 rounded-2xl font-semibold text-sm
    transition-all duration-200
    flex items-center justify-center gap-1
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  return (
    <div className="mb-6 rounded-2xl overflow-hidden" style={{ backgroundColor: '#0f3460' }}>
      <div className="p-4">
        {/* Заголовок и статус */}
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold text-white">
            ТРК №{pumpNumber}
          </h1>
          <span 
            className="text-xs px-2 py-1 rounded-lg font-medium"
            style={{ backgroundColor: `${getStatusColor()}20`, color: getStatusColor() }}
          >
            {getStatusText()}
          </span>
        </div>

        {/* Выбранный пистолет */}
        {nozzle && (
          <div className="flex items-center gap-2 mb-3 px-2 py-1.5 rounded-xl bg-[#0a0a14]/50">
            <span 
              className="inline-flex items-center justify-center rounded-lg px-2 py-0.5 font-bold text-sm"
              style={{ backgroundColor: '#16213e', color: '#00d4aa' }}
            >
              {nozzle.Number}
            </span>
            <span className="text-sm text-[#d1d5db] font-medium">
              {nozzle.ProductRef}
            </span>
            {discountPercent && (
              <span className="text-xs text-[#ffa502] font-medium ml-auto">
                –{discountPercent}%
              </span>
            )}
          </div>
        )}

        {/* Показатели */}
        {nozzle && (
          <>
            {/* Прогресс бар — всегда, но разного цвета */}
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Прогресс</span>
                <span className="font-semibold" style={{ 
                  color: showProgress && progress > 0 ? getStatusColor() : '#4b5563' 
                }}>
                  {showProgress ? `${progress.toFixed(1)}%` : '—'}
                </span>
              </div>
              <div className="h-2 bg-[#0a0a14] rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${Math.min(progress, 100)}%`,
                    backgroundColor: progress > 0 ? getStatusColor() : '#4b5563',
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-[#0a0a14] rounded-xl p-2">
                <div className="text-gray-400 text-[10px] uppercase mb-0.5">
                  {presetMode === 'amount' && !isActiveTransaction ? '≈ Объем' : 'Объем'}
                </div>
                <div className="text-xl font-mono font-bold text-[#00d4aa]">
                  {formatVolume(showVolume)}
                  <span className="text-xs ml-1">л</span>
                </div>
              </div>
              <div className="bg-[#0a0a14] rounded-xl p-2">
                <div className="text-gray-400 text-[10px] uppercase mb-0.5">
                  {presetMode === 'volume' && !isActiveTransaction ? '≈ Сумма' : 'Сумма'}
                </div>
                <div className="text-xl font-mono font-bold text-[#ffd700]">
                  {formatAmount(showAmount)}
                  <span className="text-xs ml-1">₽</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Три кнопки */}
        <div className="flex gap-2">
          {isStopped ? (
            <button onClick={onContinue} disabled={isProcessing}
              className={`${btnBase} bg-[#00d4aa] text-black hover:bg-[#00b894]`}>
              {isContinuing ? <CircularProgress size={16} color="inherit" /> : null}
              Продолжить
            </button>
          ) : (
            <button onClick={onStart}
              disabled={!canStart || !isPumpReady || isProcessing}
              className={`${btnBase} ${
                isPumpReady && canStart
                  ? 'bg-[#00d4aa] text-black hover:bg-[#00b894]'
                  : 'bg-[#16213e] text-gray-600'
              }`}>
              {isStarting ? <CircularProgress size={16} color="inherit" /> : null}
              Запуск
            </button>
          )}

          <button onClick={onStop} disabled={!isFueling || isProcessing}
            className={`${btnBase} ${
              isFueling ? 'bg-[#ffa502] text-black hover:bg-[#ffbe76]' : 'bg-[#16213e] text-gray-600'
            }`}>
            {isStopping ? <CircularProgress size={16} color="inherit" /> : null}
            Остановить
          </button>

          <button onClick={onReset} disabled={!canReset || isProcessing}
            className={`${btnBase} ${
              canReset ? 'bg-[#00d4aa] text-black hover:bg-[#00b894]' : 'bg-[#16213e] text-gray-600'
            }`}>
            {isResetting ? <CircularProgress size={16} color="inherit" /> : null}
            Завершить
          </button>
        </div>
      </div>
    </div>
  );
}
