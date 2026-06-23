// src/components/PaymentMethodSelector.tsx
import { PAYMENT_METHODS } from '../types/schemas';

interface PaymentMethodSelectorProps {
  value: number;
  onChange: (method: number) => void;
  disabled?: boolean;
  onDiscountClick?: () => void;
}

const paymentMethods = [
  {
    id: PAYMENT_METHODS.TECHNOLOGICAL,
    label: 'Технологический',
    shortLabel: 'Техн.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
  },
  {
    id: PAYMENT_METHODS.CASH,
    label: 'Наличные',
    shortLabel: 'Нал.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
  },
  {
    id: PAYMENT_METHODS.CASHLESS,
    label: 'Безналичный',
    shortLabel: 'Безнал.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
  },
];

export default function PaymentMethodSelector({ 
  value, 
  onChange, 
  disabled = false,
  onDiscountClick,
}: PaymentMethodSelectorProps) {
  return (
    <div className="mb-2">
      
      {/* Сетка 2x3 */}
      <div className="grid grid-cols-2 gap-2">
        {/* Три кнопки способов оплаты */}
        {paymentMethods.map((method) => {
          const isSelected = value === method.id;
          
          return (
            <button
              key={method.id}
              onClick={() => !disabled && onChange(method.id)}
              disabled={disabled}
              className={`
                relative flex flex-col justify-between h-[80px] p-3 rounded-lg 
                transition-all duration-200 text-left
                ${isSelected 
                  ? 'bg-[#16213e] border-2 border-[#00d4aa]' 
                  : 'bg-[#0f3460]/20 border-2 border-transparent hover:bg-[#16213e] hover:border-gray-600'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {/* Иконка справа вверху */}
              <div className={`self-end transition-colors ${
                isSelected ? 'text-[#00d4aa]' : 'text-gray-500'
              }`}>
                {method.icon}
              </div>
              
              {/* Текст слева внизу */}
              <div>
                <div className={`text-xs font-medium transition-colors ${
                  isSelected ? 'text-[#00d4aa]' : 'text-gray-400'
                }`}>
                  {method.label}
                </div>
              </div>
            </button>
          );
        })}

        {/* Кнопка Скидка */}
        <button
          onClick={onDiscountClick}
          disabled={disabled}
          className="relative flex flex-col justify-between h-[80px] p-3 rounded-lg 
                   transition-all duration-200 text-left
                   bg-[#0f3460]/20 border-2 border-transparent 
                   hover:bg-[#16213e] hover:border-[#ffa502]
                   disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <div className="self-end text-[#ffa502]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M16 8l-8 8"/>
              <path d="M8.5 8.5h.01"/>
              <path d="M15.5 15.5h.01"/>
            </svg>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-400">
              Скидка
            </div>
            <div className="text-[10px] mt-0.5 text-gray-600">
              0 %
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
