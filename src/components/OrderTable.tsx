// src/components/OrderTable.tsx
import { type OrderItem, type OrderStatus } from '../types/schemas';

interface OrderTableProps {
  items: OrderItem[];
  status: OrderStatus;
  selectedPump?: number | null;
  activeItemId?: string | null;
  fuelingItemId?: string | null;
  isStopped?: boolean;
  isCompleted?: boolean;
  onSelectItem?: (item: OrderItem) => void;
  onRemoveItem?: (itemId: string) => void;
  onEditOrder?: () => void;
}

const formatAmount = (n: number) => isNaN(n) ? '0,00' : n.toFixed(2).replace('.', ',');
const formatVolume = (n: number) => isNaN(n) ? '0,00' : n.toFixed(2).replace('.', ',');
const ROWS_COUNT = 3;
const MAX_ROWS = 5;

export default function OrderTable({ 
  items, 
  status,
  selectedPump,
  activeItemId,
  fuelingItemId,
  isStopped = false,
  isCompleted = false,
  onSelectItem,
  onRemoveItem,
  onEditOrder,
}: OrderTableProps) {
  const rows: (OrderItem | null)[] = Array.from(
    { length: Math.max(items.length, ROWS_COUNT) }, 
    (_, i) => items[i] || null
  );

  const isDraft = status === 'draft';
  const isCreated = status === 'created';
  const isFueling = status === 'fueling';

  return (
    <div className="mb-3">
      {/* Заголовок с кнопкой "Изм." */}
      <div className="flex items-center justify-between px-3 py-2 rounded-t-xl"
        style={{ backgroundColor: '#0f3460' }}>
        {/* Пустой div для баланса flex */}
        <div className="w-10" />
        
        <span className="text-[14px] uppercase tracking-wider font-semibold text-[#6c7293]">
          ЗАКАЗ ТРК №{selectedPump || '—'}
        </span>
        
        {isCreated && onEditOrder ? (
          <button
            onClick={onEditOrder}
            className="text-[12px] tracking-wider font-semibold text-[#ffa502] 
                    hover:text-[#ffbe76] transition-colors px-2 py-0.5 rounded-lg
                    hover:bg-[#ffa502]/10"
          >
            Изм.
          </button>
        ) : (
          <div className="w-10" />
        )}
      </div>

      {/* Заголовок колонок */}
      <div className="grid gap-2 px-3 py-2 text-[10px] uppercase tracking-wider font-semibold"
        style={{ 
          gridTemplateColumns: '30px 80px 40px 44px 70px 75px 50px 80px 30px', 
          backgroundColor: '#0f3460', 
          color: '#6c7293', 
          borderTop: '1px solid #2a2a45' 
        }}>
        <span className="text-center">№</span>
        <span>Товар</span>
        <span className="text-center">ТРК</span>
        <span className="text-center">Рукав</span>
        <span className="text-right">Цена</span>
        <span className="text-right">Объем</span>
        <span className="text-center">Скидка</span>
        <span className="text-right">Сумма</span>
        <span></span>
      </div>

      {/* Строки */}
      <div className="rounded-b-xl overflow-hidden" style={{ backgroundColor: '#1a1a2e', minHeight: `${MAX_ROWS * 44}px` }}>
        {rows.map((item, i) => {
          const isEmpty = !item || item.nozzleNumber === 0;
          const isActive = item && activeItemId === item.id;
          const isFueling = item && fuelingItemId === item.id;
          const isEmptyRow = !item;

          return (
            <div key={item?.id || i}
              onClick={() => !isEmptyRow && onSelectItem?.(item!)}
              className={`grid gap-2 px-3 py-2.5 items-center transition-all duration-200 ${
                isActive ? 'bg-white/10 ring-1 ring-[#ffa502]/30 cursor-pointer' :
                isFueling ? 'bg-white/5 cursor-pointer' :
                !isEmptyRow ? 'hover:bg-white/5 cursor-pointer' : ''
              }`}
              style={{ 
                gridTemplateColumns: '30px 80px 40px 44px 70px 75px 50px 80px 30px', 
                minHeight: '44px', 
                borderBottom: i < rows.length - 1 ? '1px solid #2a2a45' : 'none' 
              }}>
              
              {/* № */}
              <span className={`text-center text-xs font-bold ${isEmptyRow ? 'text-[#4b5563]' : 'text-[#00d4aa]'}`}>
                {isEmptyRow ? '—' : i + 1}
              </span>

              {/* Товар */}
              <span className={`text-xs truncate ${isEmptyRow ? 'text-[#4b5563]' : isEmpty ? 'text-[#4b5563]' : 'text-[#e8e8f0]'}`}>
                {isEmptyRow ? '—' : item.productName}
              </span>

              {/* ТРК */}
              <span className={`text-center text-xs rounded-md py-0.5 ${isEmptyRow ? 'text-[#4b5563]' : 'bg-[#0a0a14] text-[#d1d5db]'}`}>
                {isEmptyRow ? '—' : item.pumpNumber}
              </span>

              {/* Рукав */}
              <span className={`text-center text-xs rounded-md py-0.5 ${isEmptyRow ? 'text-[#4b5563]' : item.nozzleNumber > 0 ? 'bg-[#0a0a14] text-[#9ca3af]' : 'text-[#4b5563]'}`}>
                {isEmptyRow ? '—' : item.nozzleNumber > 0 ? `№${item.nozzleNumber}` : '—'}
              </span>

              {/* Цена */}
              <span className={`text-right font-mono text-xs ${isEmptyRow ? 'text-[#4b5563]' : item.pricePerUnit > 0 ? 'text-[#d1d5db]' : 'text-[#4b5563]'}`}>
                {isEmptyRow ? '—' : formatAmount(item.pricePerUnit)}
              </span>

              {/* Объем */}
              <span className={`text-right font-mono text-xs font-semibold ${isEmptyRow ? 'text-[#4b5563]' : item.volume > 0 ? 'text-[#00d4aa]' : 'text-[#4b5563]'}`}>
                {isEmptyRow ? '—' : formatVolume(item.volume)}
              </span>

              {/* Скидка */}
              <span className={`text-center text-xs font-semibold ${isEmptyRow || !item.discountPercent ? 'text-[#4b5563]' : 'text-[#ffa502]'}`}>
                {isEmptyRow ? '—' : item.discountPercent ? `${item.discountPercent}%` : '0%'}
              </span>

              {/* Сумма */}
              <span className={`text-right font-mono text-sm font-bold ${isEmptyRow ? 'text-[#4b5563]' : item.totalAmount > 0 ? 'text-[#ffd700]' : 'text-[#4b5563]'}`}>
                {isEmptyRow ? '—' : formatAmount(item.totalAmount)}
              </span>

              {/* Индикатор */}
              <div className="flex justify-center">
                {!isEmptyRow && isDraft && (
                  <button onClick={(e) => { e.stopPropagation(); onRemoveItem?.(item!.id); }}
                    className="w-6 h-6 flex items-center justify-center rounded-full transition-colors hover:bg-red-500/20 text-gray-500 hover:text-red-400">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <line x1="2" y1="2" x2="10" y2="10"/><line x1="10" y1="2" x2="2" y2="10"/>
                    </svg>
                  </button>
                )}
                {!isEmptyRow && (isCreated || isFueling) && (
                  <div className={`w-3 h-3 rounded-full ${
                    isCompleted
                      ? 'bg-[#ef4444]'
                      : isStopped
                        ? 'bg-[#ffa502]'
                        : isFueling
                          ? 'bg-[#3b82f6] animate-pulse'
                          : 'bg-white'
                  }`} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
