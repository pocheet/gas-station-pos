// src/components/TransactionInfo.tsx
import { type PumpValue, PUMP_STATUS } from '../types/schemas';
import { Button, CircularProgress } from '@mui/material';

interface TransactionInfoProps {
  pump: PumpValue;
  pumpNumber: number;
  onReset: () => void;
  onEmergencyReset: () => void;
  isResetting: boolean;
  canReset: boolean;
}

export default function TransactionInfo({
  pump,
  pumpNumber,
  onReset,
  onEmergencyReset,
  isResetting,
  canReset,
}: TransactionInfoProps) {
  const transaction = pump.Transaction;
  const hasTransaction = transaction.TransactionId !== '00000000-0000-0000-0000-000000000000';
  
  if (!hasTransaction) return null;

  const isFueling = pump.Status === PUMP_STATUS.BUSY || pump.Status === PUMP_STATUS.BUSY_OVERFLOW;
  const progress = transaction.PresetVolume > 0 
    ? (transaction.RealTimeVolume / transaction.PresetVolume) * 100 
    : 0;

  const nozzle = pump.Nozzles.find(n => n.Number === transaction.NozzleNumber);

  return (
    <div className="space-y-4">
      {/* Карточка транзакции */}
      <div className={`p-6 rounded-lg border-2 ${
        isFueling 
          ? 'bg-[#0f3460]/30 border-[#00d4aa]/50' 
          : 'bg-[#1a1a2e] border-[#ffa502]/50'
      }`}>
        <h2 className="text-xl font-bold text-white mb-4">
          {isFueling ? '⛽ Идет налив' : '🔄 Транзакция завершена'}
        </h2>

        {/* Прогресс бар */}
        {isFueling && transaction.PresetVolume > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Прогресс</span>
              <span className="text-[#00d4aa]">{progress.toFixed(1)}%</span>
            </div>
            <div className="h-3 bg-[#0a0a14] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#00d4aa] to-[#00b894] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Основные показатели */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-[#0a0a14] rounded-lg p-3">
            <div className="text-gray-400 text-xs uppercase mb-1">Объем</div>
            <div className="text-[#00d4aa] text-2xl font-mono font-bold">
              {transaction.RealTimeVolume.toFixed(2)}
              <span className="text-sm ml-1">л</span>
            </div>
            {transaction.PresetVolume > 0 && (
              <div className="text-gray-500 text-xs mt-1">
                из {transaction.PresetVolume} л
              </div>
            )}
          </div>

          <div className="bg-[#0a0a14] rounded-lg p-3">
            <div className="text-gray-400 text-xs uppercase mb-1">Сумма</div>
            <div className="text-[#ffd700] text-2xl font-mono font-bold">
              {transaction.RealTimeAmount.toFixed(2)}
              <span className="text-sm ml-1">₽</span>
            </div>
            {transaction.PresetAmount > 0 && (
              <div className="text-gray-500 text-xs mt-1">
                из {transaction.PresetAmount} ₽
              </div>
            )}
          </div>

          <div className="bg-[#0a0a14] rounded-lg p-3">
            <div className="text-gray-400 text-xs uppercase mb-1">Цена</div>
            <div className="text-white text-xl font-mono">
              {transaction.PricePerUnit}
              <span className="text-sm ml-1">₽/л</span>
            </div>
          </div>

          <div className="bg-[#0a0a14] rounded-lg p-3">
            <div className="text-gray-400 text-xs uppercase mb-1">Топливо</div>
            <div className="text-white text-lg font-semibold">
              {nozzle?.ProductRef || '—'}
            </div>
            <div className="text-gray-500 text-xs mt-1">
              Пистолет №{transaction.NozzleNumber}
            </div>
          </div>
        </div>

        {/* Кнопки управления */}
        <div className="flex gap-3">
          {canReset && (
            <Button
              onClick={onReset}
              disabled={isResetting}
              variant="contained"
              fullWidth
              sx={{
                bgcolor: '#00d4aa',
                color: '#000',
                fontWeight: 'bold',
                py: 1.5,
                '&:hover': { bgcolor: '#00b894' },
                '&:disabled': { bgcolor: '#2a2a45', color: '#6c7293' }
              }}
            >
              {isResetting ? (
                <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
              ) : (
                '✅'
              )}
              <span className="ml-2">Завершить</span>
            </Button>
          )}

          {canReset && (
            <Button
              onClick={onEmergencyReset}
              disabled={isResetting}
              variant="outlined"
              fullWidth
              sx={{
                borderColor: '#ff4757',
                color: '#ff4757',
                fontWeight: 'bold',
                py: 1.5,
                '&:hover': { borderColor: '#ff6b6b', bgcolor: 'rgba(255,71,87,0.1)' },
                '&:disabled': { borderColor: '#2a2a45', color: '#6c7293' }
              }}
            >
              🚨 Аварийный сброс
            </Button>
          )}
        </div>
      </div>

      {/* Подсказка для идущего налива */}
      {isFueling && (
        <div className="p-4 bg-[#1a1a2e] rounded-lg border border-gray-700 text-center">
          <p className="text-gray-400 text-sm">
            Налив выполняется автоматически. Дождитесь завершения и повесьте пистолет.
          </p>
        </div>
      )}
    </div>
  );
}
