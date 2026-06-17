// src/components/PresetKeyboard.tsx
import { CircularProgress } from '@mui/material';

interface PresetKeyboardProps {
  mode: 'volume' | 'amount';
  value: string;
  onModeChange: (mode: 'volume' | 'amount') => void;
  onValueChange: (value: string) => void;
  selectedNozzle: number | null;
  onStart?: () => void;
  isStarting?: boolean;
  canStart?: boolean;
  pricePerUnit?: number;
}

export default function PresetKeyboard({
  mode,
  value,
  onModeChange,
  onValueChange,
  selectedNozzle,
  onStart,
  isStarting = false,
  canStart = false,
  pricePerUnit = 0,
}: PresetKeyboardProps) {
  const quickVolumes = [10, 15, 20, 30, 40];
  const quickAmounts = [100, 500, 1000, 2000, 5000];
  const quickValues = mode === 'volume' ? quickVolumes : quickAmounts;

  const handleKeyPress = (key: string) => {
    if (value === '0' && key !== '.') {
      onValueChange(key);
    } else if (key === '.' && value.includes('.')) {
      return; // Не даем ввести вторую точку
    } else {
      onValueChange(value + key);
    }
  };

  const handleBackspace = () => {
    onValueChange(value.slice(0, -1) || '0');
  };

  const handleClear = () => {
    onValueChange('0');
  };

  // Расчет предполагаемой суммы/объема
  const calculatedValue = pricePerUnit > 0 && value !== '0'
    ? mode === 'volume'
      ? (parseFloat(value) * pricePerUnit).toFixed(2)
      : (parseFloat(value) / pricePerUnit).toFixed(2)
    : null;

  return (
    <div className="bg-[#1a1a2e] rounded-lg p-4">
      {/* Display */}
      <div className="bg-[#0a0a14] rounded-lg p-4 mb-4">
        <div className="text-center">
          <span className="text-4xl font-mono text-[#00d4aa] font-bold">
            {value}
          </span>
          <span className="text-xl text-gray-400 ml-2">
            {mode === 'volume' ? 'л' : '₽'}
          </span>
        </div>
        {calculatedValue && (
          <div className="text-center mt-2 text-sm text-gray-400">
            ≈ {calculatedValue} {mode === 'volume' ? '₽' : 'л'}
          </div>
        )}
      </div>

      {/* Mode tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => onModeChange('volume')}
          className={`flex-1 py-2 rounded-lg font-medium transition-colors
            ${mode === 'volume' 
              ? 'bg-[#00d4aa] text-black' 
              : 'bg-[#16213e] text-gray-300 hover:bg-[#0f3460]'
            }`}
        >
          Объем
        </button>
        <button
          onClick={() => onModeChange('amount')}
          className={`flex-1 py-2 rounded-lg font-medium transition-colors
            ${mode === 'amount' 
              ? 'bg-[#00d4aa] text-black' 
              : 'bg-[#16213e] text-gray-300 hover:bg-[#0f3460]'
            }`}
        >
          Сумма
        </button>
      </div>

      {/* Numeric keyboard */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {['7', '8', '9', '4', '5', '6', '1', '2', '3'].map(num => (
          <button
            key={num}
            onClick={() => handleKeyPress(num)}
            disabled={isStarting}
            className="py-3 bg-[#0f3460] text-white rounded-lg text-xl font-semibold
                     hover:bg-[#0f3460]/80 active:bg-[#0f3460]/60 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors"
          >
            {num}
          </button>
        ))}
        <button
          onClick={handleBackspace}
          disabled={isStarting}
          className="py-3 bg-[#ffa502] text-white rounded-lg text-xl font-semibold
                   hover:bg-[#ffa502]/80 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors"
        >
          ←
        </button>
        <button
          onClick={() => handleKeyPress('0')}
          disabled={isStarting}
          className="py-3 bg-[#0f3460] text-white rounded-lg text-xl font-semibold
                   hover:bg-[#0f3460]/80 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors"
        >
          0
        </button>
        <button
          onClick={() => handleKeyPress('.')}
          disabled={isStarting}
          className="py-3 bg-[#0f3460] text-white rounded-lg text-xl font-semibold
                   hover:bg-[#0f3460]/80 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors"
        >
          .
        </button>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          onClick={handleClear}
          disabled={isStarting}
          className="py-3 bg-[#ff4757] text-white rounded-lg text-lg font-semibold
                   hover:bg-[#ff4757]/80 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors"
        >
          C
        </button>
        <button
          onClick={onStart}
          disabled={!canStart || isStarting}
          className="py-3 bg-[#00d4aa] text-black rounded-lg text-lg font-semibold
                   hover:bg-[#00d4aa]/80 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors flex items-center justify-center gap-2"
        >
          {isStarting ? (
            <>
              <CircularProgress size={20} color="inherit" />
              <span>Запуск...</span>
            </>
          ) : (
            '⛽ Ввод'
          )}
        </button>
      </div>

      {/* Quick values */}
      <div className="grid grid-cols-2 gap-2">
        {quickValues.map(qv => (
          <button
            key={qv}
            onClick={() => onValueChange(qv.toString())}
            disabled={isStarting}
            className="py-2 border border-gray-600 text-gray-300 rounded-lg
                     hover:bg-[#16213e] hover:border-[#00d4aa] hover:text-white
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 text-sm"
          >
            {mode === 'volume' ? `${qv} л.` : `+${qv} руб.`}
          </button>
        ))}
      </div>

      {/* Статус выбора */}
      <div className="mt-4 text-center text-sm">
        {!selectedNozzle ? (
          <span className="text-[#ffa502]">⚠️ Выберите тип топлива</span>
        ) : value === '0' ? (
          <span className="text-[#ffa502]">⚠️ Укажите объем или сумму</span>
        ) : canStart ? (
          <span className="text-[#00d4aa]">✅ Готов к запуску</span>
        ) : (
          <span className="text-[#ff4757]">❌ ТРК не готова к работе</span>
        )}
      </div>
    </div>
  );
}
