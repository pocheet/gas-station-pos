// src/components/PaymentMethodSelector.tsx
import { useState, useRef, useEffect } from 'react';
import { PAYMENT_METHODS } from '../types/schemas';

interface PaymentMethodSelectorProps {
  value: number;
  onChange: (method: number) => void;
  disabled?: boolean;
  discountPercent: number | null;
  onDiscountClick?: () => void;
  onDiscountSelect: (percent: number) => void;
  onPaymentSettingsClick?: () => void;
}

const paymentMethods = [
  {
    id: PAYMENT_METHODS.CASH,
    label: 'Нал.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
  },
  {
    id: PAYMENT_METHODS.CASHLESS,
    label: 'Безнал.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
  },
];

const discountOptions = [3, 5, 7, 10];

export default function PaymentMethodSelector({ 
  value, 
  onChange, 
  disabled = false,
  discountPercent,
  onDiscountSelect,
  onPaymentSettingsClick,
}: PaymentMethodSelectorProps) {
  const [showDiscount, setShowDiscount] = useState(false);
  const discountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (discountRef.current && !discountRef.current.contains(event.target as Node)) {
        setShowDiscount(false);
      }
    };

    if (showDiscount) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDiscount]);

  const handleDiscountClick = () => {
    if (!disabled) {
      setShowDiscount(!showDiscount);
    }
  };

  const handleDiscountSelect = (percent: number) => {
    onDiscountSelect(percent);
    setShowDiscount(false);
  };

  return (
    <div className="mb-2">
      {/* Первый ряд: Нал. | Безнал. */}
      <div className="grid grid-cols-2 gap-2 mb-2">
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
              <div className={`self-end transition-colors ${
                isSelected ? 'text-[#00d4aa]' : 'text-gray-500'
              }`}>
                {method.icon}
              </div>
              <div>
                <div className={`text-xs font-medium transition-colors ${
                  isSelected ? 'text-[#00d4aa]' : 'text-gray-400'
                }`}>
                  {method.label}
                </div>
                <div className={`text-[10px] mt-0.5 transition-colors ${
                  isSelected ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Способ оплаты
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Второй ряд: Настройка оплаты | Топливная карта */}
      <div className="grid grid-cols-2 gap-2">
        {/* Кнопка Настройка оплаты (бывш. Техн.) */}
        <button
          onClick={onPaymentSettingsClick}
          disabled={disabled}
          className="relative flex flex-col justify-between h-[80px] p-3 rounded-lg 
                   transition-all duration-200 text-left
                   bg-[#0f3460]/20 border-2 border-transparent
                   hover:bg-[#16213e] hover:border-gray-600
                   disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <div className="self-end text-gray-500">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-400">Настройка</div>
            <div className="text-[10px] mt-0.5 text-gray-600">Оплаты</div>
          </div>
        </button>

        {/* Кнопка Топливная карта (бывш. Скидка) */}
        <div className="relative" ref={discountRef}>
          <button
            onClick={handleDiscountClick}
            disabled={disabled}
            className={`
              relative flex flex-col justify-between h-[80px] p-3 rounded-lg 
              transition-all duration-200 text-left w-full
              ${discountPercent !== null
                ? 'bg-[#0f3460]/20 border-2 border-[#ffa502]' 
                : 'bg-[#0f3460]/20 border-2 border-transparent hover:bg-[#16213e] hover:border-[#ffa502]'
              }
              disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
            `}
          >
            <div className={`self-end transition-colors ${
              discountPercent !== null ? 'text-[#ffa502]' : 'text-gray-500'
            }`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
            </div>
            <div>
              <div className={`text-xs font-medium transition-colors ${
                discountPercent !== null ? 'text-[#ffa502]' : 'text-gray-400'
              }`}>
                {discountPercent !== null ? `${discountPercent} %` : '0 %'}
              </div>
              <div className={`text-[10px] mt-0.5 transition-colors ${
                discountPercent !== null ? 'text-[#ffa502]' : 'text-gray-600'
              }`}>
                Топливная карта
              </div>
            </div>
          </button>

          {/* Попап выбора скидки */}
          {showDiscount && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a2e] border border-gray-700 rounded-lg p-2 z-50 shadow-xl">
              <div className="grid grid-cols-1 gap-1">
                {discountOptions.map(percent => (
                  <button
                    key={percent}
                    onClick={() => handleDiscountSelect(percent)}
                    className={`
                      py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200
                      ${discountPercent === percent
                        ? 'bg-[#ffa502]/20 border border-[#ffa502] text-[#ffa502]'
                        : 'bg-[#0a0a14] border border-transparent text-gray-300 hover:bg-[#16213e] hover:border-gray-600'
                      }
                    `}
                  >
                    {percent} %
                  </button>
                ))}
              </div>
              {discountPercent !== null && (
                <button
                  onClick={() => handleDiscountSelect(discountPercent)}
                  className="w-full mt-1 py-1.5 rounded-lg text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  Отменить скидку
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
