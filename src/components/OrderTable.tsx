// src/components/OrderTable.tsx
import { type OrderItem } from '../types/schemas';

interface OrderTableProps {
  orders: OrderItem[];
  onRemoveOrder: (id: string) => void;
  selectedPump?: number | null;
}

const formatAmount = (amount: number): string => amount.toFixed(2).replace('.', ',');
const formatVolume = (volume: number): string => volume.toFixed(2).replace('.', ',');

// Создаём 3 строки, заполненные данными или пустые
const ROWS_COUNT = 3;

export default function OrderTable({ orders, onRemoveOrder, selectedPump }: OrderTableProps) {
  // Дополняем массив до 3 строк
  const rows: (OrderItem | null)[] = Array.from({ length: ROWS_COUNT }, (_, i) => orders[i] || null);

  return (
    <div className="mb-6">

      {/* Заголовок */}
      <div 
        className="grid gap-2 px-3 py-2 rounded-t-xl text-[10px] uppercase tracking-wider font-semibold"
        style={{ 
          gridTemplateColumns: '30px 80px 40px 75px 40px 70px 50px 80px 30px',
          backgroundColor: '#0f3460',
          color: '#6c7293',
        }}
      >
        <span className="text-center">№</span>
        <span>Товар</span>
        <span className="text-center">ТРК</span>
        <span className="text-right">Литры</span>
        <span className="text-center">Пист.</span>
        <span className="text-right">Цена</span>
        <span className="text-center">Скидка</span>
        <span className="text-right">Итого</span>
        <span></span>
      </div>

      {/* Строки */}
      <div className="rounded-b-xl overflow-hidden" style={{ backgroundColor: '#1a1a2e' }}>
        {rows.map((order, index) => {
          const isEmpty = !order;
          const isActive = order && selectedPump === order.pumpNumber;

          return (
            <div
              key={order?.id || `empty-${index}`}
              className={`grid gap-2 px-3 py-2.5 items-center transition-all duration-200 ${
                isActive 
                  ? 'bg-white/10 ring-1 ring-[#00d4aa]/30' 
                  : isEmpty
                    ? ''
                    : 'hover:bg-white/5'
              }`}
              style={{ 
                gridTemplateColumns: '30px 80px 40px 75px 40px 70px 50px 80px 30px',
                borderBottom: index < ROWS_COUNT - 1 ? '1px solid #2a2a45' : 'none',
                minHeight: '44px',
              }}
            >
              {/* Номер */}
              <span className={`text-center text-xs font-bold ${isEmpty ? 'text-[#4b5563]' : 'text-[#00d4aa]'}`}>
                {isEmpty ? '—' : index + 1}
              </span>

              {/* Товар */}
              <span className={`text-xs font-medium truncate ${isEmpty ? 'text-[#4b5563]' : 'text-[#e8e8f0]'}`}>
                {isEmpty ? '—' : order.productName}
              </span>

              {/* Номер колонки */}
              <span className={`text-center text-xs font-bold rounded-md py-0.5 ${
                isEmpty ? 'text-[#4b5563]' : 'bg-[#0a0a14] text-[#d1d5db]'
              }`}>
                {isEmpty ? '—' : order.pumpNumber}
              </span>

              {/* Литры */}
              <span className={`text-right font-mono text-xs font-semibold ${isEmpty ? 'text-[#4b5563]' : 'text-[#00d4aa]'}`}>
                {isEmpty ? '—' : formatVolume(order.volume)}
              </span>

              {/* Номер пистолета */}
              <span className={`text-center text-xs rounded-md py-0.5 ${
                isEmpty ? 'text-[#4b5563]' : 'bg-[#0a0a14] text-[#9ca3af]'
              }`}>
                {isEmpty ? '—' : `№${order.nozzleNumber}`}
              </span>

              {/* Цена за литр */}
              <span className={`text-right font-mono text-xs ${isEmpty ? 'text-[#4b5563]' : 'text-[#d1d5db]'}`}>
                {isEmpty ? '—' : formatAmount(order.pricePerUnit)}
              </span>

              {/* Скидка */}
              <span className={`text-center text-xs font-semibold ${
                isEmpty 
                  ? 'text-[#4b5563]' 
                  : order.discountPercent 
                    ? 'text-[#ffa502]' 
                    : 'text-[#4b5563]'
              }`}>
                {isEmpty ? '—' : order.discountPercent ? `${order.discountPercent}%` : '0%'}
              </span>

              {/* Итоговая сумма */}
              <span className={`text-right font-mono text-sm font-bold ${isEmpty ? 'text-[#4b5563]' : 'text-[#ffd700]'}`}>
                {isEmpty ? '—' : formatAmount(order.totalAmount)}
              </span>

              {/* Кнопка удаления */}
              <div className="flex justify-center">
                {!isEmpty && (
                  <button
                    onClick={() => onRemoveOrder(order.id)}
                    className="w-6 h-6 flex items-center justify-center rounded-full transition-colors
                             hover:bg-red-500/20 text-gray-500 hover:text-red-400"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <line x1="2" y1="2" x2="10" y2="10"/>
                      <line x1="10" y1="2" x2="2" y2="10"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Итого */}
      <div className="flex justify-end items-center gap-4 mt-2 px-3 py-2 rounded-xl bg-[#0f3460]">
        <span className="text-xs uppercase tracking-wider font-semibold text-[#6c7293]">
          Заказов: {orders.length}
        </span>
        <span className="text-xs uppercase tracking-wider font-semibold text-[#6c7293]">
          Итого:
        </span>
        <span className="text-lg font-mono font-bold text-[#ffd700]">
          {formatAmount(orders.reduce((sum, o) => sum + o.totalAmount, 0))}
        </span>
      </div>
    </div>
  );
}
