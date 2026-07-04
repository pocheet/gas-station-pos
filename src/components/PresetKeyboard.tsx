// src/components/PresetKeyboard.tsx
import { CircularProgress } from '@mui/material';
import { PUMP_STATUS } from '../types/schemas';

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
  pumpStatus?: number;
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
  pumpStatus,
}: PresetKeyboardProps) {
  const isPumpReady = pumpStatus === PUMP_STATUS.OFF;
  const displayColor = mode === 'volume' ? '#00d4aa' : '#ffd700';

  const handleKeyPress = (key: string) => {
    if (!isPumpReady) return;
    if (value === '0' && key !== '.' && key !== '00') {
      onValueChange(key);
    } else if (key === '.' && value.includes('.')) {
      return;
    } else if (key === '00') {
      onValueChange(value === '0' ? '0' : value + '00');
    } else {
      onValueChange(value + key);
    }
  };

  const handleBackspace = () => {
    if (!isPumpReady) return;
    onValueChange(value.slice(0, -1) || '0');
  };

  const handleClear = () => {
    if (!isPumpReady) return;
    onValueChange('0');
  };

  const calculatedValue = pricePerUnit > 0 && value !== '0'
    ? mode === 'volume'
      ? (parseFloat(value) * pricePerUnit).toFixed(2)
      : (parseFloat(value) / pricePerUnit).toFixed(2)
    : null;

  const btnBase = `
    aspect-square rounded-2xl font-semibold
    transition-all duration-200 
    disabled:opacity-50 disabled:cursor-not-allowed
    flex items-center justify-center
  `;

  return (
    <div className="bg-[#1a1a2e] rounded-lg">
      {/* Display */}
      <div className="bg-[#0a0a14] rounded-2xl p-4 mb-4 min-h-[100px] flex flex-col justify-center">
        <div className="text-center">
          <span 
            className="text-4xl font-mono font-bold transition-colors duration-300"
            style={{ color: isPumpReady ? displayColor : '#4b5563' }}
          >
            {value}
          </span>
          <span className="text-xl text-gray-400 ml-2">
            {mode === 'volume' ? 'л' : '₽'}
          </span>
        </div>
        <div className="text-center mt-2 h-5">
          {calculatedValue && isPumpReady ? (
            <span className="text-sm text-gray-400">
              ≈ {calculatedValue} {mode === 'volume' ? '₽' : 'л'}
            </span>
          ) : (
            <span className="text-sm text-gray-600">—</span>
          )}
        </div>
      </div>

      {/* Keyboard */}
      <div className="grid grid-cols-4 gap-2">
        {/* Ряд 1: Esc, C, ← (сдвоенная) */}
        <button
          onClick={() => {}}
          disabled
          className={`${btnBase} bg-[#16213e] text-gray-600 text-sm cursor-not-allowed`}
        >
          Esc
        </button>
        <button
          onClick={handleClear}
          disabled={isStarting || !isPumpReady}
          className={`${btnBase} bg-[#ff4757] text-white text-lg hover:bg-[#ff4757]/80 active:bg-[#ff4757]/60`}
        >
          C
        </button>
        <button
          onClick={handleBackspace}
          disabled={isStarting || !isPumpReady}
          className={`${btnBase} col-span-2 bg-[#ffa502] text-white text-xl hover:bg-[#ffa502]/80 active:bg-[#ffa502]/60`}
          style={{ aspectRatio: 'auto' }}
        >
          ←
        </button>

        {/* Ряд 2: 7, 8, 9, Объем */}
        {['7', '8', '9'].map(num => (
          <button
            key={num}
            onClick={() => handleKeyPress(num)}
            disabled={isStarting || !isPumpReady}
            className={`${btnBase} bg-[#0f3460] text-white text-xl hover:bg-[#0f3460]/80 active:bg-[#0f3460]/60`}
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => isPumpReady && onModeChange('volume')}
          disabled={!isPumpReady}
          className={`${btnBase} text-xs font-medium ${
            mode === 'volume' 
              ? 'bg-[#00d4aa] text-black' 
              : 'bg-[#16213e] text-gray-400 hover:bg-[#0f3460]'
          }`}
        >
          Объем
        </button>

        {/* Ряд 3: 4, 5, 6, Цена */}
        {['4', '5', '6'].map(num => (
          <button
            key={num}
            onClick={() => handleKeyPress(num)}
            disabled={isStarting || !isPumpReady}
            className={`${btnBase} bg-[#0f3460] text-white text-xl hover:bg-[#0f3460]/80 active:bg-[#0f3460]/60`}
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => isPumpReady && onModeChange('amount')}
          disabled={!isPumpReady}
          className={`${btnBase} text-xs font-medium ${
            mode === 'amount' 
              ? 'bg-[#ffd700] text-black' 
              : 'bg-[#16213e] text-gray-400 hover:bg-[#0f3460]'
          }`}
        >
          Сумма
        </button>

        {/* Ряд 4: 1, 2, 3 + Ввод */}
        {['1', '2', '3'].map(num => (
          <button
            key={num}
            onClick={() => handleKeyPress(num)}
            disabled={isStarting || !isPumpReady}
            className={`${btnBase} bg-[#0f3460] text-white text-xl hover:bg-[#0f3460]/80 active:bg-[#0f3460]/60`}
          >
            {num}
          </button>
        ))}
        <button
          onClick={onStart}
          disabled={!canStart || isStarting || !isPumpReady}
          className={`${btnBase} row-span-2 bg-[#00d4aa] text-black text-base font-bold
                   hover:bg-[#00b894] active:bg-[#00a382]`}
          style={{ aspectRatio: 'auto' }}
        >
          {isStarting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Ввод'
          )}
        </button>

        {/* Ряд 5: 0, 00, "," */}
        <button
          onClick={() => handleKeyPress('0')}
          disabled={isStarting || !isPumpReady}
          className={`${btnBase} bg-[#0f3460] text-white text-xl hover:bg-[#0f3460]/80 active:bg-[#0f3460]/60`}
        >
          0
        </button>
        <button
          onClick={() => handleKeyPress('00')}
          disabled={isStarting || !isPumpReady}
          className={`${btnBase} bg-[#0f3460] text-white text-lg hover:bg-[#0f3460]/80 active:bg-[#0f3460]/60`}
        >
          00
        </button>
        <button
          onClick={() => handleKeyPress('.')}
          disabled={isStarting || !isPumpReady}
          className={`${btnBase} bg-[#0f3460] text-white text-xl hover:bg-[#0f3460]/80 active:bg-[#0f3460]/60`}
        >
          ,
        </button>
      </div>

      {/* Статус */}
      <div className="mt-4 text-center text-xs">
        {!selectedNozzle && isPumpReady ? (
          <span className="text-[#ffa502]">Выберите топливо</span>
        ) : value === '0' && isPumpReady ? (
          <span className="text-[#ffa502]">Укажите {mode === 'volume' ? 'объем' : 'сумму'}</span>
        ) : canStart ? (
          <span className="text-[#00d4aa]">Готов к запуску</span>
        ) : !isPumpReady ? (
          <span className="text-gray-500">Клавиатура заблокирована</span>
        ) : null}
      </div>
    </div>
  );
}
