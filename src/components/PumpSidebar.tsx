// src/components/PumpSidebar.tsx
import { type PumpValue, type SelectedNozzleValue, PUMP_STATUS } from '../types/schemas';

interface PumpSidebarProps {
  pumps: PumpValue[];
  selectedPump: number | null;
  onSelectPump: (number: number) => void;
}

// Цвета фона по статусам
const getStatusBgColor = (status: number): string => {
  switch (status) {
    case PUMP_STATUS.OFF: return '#b0f26d';
    case PUMP_STATUS.PRESET: return '#38bdf8';


    case PUMP_STATUS.BUSY: return '#3b82f6';
    case PUMP_STATUS.BUSY_OVERFLOW: return '#f97316';
    case PUMP_STATUS.WAIT_OFF_OVERFLOW: return '#fbbf24';
    case PUMP_STATUS.WAIT_OFF_REMAINDER: return '#ffa502';
    // case PUMP_STATUS.WAIT_OFF: return '#a78bfa';
    // case PUMP_STATUS.WAIT_RESET: return '#c084fc';
    case PUMP_STATUS.ERROR: return '#ff4757';
    default: return '#6c7293';
  }
};

const getStatusText = (status: number): string => {
  switch (status) {
    case PUMP_STATUS.OFF: return 'Свободна';
    case PUMP_STATUS.PRESET: return 'Установлена доза';
    // case PUMP_STATUS.CALL: return 'Пистолет снят';
    // case PUMP_STATUS.CALL_ERROR: return 'Ошибка пистолета';
    case PUMP_STATUS.BUSY: return 'Идет отпуск';
    case PUMP_STATUS.BUSY_OVERFLOW: return 'Перелив';
    // case PUMP_STATUS.WAIT_OFF_OVERFLOW: return 'Завершение с переливом';
    case PUMP_STATUS.WAIT_OFF_REMAINDER: return 'Остаток';
    // case PUMP_STATUS.WAIT_OFF: return 'Повесьте пистолет';
    case PUMP_STATUS.WAIT_RESET: return 'Ожидает обработки';
    case PUMP_STATUS.ERROR: return 'Ошибка';
    default: return 'Неизвестно';
  }
};

const formatTransactionTime = (isoString: string): string => {
  if (!isoString || isoString.startsWith('0001')) return '—';
  return new Date(isoString).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
};

const formatAmount = (amount: number): string => {
  return amount.toFixed(2).replace('.', ',');
};

const formatVolume = (volume: number): string => {
  return volume.toFixed(2).replace('.', ',');
};

// Получаем номер выбранного пистолета
const getSelectedNozzleNumber = (pump: PumpValue): number | null => {
  if (!pump.SelectedNozzle) return null;
  if (typeof pump.SelectedNozzle === 'number') return pump.SelectedNozzle;
  return (pump.SelectedNozzle as SelectedNozzleValue).Number;
};

// Получаем продукт по номеру пистолета
const getProductName = (pump: PumpValue, nozzleNumber?: number): string | null => {
  if (!nozzleNumber) return null;
  const nozzle = pump.Nozzles.find(n => n.Number === nozzleNumber);
  return nozzle?.ProductRef || null;
};

// SVG иконка замка
const LockIcon = ({ locked, color = '#9ca3af' }: { locked: boolean; color?: string }) => (
  <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    {locked ? (
      // Закрытый замок
      <>
        <rect x="1" y="6" width="10" height="7" rx="1.5" stroke={color} strokeWidth="1.2" fill="none"/>
        <path d="M3 6V4C3 2.34315 4.34315 1 6 1C7.65685 1 9 2.34315 9 4V6" stroke={color} strokeWidth="1.2" fill="none"/>
        <circle cx="6" cy="9.5" r="0.8" fill={color}/>
        <line x1="6" y1="10.5" x2="6" y2="11.5" stroke={color} strokeWidth="0.8"/>
      </>
    ) : (
      // Открытый замок
      <>
        <rect x="1" y="6" width="10" height="7" rx="1.5" stroke={color} strokeWidth="1.2" fill="none"/>
        <path d="M3 6V4C3 2.34315 4.34315 1 6 1C7.65685 1 9 2.34315 9 4" stroke={color} strokeWidth="1.2" fill="none" strokeDasharray="1 0.5"/>
      </>
    )}
  </svg>
);

export default function PumpSidebar({ pumps, selectedPump, onSelectPump }: PumpSidebarProps) {
  const sortedPumps = [...pumps].sort((a, b) => a.Number - b.Number);

  return (
    <nav className="w-[380px] bg-[#1a1a2e] overflow-y-auto border-r border-gray-700 flex-shrink-0">
      <div className="p-2">
        <div className="grid grid-cols-2 gap-2">
          {sortedPumps.map(pump => {
            const isSelected = selectedPump === pump.Number;
            const statusColor = getStatusBgColor(pump.Status);
            const isLocked = !!pump.LockTag;
            const tx = pump.Transaction;
            const hasTransaction = tx.TransactionId !== '00000000-0000-0000-0000-000000000000';
            const nozzleNumber = getSelectedNozzleNumber(pump) || tx.NozzleNumber;
            const productName = getProductName(pump, nozzleNumber);
            const isBusy = pump.Status === PUMP_STATUS.BUSY || pump.Status === PUMP_STATUS.BUSY_OVERFLOW;
            const statusText = getStatusText(pump.Status);

            return (
              <button
                key={pump.Number}
                onClick={() => pump.EnableService && onSelectPump(pump.Number)}
                disabled={!pump.EnableService}
                className={`
                  relative flex flex-col rounded-xl overflow-hidden
                  transition-all duration-200 text-left
                  ${isSelected 
                    ? 'ring-2 ring-white/50' 
                    : 'ring-1 ring-transparent'
                  }
                  ${pump.EnableService ? 'cursor-pointer hover:brightness-110' : 'opacity-60 cursor-not-allowed'}
                `}
                style={{ backgroundColor: '#0f3460' }}
              >
                {/* Status indicator — левая полоска */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-1.5"
                  style={{ backgroundColor: statusColor }}
                />

                <div className="flex flex-col p-2.5 pl-4 gap-2">
                  {/* Верхний ряд: номер и продукт */}
                  <div className="flex items-center justify-between">
                    <span 
                      className="inline-flex items-center justify-center rounded-md px-2 py-0.5 font-bold"
                      style={{ 
                        backgroundColor: `${statusColor}20`, 
                        color: statusColor,
                        fontSize: '14px',
                      }}
                    >
                      {pump.Number}
                    </span>
                    {productName && (
                      <span 
                        className="inline-flex items-center rounded-md px-2 py-0.5 font-medium truncate max-w-[100px]"
                        style={{ 
                          backgroundColor: '#0a0a14',
                          color: '#d1d5db',
                          fontSize: '12px',
                        }}
                      >
                        {productName}
                      </span>
                    )}
                  </div>

                  {/* Средний ряд: замок, статус, объём */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-1 min-w-0 overflow-hidden">
                      {/* Иконка замка SVG */}
                      <span className="flex-shrink-0">
                        <LockIcon locked={isLocked} color={statusColor} />
                      </span>
                      {/* Бегущая строка */}
                      <div className="flex-1 min-w-0 overflow-hidden relative">
                        <span 
                          className={`
                            block whitespace-nowrap text-[10  px] tracking-wider font-medium
                            ${statusText.length > 15 ? 'animate-marquee' : ''}
                          `}
                          style={{ color: statusColor }}
                        >
                          {statusText.length > 15 
                            ? `${statusText}\u00A0\u00A0\u00A0${statusText}`
                            : statusText
                          }
                        </span>
                      </div>
                    </div>
                    {/* Объём */}
                    {hasTransaction && (
                      <span 
                        className="flex-shrink-0 font-mono font-bold text-right"
                        style={{ color: '#e8e8f0', fontSize: '12px' }}
                      >
                        {formatVolume(tx.RealTimeVolume)}
                      </span>
                    )}
                  </div>

                  {/* Нижний ряд: время и стоимость */}
                  <div className="flex items-center justify-between">
                    <span 
                      className="text-[10px]"
                      style={{ color: '#9ca3af' }}
                    >
                      {hasTransaction 
                        ? formatTransactionTime(tx.PresetTimeStamp)
                        : '—'
                      }
                    </span>
                    {hasTransaction && (
                      <span 
                        className="font-mono font-bold"
                        style={{ color: '#ffd700', fontSize: '16px' }}
                      >
                        {formatAmount(tx.RealTimeAmount)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Анимация при наливе */}
                {isBusy && (
                  <div className="absolute bottom-0 left-1.5 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Стили для бегущей строки */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 6s linear infinite;
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </nav>
  );
}
