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
    label: 'Наличный',
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

const discountOptions = [3, 5, 7, 10];

export default function PaymentMethodSelector({ 
  value, 
  onChange, 
  disabled = false,
  discountPercent,
  onDiscountSelect,
}: PaymentMethodSelectorProps) {
  const [showPayment, setShowPayment] = useState(false);
  const [showDiscount, setShowDiscount] = useState(false);
  const paymentRef = useRef<HTMLDivElement>(null);
  const discountRef = useRef<HTMLDivElement>(null);

  const selectedMethod = paymentMethods.find(m => m.id === value) || paymentMethods[0];

  // Закрываем попапы при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (paymentRef.current && !paymentRef.current.contains(event.target as Node)) {
        setShowPayment(false);
      }
      if (discountRef.current && !discountRef.current.contains(event.target as Node)) {
        setShowDiscount(false);
      }
    };

    if (showPayment || showDiscount) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPayment, showDiscount]);

  const handlePaymentClick = () => {
    if (!disabled) {
      setShowDiscount(false);
      setShowPayment(!showPayment);
    }
  };

  const handlePaymentSelect = (methodId: number) => {
    onChange(methodId);
    setShowPayment(false);
  };

  const handleDiscountClick = () => {
    if (!disabled) {
      setShowPayment(false);
      setShowDiscount(!showDiscount);
    }
  };

  const handleDiscountSelect = (percent: number) => {
    onDiscountSelect(percent);
    setShowDiscount(false);
  };

  return (
    <div className="mb-2">
      <div className="grid grid-cols-2 gap-2">
        {/* Кнопка Способ оплаты с попапом */}
        <div className="relative" ref={paymentRef}>
          <button
            onClick={handlePaymentClick}
            disabled={disabled}
            className={`
              relative flex flex-col justify-between h-[80px] p-3 rounded-lg 
              transition-all duration-200 text-left w-full
              bg-[#0f3460]/20 border-2 border-transparent
              hover:bg-[#16213e] hover:border-gray-600
              disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
            `}
          >
            <div className="self-end text-gray-500">
              {selectedMethod.icon}
            </div>
            <div>
              <div className="text-xs font-medium text-gray-400">
                {selectedMethod.label}
              </div>
              <div className="text-[10px] mt-0.5 text-gray-600">
                Способ оплаты
              </div>
            </div>
          </button>

          {/* Попап выбора способа оплаты */}
          {showPayment && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a2e] border border-gray-700 rounded-lg p-2 z-50 shadow-xl">
              <div className="grid grid-cols-1 gap-1">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => handlePaymentSelect(method.id)}
                    className={`
                      flex items-center gap-3 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200
                      ${value === method.id
                        ? 'bg-[#00d4aa]/20 border border-[#00d4aa] text-[#00d4aa]'
                        : 'bg-[#0a0a14] border border-transparent text-gray-300 hover:bg-[#16213e] hover:border-gray-600'
                      }
                    `}
                  >
                    {/* <span className={value === method.id ? 'text-[#00d4aa]' : 'text-gray-500'}>
                      {method.icon}
                    </span> */}
                    <span>{method.shortLabel}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Кнопка Скидка с попапом */}
        <div className="relative" ref={discountRef}>
          <button
            onClick={handleDiscountClick}
            disabled={disabled}
            className={`
              relative flex flex-col justify-between h-[80px] p-3 rounded-lg 
              transition-all duration-200 text-left w-full
              bg-[#0f3460]/20 border-2 border-transparent hover:bg-[#16213e] hover:border-gray-600
              disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
            `}
          >
            <div className={`self-end transition-colors text-gray-500`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M16 8l-8 8"/>
                <path d="M8.5 8.5h.01"/>
                <path d="M15.5 15.5h.01"/>
              </svg>
            </div>
            <div>
              <div className={`text-xs font-medium transition-colors ${
                discountPercent !== null ? 'text-[#ffa502]' : 'text-gray-400'
              }`}>
                {discountPercent !== null ? `${discountPercent} %` : '0 %'}
              </div>
              <div className={`text-[10px] mt-0.5 transition-colors ${
                discountPercent !== null ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Скидка
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
