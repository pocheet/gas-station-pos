// src/components/NozzleSelector.tsx
import { type NozzleConfig, type PumpValue, type Product, PUMP_STATUS } from '../types/schemas';

interface NozzleSelectorProps {
  nozzles: NozzleConfig[];
  products: Product[];
  pumpState?: PumpValue;
  selectedNozzle: number | null;
  onSelectNozzle: (number: number) => void;
  disabled?: boolean;
}

// Цвета пистолетов по статусам ТРК
const getNozzleColorByStatus = (status: number): string => {
  switch (status) {
    // Активные статусы - синий
    case PUMP_STATUS.BUSY: 
    case PUMP_STATUS.BUSY_OVERFLOW: 
      return '#3b82f6'; // Синий — идет налив
    
    // Статусы ожидания действий - оранжевый
    case PUMP_STATUS.CALL: 
    case PUMP_STATUS.CALL_ERROR: 
    case PUMP_STATUS.WAIT_OFF: 
    case PUMP_STATUS.WAIT_OFF_OVERFLOW: 
    case PUMP_STATUS.WAIT_OFF_REMAINDER: 
    case PUMP_STATUS.WAIT_RESET: 
      return '#ffa502'; // Оранжевый — требуется действие
    
    // Ошибка - красный
    case PUMP_STATUS.ERROR: 
      return '#ef4444'; // Красный — ошибка
    
    // Готовность - зеленый
    case PUMP_STATUS.PRESET: 
      return '#4ade80'; // Зеленый — установлена доза
    
    // По умолчанию - серый
    default: 
      return '#4b5563';
  }
};

// Иконка пистолета SVG
const NozzleIcon = ({ color = '#6b7280' }: { color?: string }) => (
  <svg width="31" height="18" viewBox="0 0 31 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M25.4406 12.4581C25.4406 12.4581 24.022 11.7702 23.0118 11.0394C21.9908 10.3086 20.6474 9.26614 20.0885 9.24464C19.5404 9.22315 18.6699 9.72827 18.412 9.70677C18.1433 9.68528 17.6382 9.33062 18.1433 8.97596C18.6484 8.6213 19.8413 7.869 20.3572 7.97647C20.8623 8.08394 22.5067 9.50258 23.2052 9.9862C23.9145 10.4698 25.3224 11.5553 25.4406 11.7058C25.5589 11.8885 25.5159 12.3076 25.4406 12.4581Z" fill={color}/>
    <path d="M30.5134 11.9854L30.062 11.5555C29.9545 11.448 29.804 11.4158 29.6643 11.4373C28.8583 10.6527 27.3859 9.2556 26.5906 8.61077C25.4407 7.69725 22.7538 5.90246 22.7001 5.12866C22.6464 4.36561 23.173 3.62405 23.087 3.23715C23.001 2.85025 22.2487 2.60305 21.7866 2.39886C21.3352 2.19466 18.2078 0.765276 17.8101 0.571825C17.4125 0.378375 16.6602 0.0452118 16.4237 0.00222283C16.1873 -0.0407661 15.4995 0.550332 15.1126 0.862002C14.7257 1.17367 12.5977 2.77501 12.2968 2.88248C12.0066 2.98996 10.9856 2.95772 10.9856 2.95772L10.7599 6.1389L15.5102 11.4158C15.5102 11.4158 16.456 11.1256 17.1008 12.1251C17.7456 13.1246 20.0455 17.2193 21.7544 17.3375C23.4632 17.4557 26.7626 13.2966 27.1817 13.2751C27.4934 13.2536 27.6868 13.2966 27.7621 13.3181C27.6224 13.49 27.6331 13.748 27.7943 13.9092L28.2457 14.339C28.4176 14.511 28.6971 14.5003 28.869 14.3283L30.5241 12.6087C30.6961 12.4368 30.6961 12.1574 30.5134 11.9854ZM24.4412 14.1563C23.7641 14.8334 23.001 15.4245 22.109 15.4245C21.2277 15.4245 20.0241 13.9199 19.2932 13.0816C18.6269 12.3293 17.4232 10.685 17.5092 9.53503C17.5952 8.38507 19.3685 6.99868 20.3357 7.08466C21.303 7.17064 22.3992 7.87996 23.3987 8.87945C24.3982 9.87894 25.7308 10.9429 25.7308 11.9747C25.7416 13.0064 25.1182 13.4793 24.4412 14.1563Z" fill={color}/>
    <path d="M10.545 3.79632C10.4912 3.78557 10.4268 3.77483 10.373 3.77483L5.2466 3.66736C5.11763 3.66736 4.98867 3.68885 4.87045 3.74258L0.48558 5.77382C0.0664376 5.96727 -0.116271 6.47239 0.0771796 6.89154C0.216894 7.19246 0.507071 7.37516 0.818741 7.37516C0.947708 7.37516 1.06593 7.35367 1.18415 7.29993L5.38631 5.35467L10.33 5.4514C10.3945 5.4514 10.4483 5.4514 10.502 5.44066L10.545 3.79632Z" fill={color}/>
  </svg>
);

export default function NozzleSelector({ 
  nozzles, 
  pumpState,
  selectedNozzle, 
  onSelectNozzle,
  disabled = false,
}: NozzleSelectorProps) {
  const getProductPrice = (productRef: string) => {
    const nozzle = pumpState?.Nozzles.find(n => n.ProductRef === productRef);
    return nozzle?.DefaultPricePerUnit ?? 0;
  };

  // Получаем цвет для пистолета
  const getNozzleColor = (nozzleLogicalNumber: number): string => {
    if (!pumpState) return '#4b5563'; // Серый — нет данных

    const tx = pumpState.Transaction;
    const isTransactionActive = tx.TransactionId !== '00000000-0000-0000-0000-000000000000';
    
    // 1. Пистолет выбран оператором в UI
    if (selectedNozzle === nozzleLogicalNumber) {
      return '#00d4aa'; // Бирюзовый — выбран
    }

    // 2. Пистолет участвует в активной транзакции
    if (isTransactionActive && tx.NozzleNumber === nozzleLogicalNumber) {
      return getNozzleColorByStatus(pumpState.Status);
    }

    // 3. Пистолет выбран на ТРК (SelectedNozzle)
    // if (pumpState.SelectedNozzle === nozzleLogicalNumber) {
    //   return getNozzleColorByStatus(pumpState.Status);
    // }

    // 4. Неактивный пистолет
    return '#4b5563'; // Серый
  };

  // Определяем, есть ли активность на пистолете
  const isNozzleActive = (nozzleLogicalNumber: number): boolean => {
    if (!pumpState) return false;
    
    const tx = pumpState.Transaction;
    const isTransactionActive = tx.TransactionId !== '00000000-0000-0000-0000-000000000000';
    
    return selectedNozzle === nozzleLogicalNumber ||
          //  pumpState.SelectedNozzle === nozzleLogicalNumber ||
           (isTransactionActive && tx.NozzleNumber === nozzleLogicalNumber);
  };

  return (
    <div className="mb-6">
      {/* Горизонтальный ряд пистолетов */}
      <div className="flex gap-4 justify-center">
        {nozzles
          .sort((a, b) => a.PhysicalNumber - b.PhysicalNumber)
          .map(nozzle => {
            const price = getProductPrice(nozzle.ProductRef);
            const isSelected = selectedNozzle === nozzle.LogicalNumber;
            const nozzleColor = getNozzleColor(nozzle.LogicalNumber);
            const isActive = isNozzleActive(nozzle.LogicalNumber);

            return (
              <button
                key={nozzle.LogicalNumber}
                onClick={() => onSelectNozzle(nozzle.LogicalNumber)}
                disabled={disabled}
                className={`
                  flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200
                  min-w-[80px]
                  ${isSelected 
                    ? 'bg-[#1a1a2e]/50 border-2 border-[#00d4aa]' 
                    : isActive
                      ? 'bg-[#1a1a2e]/50 border-2 border-transparent hover:border-gray-600'
                      : 'bg-[#1a1a2e]/50 border-2 border-transparent hover:border-gray-600'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {/* Номер пистолета */}
                <div 
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors"
                  style={{ 
                    backgroundColor: isActive ? `${nozzleColor}20` : '#16213e',
                    color: isActive ? nozzleColor : '#e8e8f0',
                    border: isActive ? `2px solid ${nozzleColor}` : '2px solid transparent',
                  }}
                >
                  {nozzle.LogicalNumber}
                </div>

                {/* Иконка пистолета */}
                <NozzleIcon color={nozzleColor} />

                {/* Название топлива вертикально */}
                <div 
                  className="rounded-lg px-1 py-2 flex items-center justify-center transition-colors"
                  style={{ 
                    backgroundColor: '#0a0a14',
                    border: '1px solid transparent',
                    minWidth: '60px',
                    minHeight: '120px',
                  }}
                >
                  <span 
                    className="text-lg font-semibold tracking-wider whitespace-nowrap transition-colors"
                    style={{ 
                      writingMode: 'sideways-lr',
                      textOrientation: 'mixed',
                      color: '#6b7280',
                    }}
                  >
                    {nozzle.ProductRef}
                  </span>
                </div>

                {/* Цена */}
                <div className="text-center">
                  <div className={`text-xs font-mono font-bold transition-colors ${
                    isSelected ? 'text-[#ffd700]' : 'text-gray-400'
                  }`}>
                    {price.toFixed(2)} р/л
                  </div>
                </div>
              </button>
            );
          })}
      </div>
    </div>
  );
}
