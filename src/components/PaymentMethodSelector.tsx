// src/components/PaymentMethodSelector.tsx
import { PAYMENT_METHODS, PAYMENT_METHOD_LABELS } from '../types/schemas';

interface PaymentMethodSelectorProps {
  value: number;
  onChange: (method: number) => void;
  disabled?: boolean;
}

const methods = [
  {
    id: PAYMENT_METHODS.TECHNOLOGICAL,
    label: PAYMENT_METHOD_LABELS[PAYMENT_METHODS.TECHNOLOGICAL],
    icon: '⚙️',
    color: '#00d4aa',
  },
  {
    id: PAYMENT_METHODS.CASH,
    label: PAYMENT_METHOD_LABELS[PAYMENT_METHODS.CASH],
    icon: '💵',
    color: '#ffd700',
  },
  {
    id: PAYMENT_METHODS.CASHLESS,
    label: PAYMENT_METHOD_LABELS[PAYMENT_METHODS.CASHLESS],
    icon: '💳',
    color: '#60a5fa',
  },
];

export default function PaymentMethodSelector({ 
  value, 
  onChange, 
  disabled = false 
}: PaymentMethodSelectorProps) {
  return (
    <div className="mb-2">
      <div className="space-y-2">
        {methods.map((method) => {
          const isSelected = value === method.id;
          
          return (
            <button
              key={method.id}
              onClick={() => !disabled && onChange(method.id)}
              disabled={disabled}
              className={`
                w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                ${isSelected 
                  ? 'bg-opacity-20 border-2' 
                  : 'bg-[#0f3460]/20 border-2 border-transparent hover:bg-[#16213e]'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              style={isSelected ? {
                backgroundColor: `${method.color}15`,
                borderColor: method.color,
              } : {}}
            >
              <span className="text-xl">{method.icon}</span>
              
              <div className="flex-1 text-left">
                <div className={`font-semibold text-sm transition-colors ${
                  isSelected ? 'text-white' : 'text-gray-300'
                }`}>
                  {method.label}
                </div>
              </div>
              
              {isSelected && (
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: method.color }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
