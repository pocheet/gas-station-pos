// src/components/TransactionInfo.tsx
import { type PumpValue, PUMP_STATUS } from '../types/schemas';
import { Button, CircularProgress } from '@mui/material';

interface TransactionInfoProps {
  pump: PumpValue;
  pumpNumber: number;
  onReset: () => void;
  onStop: () => void;
  onContinue: () => void;
  isResetting: boolean;
  isStopping: boolean;
  isContinuing: boolean;
  canReset: boolean;
  canContinue: boolean;
}

export default function TransactionInfo({
  pump,
  onReset,
  onStop,
  onContinue,
  isResetting,
  isStopping,
  isContinuing,
  canReset,
  canContinue,
}: TransactionInfoProps) {
  const transaction = pump.Transaction;
  const hasTransaction = transaction.TransactionId !== '00000000-0000-0000-0000-000000000000';
  
  if (!hasTransaction) return null;

  const isFueling = pump.Status === PUMP_STATUS.BUSY || pump.Status === PUMP_STATUS.BUSY_OVERFLOW;
  const isStopped = pump.Status === PUMP_STATUS.WAIT_OFF_REMAINDER;
  const progress = transaction.PresetVolume > 0 
    ? (transaction.RealTimeVolume / transaction.PresetVolume) * 100 
    : 0;

  const nozzle = pump.Nozzles.find(n => n.Number === transaction.NozzleNumber);
  const isProcessing = isResetting || isStopping || isContinuing;

  return (
    <div className="space-y-4">
      {/* Карточка транзакции */}
      <div className={`p-6 rounded-lg border-2 ${
        isFueling 
          ? 'bg-[#0f3460]/30 border-[#00d4aa]/50' 
          : isStopped
            ? 'bg-[#1a1a2e] border-[#ffa502]/50'
            : canReset
              ? 'bg-[#1a1a2e] border-[#ffa502]/50'
              : 'bg-[#1a1a2e] border-[#ff4757]/30'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">
            {isFueling && '⛽ Идет налив'}
            {isStopped && '⏸️ Налив остановлен'}
            {canReset && !isStopped && '✅ Налив завершен'}
          </h2>
          <span className="text-sm text-gray-400">
            ID: {transaction.TransactionId.substring(0, 8)}...
          </span>
        </div>

        {/* Прогресс бар */}
        {transaction.PresetVolume > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Прогресс налива</span>
              <span className={`font-semibold ${isStopped ? 'text-[#ffa502]' : 'text-[#00d4aa]'}`}>
                {progress.toFixed(1)}%
              </span>
            </div>
            <div className="h-3 bg-[#0a0a14] rounded-full overflow-hidden relative">
              <div 
                className={`h-full rounded-full transition-all duration-500 relative ${
                  isStopped 
                    ? 'bg-gradient-to-r from-[#ffa502] to-[#ff6348]' 
                    : 'bg-gradient-to-r from-[#00d4aa] to-[#00b894]'
                }`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              >
                {isFueling && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                )}
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0 л</span>
              <span>{transaction.PresetVolume} л</span>
            </div>
          </div>
        )}

        {/* Flow индикатор при наливе */}
        {isFueling && (
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-[#00d4aa] animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        )}

        {/* Основные показатели */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-[#0a0a14] rounded-lg p-3">
            <div className="text-gray-400 text-xs uppercase mb-1">Объем</div>
            <div className={`text-2xl font-mono font-bold ${isStopped ? 'text-[#ffa502]' : 'text-[#00d4aa]'}`}>
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
                из {transaction.PresetAmount.toFixed(2)} ₽
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
        <div className="space-y-2">
          {/* Кнопка Стоп - только во время налива */}
          {isFueling && (
            <Button
              onClick={onStop}
              disabled={isProcessing}
              variant="contained"
              fullWidth
              sx={{
                bgcolor: '#ffa502',
                color: '#000',
                fontWeight: 'bold',
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': { bgcolor: '#ffbe76' },
                '&:disabled': { bgcolor: '#2a2a45', color: '#6c7293' }
              }}
            >
              {isStopping ? (
                <>
                  <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                  <span>Остановка...</span>
                </>
              ) : (
                <>
                  <span className="mr-2 text-xl">🛑</span>
                  Остановить налив
                </>
              )}
            </Button>
          )}

          {/* Кнопки Продолжить и Завершить - после остановки */}
          {isStopped && (
            <div className="flex gap-2">
              <Button
                onClick={onContinue}
                disabled={isProcessing}
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
                {isContinuing ? (
                  <>
                    <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                    <span>Продолжение...</span>
                  </>
                ) : (
                  <>
                    <span className="mr-2">▶️</span>
                    Продолжить
                  </>
                )}
              </Button>

              <Button
                onClick={onReset}
                disabled={isProcessing}
                variant="outlined"
                fullWidth
                sx={{
                  borderColor: '#ffa502',
                  color: '#ffa502',
                  fontWeight: 'bold',
                  py: 1.5,
                  '&:hover': { borderColor: '#ffbe76', bgcolor: 'rgba(255,165,2,0.1)' },
                  '&:disabled': { borderColor: '#2a2a45', color: '#6c7293' }
                }}
              >
                {isResetting ? (
                  <>
                    <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                    <span>Сброс...</span>
                  </>
                ) : (
                  <>
                    <span className="mr-2">✅</span>
                    Завершить
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Кнопка Завершить - после обычного завершения налива */}
          {canReset && !isStopped && (
            <Button
              onClick={onReset}
              disabled={isProcessing}
              variant="contained"
              fullWidth
              sx={{
                bgcolor: '#00d4aa',
                color: '#000',
                fontWeight: 'bold',
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': { bgcolor: '#00b894' },
                '&:disabled': { bgcolor: '#2a2a45', color: '#6c7293' }
              }}
            >
              {isResetting ? (
                <>
                  <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                  <span>Сброс...</span>
                </>
              ) : (
                <>
                  <span className="mr-2">✅</span>
                  Завершить
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Информационные подсказки */}
      {isFueling && (
        <div className="p-4 bg-[#1a1a2e] rounded-lg border border-gray-700">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="text-gray-300 text-sm font-semibold mb-1">
                Налив выполняется
              </p>
              <p className="text-gray-500 text-xs">
                Нажмите «Остановить» чтобы приостановить налив. 
                После остановки можно продолжить или завершить транзакцию.
              </p>
            </div>
          </div>
        </div>
      )}

      {isStopped && (
        <div className="p-4 bg-[#1a1a2e] rounded-lg border border-[#ffa502]/50">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⏸️</span>
            <div>
              <p className="text-[#ffa502] text-sm font-semibold mb-1">
                Налив остановлен
              </p>
              <p className="text-gray-500 text-xs">
                Вы можете продолжить налив или завершить транзакцию.
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
