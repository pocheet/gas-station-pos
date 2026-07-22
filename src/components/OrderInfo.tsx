// src/components/OrderInfo.tsx
import { type Order } from '../types/schemas';
import { CircularProgress } from '@mui/material';

interface OrderInfoProps {
  order: Order | null;
  onCreateOrder: () => void;
  onStartFueling: () => void;
  onStopFueling: () => void;
  onContinueFueling: () => void;
  onCompleteOrder: () => void;
  isStarting?: boolean;
  isStopping?: boolean;
  isContinuing?: boolean;
  isCompleting?: boolean;
  canStart?: boolean;
  canCreate?: boolean;
  isStopped?: boolean;
}

const formatAmount = (amount: number): string => isNaN(amount) ? '0,00' : amount.toFixed(2).replace('.', ',');

export default function OrderInfo({
  order,
  onCreateOrder,
  onStartFueling,
  onStopFueling,
  onContinueFueling,
  onCompleteOrder,
  isStarting = false,
  isStopping = false,
  isContinuing = false,
  isCompleting = false,
  canStart = false,
  canCreate = false,
  isStopped = false,
}: OrderInfoProps) {
  const status = order?.status || 'draft';
  const totalSum = order?.totalSum || 0;
  const totalDiscount = order?.totalDiscount || 0;
  const totalAmount = order?.totalAmount || 0;

  const isProcessing = isStarting || isStopping || isContinuing || isCompleting;

  return (
    <div className="mt-3 rounded-2xl overflow-hidden" style={{ backgroundColor: '#0f3460' }}>
      <div className="grid grid-cols-4 divide-x divide-[#2a2a45]">
        {/* Сумма */}
        <div className="p-4 flex flex-col">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-[#6c7293] mb-1">Сумма</span>
          <span className="text-xl font-mono font-bold text-[#ffd700]">{formatAmount(totalSum)}</span>
        </div>

        {/* Скидка */}
        <div className="p-4 flex flex-col">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-[#6c7293] mb-1">Скидка</span>
          <span className="text-xl font-mono font-bold text-[#ffa502]">{formatAmount(totalDiscount)}</span>
        </div>

        {/* Итого */}
        <div className="p-4 flex flex-col">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-[#6c7293] mb-1">Итого</span>
          <span className="text-xl font-mono font-bold text-[#00d4aa]">{formatAmount(totalAmount)}</span>
        </div>

        {/* Кнопки управления */}
        <div className="p-3 flex flex-col justify-center gap-2">
          {/* Черновик — Создать заказ */}
          {status === 'draft' && (
            <button onClick={onCreateOrder} disabled={!canCreate || isProcessing}
              className="w-full py-3 rounded-xl font-semibold text-sm bg-[#00d4aa] text-black hover:bg-[#00b894]
                      disabled:bg-[#16213e] disabled:text-gray-600 disabled:cursor-not-allowed transition-all duration-200">
              Создать заказ
            </button>
          )}

          {/* Создан — Запуск */}
          {status === 'created' && (
            <button onClick={onStartFueling} disabled={!canStart || isProcessing}
              className="w-full py-3 rounded-xl font-semibold text-sm bg-[#3b82f6] text-white hover:bg-[#2563eb]
                      disabled:bg-[#16213e] disabled:text-gray-600 disabled:cursor-not-allowed transition-all duration-200">
              {isStarting ? <span className="flex items-center justify-center gap-1"><CircularProgress size={16} color="inherit" /> Запуск...</span> : 'Запуск'}
            </button>
          )}

          {/* Налив идёт — Остановить */}
          {status === 'fueling' && !isStopped && (
            <button onClick={onStopFueling} disabled={isProcessing}
              className="w-full py-3 rounded-xl font-semibold text-sm bg-[#ffa502] text-black hover:bg-[#ffbe76]
                      disabled:bg-[#16213e] disabled:text-gray-600 disabled:cursor-not-allowed transition-all duration-200">
              {isStopping ? <span className="flex items-center justify-center gap-1"><CircularProgress size={16} color="inherit" /> Остановка...</span> : 'Остановить'}
            </button>
          )}

          {/* Остановлен — Продолжить + Завершить */}
          {status === 'fueling' && isStopped && (
            <>
              <button onClick={onContinueFueling} disabled={isProcessing}
                className="w-full py-2.5 rounded-xl font-semibold text-sm bg-[#00d4aa] text-black hover:bg-[#00b894]
                        disabled:bg-[#16213e] disabled:text-gray-600 disabled:cursor-not-allowed transition-all duration-200">
                {isContinuing ? <span className="flex items-center justify-center gap-1"><CircularProgress size={14} color="inherit" /> Продолжение...</span> : 'Продолжить'}
              </button>
              <button onClick={onCompleteOrder} disabled={isProcessing}
                className="w-full py-2.5 rounded-xl font-semibold text-sm bg-[#ff4757] text-white hover:bg-[#ff6b6b]
                        disabled:bg-[#16213e] disabled:text-gray-600 disabled:cursor-not-allowed transition-all duration-200">
                {isCompleting ? <span className="flex items-center justify-center gap-1"><CircularProgress size={14} color="inherit" /> Завершение...</span> : 'Завершить'}
              </button>
            </>
          )}

          {/* Завершён — Завершить */}
          {status === 'completed' && (
            <button onClick={onCompleteOrder} disabled={isProcessing}
              className="w-full py-3 rounded-xl font-semibold text-sm bg-[#ff4757] text-white hover:bg-[#ff6b6b]
                      disabled:bg-[#16213e] disabled:text-gray-600 disabled:cursor-not-allowed transition-all duration-200">
              {isCompleting ? <span className="flex items-center justify-center gap-1"><CircularProgress size={16} color="inherit" /> Завершение...</span> : 'Завершить'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
