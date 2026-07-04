// src/components/PumpSidebar.tsx
import { useState } from 'react';
import { type PumpValue, type SelectedNozzleValue, PUMP_STATUS } from '../types/schemas';

interface PumpSidebarProps {
  pumps: PumpValue[];
  selectedPump: number | null;
  onSelectPump: (number: number) => void;
  selectedNozzle: number | null;
  onSelectNozzle: (num: number) => void;
}

type ViewMode = 'dispenser' | 'dispensers';

// Цвета по статусам
const getStatusBgColor = (status: number): string => {
  switch (status) {
    case PUMP_STATUS.OFF: return '#4ade80';
    case PUMP_STATUS.PRESET: return '#38bdf8';
    case PUMP_STATUS.CALL: return '#818cf8';
    case PUMP_STATUS.CALL_ERROR: return '#f87171';
    case PUMP_STATUS.BUSY: return '#3b82f6';
    case PUMP_STATUS.BUSY_OVERFLOW: return '#f97316';
    case PUMP_STATUS.WAIT_OFF_OVERFLOW: return '#fbbf24';
    case PUMP_STATUS.WAIT_OFF_REMAINDER: return '#f59e0b';
    case PUMP_STATUS.WAIT_OFF: return '#a78bfa';
    case PUMP_STATUS.WAIT_RESET: return '#c084fc';
    case PUMP_STATUS.ERROR: return '#ef4444';
    default: return '#6b7280';
  }
};

const getStatusText = (status: number): string => {
  switch (status) {
    case PUMP_STATUS.OFF: return 'Свободна';
    case PUMP_STATUS.PRESET: return 'Установлена доза';
    case PUMP_STATUS.CALL: return 'Пистолет снят';
    case PUMP_STATUS.CALL_ERROR: return 'Ошибка пистолета';
    case PUMP_STATUS.BUSY: return 'Идет налив топлива';
    case PUMP_STATUS.BUSY_OVERFLOW: return 'Перелив';
    case PUMP_STATUS.WAIT_OFF_OVERFLOW: return 'Завершение с переливом';
    case PUMP_STATUS.WAIT_OFF_REMAINDER: return 'Ожидание продолжения';
    case PUMP_STATUS.WAIT_OFF: return 'Повесьте пистолет';
    case PUMP_STATUS.WAIT_RESET: return 'Ожидание сброса';
    case PUMP_STATUS.ERROR: return 'Ошибка';
    default: return 'Неизвестно';
  }
};

const formatTransactionTime = (isoString: string): string => {
  if (!isoString || isoString.startsWith('0001')) return '—';
  return new Date(isoString).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
};

const formatAmount = (amount: number): string => amount.toFixed(2).replace('.', ',');
const formatVolume = (volume: number): string => volume.toFixed(2).replace('.', ',');

const getSelectedNozzleNumber = (pump: PumpValue): number | null => {
  if (!pump.SelectedNozzle) return null;
  if (typeof pump.SelectedNozzle === 'number') return pump.SelectedNozzle;
  return (pump.SelectedNozzle as SelectedNozzleValue).Number;
};

const getProductName = (pump: PumpValue, nozzleNumber?: number): string | null => {
  if (!nozzleNumber) return null;
  const nozzle = pump.Nozzles.find(n => n.Number === nozzleNumber);
  return nozzle?.ProductRef || null;
};

const LockIcon = ({ locked, color = '#9ca3af' }: { locked: boolean; color?: string }) => (
  <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    {locked ? (
      <>
        <rect x="1" y="6" width="10" height="7" rx="1.5" stroke={color} strokeWidth="1.2" fill="none"/>
        <path d="M3 6V4C3 2.34315 4.34315 1 6 1C7.65685 1 9 2.34315 9 4V6" stroke={color} strokeWidth="1.2" fill="none"/>
        <circle cx="6" cy="9.5" r="0.8" fill={color}/>
        <line x1="6" y1="10.5" x2="6" y2="11.5" stroke={color} strokeWidth="0.8"/>
      </>
    ) : (
      <>
        <rect x="1" y="6" width="10" height="7" rx="1.5" stroke={color} strokeWidth="1.2" fill="none"/>
        <path d="M3 6V4C3 2.34315 4.34315 1 6 1C7.65685 1 9 2.34315 9 4" stroke={color} strokeWidth="1.2" fill="none" strokeDasharray="1 0.5"/>
      </>
    )}
  </svg>
);

// Карточка ТРК
function PumpCard({ 
  pump, 
  isSelected, 
  onSelect 
}: { 
  pump: PumpValue; 
  isSelected: boolean; 
  onSelect: (num: number) => void;
}) {
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
      onClick={() => pump.EnableService && onSelect(pump.Number)}
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
      <div 
        className="absolute left-0 top-0 bottom-0 w-1.5"
        style={{ backgroundColor: statusColor }}
      />

      <div className="flex flex-col p-2.5 pl-4 gap-2">
        <div className="flex items-center justify-between">
          <span 
            className="inline-flex items-center justify-center rounded-md px-2 py-0.5 font-bold"
            style={{ backgroundColor: `${statusColor}20`, color: statusColor, fontSize: '14px' }}
          >
            {pump.Number}
          </span>
          {productName && (
            <span 
              className="inline-flex items-center rounded-md px-2 py-0.5 font-medium truncate max-w-[100px]"
              style={{ backgroundColor: '#0a0a14', color: '#d1d5db', fontSize: '12px' }}
            >
              {productName}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-1 min-w-0 overflow-hidden">
            <span className="flex-shrink-0">
              <LockIcon locked={isLocked} color={statusColor} />
            </span>
            <div className="flex-1 min-w-0 overflow-hidden relative">
              <span 
                className={`
                  block whitespace-nowrap text-[8px] uppercase tracking-wider font-medium
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
          {hasTransaction && (
            <span className="flex-shrink-0 font-mono font-bold text-right" style={{ color: '#ffd700', fontSize: '12px' }}>
              {formatAmount(tx.RealTimeAmount)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[10px]" style={{ color: '#9ca3af' }}>
            {hasTransaction ? formatTransactionTime(tx.PresetTimeStamp) : '—'}
          </span>
          {hasTransaction && (
            <span className="font-mono font-bold" style={{ color: '#e8e8f0', fontSize: '18px' }}>
              
              {formatVolume(tx.RealTimeVolume)}
            </span>
          )}
        </div>
      </div>

      {isBusy && (
        <div className="absolute bottom-0 left-1.5 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
      )}
    </button>
  );
}

// NozzleCard — выбор пистолета
function NozzleCard({ 
  pump, 
  nozzle,
  isSelected,
  onSelect,
}: { 
  pump: PumpValue;
  nozzle: { Number: number; ProductRef: string; VolumeTotalCounter: number; AmountTotalCounter: number; DefaultPricePerUnit: number };
  isSelected: boolean;
  onSelect: (pumpNumber: number, nozzleNumber: number) => void;
}) {
  // Цвет только для выбранного пистолета
  const activeColor = '#00d4aa';
  const nozzleColor = isSelected ? activeColor : '#6b7280';
  const isBusy = pump.Status === PUMP_STATUS.BUSY || pump.Status === PUMP_STATUS.BUSY_OVERFLOW;

  return (
    <button
      onClick={() => pump.EnableService && onSelect(pump.Number, nozzle.Number)}
      disabled={!pump.EnableService}
      className={`
        relative flex flex-col rounded-xl overflow-hidden
        transition-all duration-200 text-left
        ${isSelected ? 'ring-2 ring-[#00d4aa]/50' : 'ring-1 ring-transparent'}
        ${pump.EnableService ? 'cursor-pointer hover:brightness-110' : 'opacity-60 cursor-not-allowed'}
      `}
      style={{ backgroundColor: '#0f3460' }}
    >
      <div className="flex flex-col p-2.5 pl-4 gap-2">
        {/* Верхний ряд: номер пистолета и продукт */}
        <div className="flex items-center justify-between">
          <span 
            className="inline-flex items-center justify-center rounded-md px-2 py-0.5 font-bold"
            style={{ 
              backgroundColor: isSelected ? `${nozzleColor}20` : '#16213e', 
              color: nozzleColor, 
              fontSize: '14px',
              border: isSelected ? `1px solid ${nozzleColor}40` : '1px solid transparent',
            }}
          >
            {nozzle.Number}
          </span>
          <span 
            className="inline-flex items-center rounded-md px-2 py-0.5 font-medium truncate max-w-[100px]"
            style={{ backgroundColor: '#0a0a14', color: '#d1d5db', fontSize: '12px' }}
          >
            {nozzle.ProductRef}
          </span>
        </div>

        {/* Средний ряд: замок, "Стоимость", цена */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <span className="flex-shrink-0">
              <LockIcon locked={!!pump.LockTag} color={nozzleColor} />
            </span>
            <span className="text-[9px] uppercase tracking-wider font-medium text-[#6c7293]">
              Стоимость
            </span>
          </div>
          <span className="flex-shrink-0 font-mono font-bold text-right" style={{ color: '#ffd700', fontSize: '12px' }}>
            {formatAmount(nozzle.DefaultPricePerUnit)}
          </span>
        </div>

        {/* Нижний ряд: суммарный объём справа */}
        <div className="flex items-center justify-end">
          <span className="font-mono font-bold" style={{ color: '#e8e8f0', fontSize: '18px' }}>
            {formatVolume(nozzle.VolumeTotalCounter)}
          </span>
        </div>
      </div>

      {isBusy && (
        <div className="absolute bottom-0 left-1.5 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
      )}
    </button>
  );
}

export default function PumpSidebar({ 
  pumps, 
  selectedPump, 
  onSelectPump,
  selectedNozzle,
  onSelectNozzle,
}: PumpSidebarProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('dispensers');
  const sortedPumps = [...pumps].sort((a, b) => a.Number - b.Number);
  const selectedPumpData = sortedPumps.find(p => p.Number === selectedPump);

  const handleSelectDispenser = (pumpNumber: number) => {
    onSelectPump(pumpNumber);
  };

  const handleSelectNozzle = (pumpNumber: number, nozzleNumber: number) => {
    onSelectPump(pumpNumber);
    onSelectNozzle(nozzleNumber);
  };

  return (
    <nav className="w-[380px] bg-[#1a1a2e] overflow-y-auto border-r border-gray-700 flex-shrink-0 flex flex-col">
      <div className="p-2 pb-0">
        {/* Переключатели режимов */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <button
            onClick={() => setViewMode('dispenser')}
            className={`
              py-2 rounded-xl text-sm font-semibold transition-all duration-200
              ${viewMode === 'dispenser'
                ? 'bg-[#00d4aa] text-black'
                : 'bg-[#0f3460]/20 text-gray-400 hover:bg-[#16213e] hover:text-gray-300 border-2 border-transparent hover:border-gray-600'
              }
            `}
          >
            Диспенсер
          </button>
          <button
            onClick={() => setViewMode('dispensers')}
            className={`
              py-2 rounded-xl text-sm font-semibold transition-all duration-200
              ${viewMode === 'dispensers'
                ? 'bg-[#00d4aa] text-black'
                : 'bg-[#0f3460]/20 text-gray-400 hover:bg-[#16213e] hover:text-gray-300 border-2 border-transparent hover:border-gray-600'
              }
            `}
          >
            Диспенсеры
          </button>
        </div>

        {/* Показания состояния диспенсера */}
        <div className="py-2 px-3 mb-2 rounded-xl bg-[#0f3460]/20 border border-[#2a2a45]">
          <span className="text-xs text-gray-400">
            Показания состояния диспенсера:{' '}
            <span className="text-[#00d4aa] font-bold">
              {selectedPump ? `№${selectedPump}` : '—'}
            </span>
          </span>
        </div>
      </div>

      {/* Контент */}
      <div className="p-2 flex-1">
        {viewMode === 'dispenser' ? (
          selectedPumpData ? (
            <div className="grid grid-cols-2 gap-2">
              {selectedPumpData.Nozzles
                .sort((a, b) => a.Number - b.Number)
                .map(nozzle => (
                  <NozzleCard
                    key={nozzle.Number}
                    pump={selectedPumpData}
                    nozzle={nozzle}
                    isSelected={selectedNozzle === nozzle.Number && selectedPump === selectedPumpData.Number}
                    onSelect={handleSelectNozzle}
                  />
                ))
              }
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 text-sm">
              Выберите диспенсер
            </div>
          )
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {sortedPumps.map(pump => (
              <PumpCard
                key={pump.Number}
                pump={pump}
                isSelected={selectedPump === pump.Number}
                onSelect={handleSelectDispenser}
              />
            ))}
          </div>
        )}
      </div>

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
