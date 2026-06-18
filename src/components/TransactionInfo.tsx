// src/components/TransactionInfo.tsx
import { type PumpValue, PUMP_STATUS } from '../types/schemas';
import { Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useState } from 'react';

interface TransactionInfoProps {
  pump: PumpValue;
  pumpNumber: number;
  onReset: () => void;
  onEmergencyReset: () => void;
  onStop: () => void;
  isResetting: boolean;
  isStopping: boolean;
  canReset: boolean;
}

export default function TransactionInfo({
  pump,
  pumpNumber,
  onReset,
  onEmergencyReset,
  onStop,
  isResetting,
  isStopping,
  canReset,
}: TransactionInfoProps) {
  const [showStopConfirm, setShowStopConfirm] = useState(false);
  const [showEmergencyConfirm, setShowEmergencyConfirm] = useState(false);

  const transaction = pump.Transaction;
  const hasTransaction = transaction.TransactionId !== '00000000-0000-0000-0000-000000000000';
  
  if (!hasTransaction) return null;

  const isFueling = pump.Status === PUMP_STATUS.BUSY || pump.Status === PUMP_STATUS.BUSY_OVERFLOW;
  const progress = transaction.PresetVolume > 0 
    ? (transaction.RealTimeVolume / transaction.PresetVolume) * 100 
    : 0;

  const nozzle = pump.Nozzles.find(n => n.Number === transaction.NozzleNumber);
  const isProcessing = isResetting || isStopping;

  return (
    <div className="space-y-4">
      {/* Карточка транзакции */}
      <div className={`p-6 rounded-lg border-2 ${
        isFueling 
          ? 'bg-[#0f3460]/30 border-[#00d4aa]/50' 
          : canReset
            ? 'bg-[#1a1a2e] border-[#ffa502]/50'
            : 'bg-[#1a1a2e] border-[#ff4757]/30'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">
            {isFueling ? '⛽ Идет налив' : '🔄 Транзакция'}
          </h2>
          <span className="text-sm text-gray-400">
            ID: {transaction.TransactionId.substring(0, 8)}...
          </span>
        </div>

        {/* Прогресс бар */}
        {isFueling && transaction.PresetVolume > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Прогресс налива</span>
              <span className="text-[#00d4aa] font-semibold">{progress.toFixed(1)}%</span>
            </div>
            <div className="h-3 bg-[#0a0a14] rounded-full overflow-hidden relative">
              <div 
                className="h-full bg-gradient-to-r from-[#00d4aa] to-[#00b894] rounded-full transition-all duration-500 relative"
                style={{ width: `${Math.min(progress, 100)}%` }}
              >
                {/* Анимация потока */}
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
              onClick={() => setShowStopConfirm(true)}
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

          {/* Кнопки Завершить и Аварийный сброс */}
          {canReset && (
            <div className="flex gap-2">
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

              <Button
                onClick={() => setShowEmergencyConfirm(true)}
                disabled={isProcessing}
                variant="outlined"
                sx={{
                  borderColor: '#ff4757',
                  color: '#ff4757',
                  fontWeight: 'bold',
                  py: 1.5,
                  whiteSpace: 'nowrap',
                  '&:hover': { borderColor: '#ff6b6b', bgcolor: 'rgba(255,71,87,0.1)' },
                  '&:disabled': { borderColor: '#2a2a45', color: '#6c7293' }
                }}
              >
                🚨 Аварийный
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Информационная подсказка */}
      {isFueling && (
        <div className="p-4 bg-[#1a1a2e] rounded-lg border border-gray-700">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="text-gray-300 text-sm font-semibold mb-1">
                Налив выполняется
              </p>
              <p className="text-gray-500 text-xs">
                Вы можете остановить налив в любой момент кнопкой «Остановить». 
                После завершения налива и возврата пистолета на место, 
                нажмите «Завершить» для фиксации транзакции.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Диалог подтверждения остановки */}
      <Dialog
        open={showStopConfirm}
        onClose={() => setShowStopConfirm(false)}
        PaperProps={{
          sx: {
            bgcolor: '#1a1a2e',
            color: '#e8e8f0',
            borderRadius: '12px',
          }
        }}
      >
        <DialogTitle sx={{ color: '#ffa502', fontWeight: 'bold' }}>
          ⚠️ Подтверждение остановки
        </DialogTitle>
        <DialogContent>
          <p className="text-gray-300 mb-2">
            Вы действительно хотите остановить налив?
          </p>
          <p className="text-gray-500 text-sm">
            Текущий объем: <span className="text-[#00d4aa]">{transaction.RealTimeVolume.toFixed(2)} л</span>
            <br />
            Текущая сумма: <span className="text-[#ffd700]">{transaction.RealTimeAmount.toFixed(2)} ₽</span>
          </p>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={() => setShowStopConfirm(false)}
            disabled={isProcessing}
            sx={{ color: '#6c7293' }}
          >
            Отмена
          </Button>
          <Button
            onClick={() => {
              setShowStopConfirm(false);
              onStop();
            }}
            disabled={isProcessing}
            variant="contained"
            sx={{
              bgcolor: '#ffa502',
              color: '#000',
              fontWeight: 'bold',
              '&:hover': { bgcolor: '#ffbe76' },
            }}
          >
            Остановить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог подтверждения аварийного сброса */}
      <Dialog
        open={showEmergencyConfirm}
        onClose={() => setShowEmergencyConfirm(false)}
        PaperProps={{
          sx: {
            bgcolor: '#1a1a2e',
            color: '#e8e8f0',
            borderRadius: '12px',
          }
        }}
      >
        <DialogTitle sx={{ color: '#ff4757', fontWeight: 'bold' }}>
          🚨 Аварийный сброс
        </DialogTitle>
        <DialogContent>
          <p className="text-gray-300 mb-2">
            Вы уверены, что хотите выполнить аварийный сброс?
          </p>
          <p className="text-gray-500 text-sm">
            Это действие принудительно завершит транзакцию без сохранения результатов.
          </p>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={() => setShowEmergencyConfirm(false)}
            disabled={isProcessing}
            sx={{ color: '#6c7293' }}
          >
            Отмена
          </Button>
          <Button
            onClick={() => {
              setShowEmergencyConfirm(false);
              onEmergencyReset();
            }}
            disabled={isProcessing}
            variant="contained"
            sx={{
              bgcolor: '#ff4757',
              color: '#fff',
              fontWeight: 'bold',
              '&:hover': { bgcolor: '#ff6b6b' },
            }}
          >
            Аварийный сброс
          </Button>
        </DialogActions>
      </Dialog>

      {/* CSS для анимации shimmer */}
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
