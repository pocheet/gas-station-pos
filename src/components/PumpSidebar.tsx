// src/components/PumpSidebar.tsx
import { type PumpValue, PUMP_STATUS } from '../types/schemas';
import { Lock, LocalGasStation } from '@mui/icons-material';

interface PumpSidebarProps {
  pumps: PumpValue[];
  selectedPump: number | null;
  onSelectPump: (number: number) => void;
}

export default function PumpSidebar({ pumps, selectedPump, onSelectPump }: PumpSidebarProps) {
  const getStatusColor = (status: number) => {
    switch (status) {
      case PUMP_STATUS.OFF: return '#b0f26d';
      case PUMP_STATUS.PRESET: return '#b0f26d';
      case PUMP_STATUS.BUSY: return 'blue';
      case PUMP_STATUS.ERROR: return '#ff4757';
      case PUMP_STATUS.WAIT_OFF_REMAINDER: return '#ffd700';

      default: return '#6c7293';
    }
  };

  const getStatusText = (pump: PumpValue) => {
    const tx = pump.Transaction;
    const isActive = tx.TransactionId !== '00000000-0000-0000-0000-000000000000';
    
    if (pump.Status === PUMP_STATUS.PRESET) return 'Установлена доза';

    if (pump.Status === PUMP_STATUS.BUSY) return 'Идет отпуск';
    if (pump.Status === PUMP_STATUS.WAIT_OFF_REMAINDER) return 'Остаток';
    if (pump.Status === PUMP_STATUS.WAIT_RESET) return 'Ожидает обработки';
    if (isActive) return `Завершена (${tx.RealTimeVolume.toFixed(1)}л)`;
    return 'Свободна';
  };

  return (
    <nav className="w-[350px] bg-[#1a1a2e] overflow-y-auto border-r border-gray-700">
      <div className="p-2">
        {pumps
          .sort((a, b) => a.Number - b.Number)
          .map(pump => {
            const isLocked = !!pump.LockTag;
            const isSelected = selectedPump === pump.Number;
            const tx = pump.Transaction;
            const hasTransaction = tx.TransactionId !== '00000000-0000-0000-0000-000000000000';

            return (
              <button
                key={pump.Number}
                onClick={() => pump.EnableService && onSelectPump(pump.Number)}
                disabled={!pump.EnableService}
                className={`
                  w-full flex items-stretch mb-1 rounded-lg overflow-hidden
                  transition-all duration-200
                  ${isSelected ? 'ring-2 ring-[#00d4aa]' : ''}
                  ${!pump.EnableService ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-[#16213e]'}
                `}
              >
                {/* Status indicator */}
                <div 
                  className="w-2 flex-shrink-0"
                  style={{ backgroundColor: getStatusColor(pump.Status) }}
                />
                
                {/* Pump content */}
                <div className="flex-1 flex items-center p-3 bg-[#0f3460]/20">
                  <div className="flex items-center justify-center w-14 h-14 bg-[#16213e] rounded-lg mr-3 relative">
                    <LocalGasStation sx={{ fontSize: 28, color: '#00d4aa' }} />
                    <span className="absolute -top-1 -right-1 bg-[#00d4aa] text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {pump.Transaction.NozzleNumber}
                    </span>
                  </div>
                  
                  <div className="flex-1 text-left">
                    <div className="text-white font-bold text-lg">
                      ТРК {pump.Number}
                    </div>
                    
                    {hasTransaction && (
                      <div className="flex gap-4 mt-1 text-sm">
                        <span className="text-[#ffd700]">{tx.RealTimeAmount.toFixed(2)} ₽</span>
                        <span className="text-gray-300">{tx.RealTimeVolume.toFixed(2)} л</span>
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-400 mt-0.5">
                      {getStatusText(pump)}
                      {hasTransaction && (
                        <span className="text-gray-500">
                          {pump.Nozzles.find(n => n.Number === tx.NozzleNumber)?.ProductRef && 
                            ` (${pump.Nozzles.find(n => n.Number === tx.NozzleNumber)?.ProductRef})`
                          }
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {isLocked && (
                    <Lock sx={{ color: '#ff4757', ml: 1 }} fontSize="small" />
                  )}
                </div>
              </button>
            );
          })}
      </div>
    </nav>
  );
}
