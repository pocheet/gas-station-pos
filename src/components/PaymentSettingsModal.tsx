// src/components/PaymentSettingsModal.tsx
import { useState } from 'react';
import { type NozzleConfig } from '../types/schemas';

interface PaymentSettingsModalProps {
  open: boolean;
  onClose: () => void;
  nozzles: NozzleConfig[];
}

type PaymentMode = 'postpay' | 'prepay';

export default function PaymentSettingsModal({ open, onClose, nozzles }: PaymentSettingsModalProps) {
  const [modes, setModes] = useState<Record<number, PaymentMode>>({});

  if (!open) return null;

  const handleModeChange = (nozzleNumber: number, mode: PaymentMode) => {
    setModes(prev => ({ ...prev, [nozzleNumber]: mode }));
  };

  const handleSave = () => {
    // TODO: сохранить настройки через API
    console.log('Сохраняем режимы оплаты:', modes);
    onClose();
  };

  const handleCancel = () => {
    setModes({});
    onClose();
  };

  const sortedNozzles = [...nozzles].sort((a, b) => a.LogicalNumber - b.LogicalNumber);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Затемнение фона */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleCancel}
      />

      {/* Модальное окно */}
      <div className="relative bg-[#1a1a2e] border border-[#2a2a45] rounded-2xl shadow-2xl w-full max-w-md mx-4">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-5 border-b border-[#2a2a45]">
          <h2 className="text-lg font-semibold text-[#e8e8f0]">Настройка режимов оплаты</h2>
          <button
            onClick={handleCancel}
            className="text-[#6c7293] hover:text-[#e8e8f0] transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Список топлива */}
        <div className="p-5 space-y-4">
          {sortedNozzles.map(nozzle => {
            const currentMode = modes[nozzle.LogicalNumber] || 'postpay';
            
            return (
              <div key={nozzle.LogicalNumber} className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#d1d5db]">
                  {nozzle.ProductRef}
                </span>
                
                <div className="flex items-center gap-4">
                  {/* Постоплата */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`payment-mode-${nozzle.LogicalNumber}`}
                      checked={currentMode === 'postpay'}
                      onChange={() => handleModeChange(nozzle.LogicalNumber, 'postpay')}
                      className="w-4 h-4 accent-[#00d4aa] cursor-pointer"
                    />
                    <span className={`text-xs font-medium transition-colors ${
                      currentMode === 'postpay' ? 'text-[#00d4aa]' : 'text-[#6c7293]'
                    }`}>
                      Постоплата
                    </span>
                  </label>

                  {/* Предоплата */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`payment-mode-${nozzle.LogicalNumber}`}
                      checked={currentMode === 'prepay'}
                      onChange={() => handleModeChange(nozzle.LogicalNumber, 'prepay')}
                      className="w-4 h-4 accent-[#00d4aa] cursor-pointer"
                    />
                    <span className={`text-xs font-medium transition-colors ${
                      currentMode === 'prepay' ? 'text-[#00d4aa]' : 'text-[#6c7293]'
                    }`}>
                      Предоплата
                    </span>
                  </label>
                </div>
              </div>
            );
          })}
        </div>

        {/* Кнопки */}
        <div className="p-5 border-t border-[#2a2a45]">
          <button
            onClick={handleSave}
            className="w-full py-3 bg-[#00d4aa] text-black font-semibold rounded-xl
                     hover:bg-[#00b894] active:bg-[#00a382] transition-colors"
          >
            Сохранить
          </button>
          <button
            onClick={handleCancel}
            className="w-full mt-2 py-2 text-sm text-[#6c7293] hover:text-[#9ca3af] transition-colors"
          >
            Отменить
          </button>
        </div>
      </div>
    </div>
  );
}
