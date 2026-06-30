// src/components/PriceSettingsModal.tsx
import { useState } from 'react';
import { type Product } from '../types/schemas';

interface PriceSettingsModalProps {
  open: boolean;
  onClose: () => void;
  products: Product[];
}

export default function PriceSettingsModal({ open, onClose, products }: PriceSettingsModalProps) {
  const [prices, setPrices] = useState<Record<string, string>>({});

  if (!open) return null;

  const handlePriceChange = (productName: string, value: string) => {
    // Разрешаем только числа с точкой
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setPrices(prev => ({ ...prev, [productName]: value }));
    }
  };

  const handleSave = () => {
    // TODO: сохранить цены через API
    console.log('Сохраняем цены:', prices);
    onClose();
  };

  const handleCancel = () => {
    setPrices({});
    onClose();
  };

  // Сортируем продукты по названию
  const sortedProducts = [...products].sort((a, b) => a.Name.localeCompare(b.Name));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Затемнение фона */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleCancel}
      />

      {/* Модальное окно */}
      <div className="relative bg-[#1a1a2e] border border-[#2a2a45] rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-5 border-b border-[#2a2a45]">
          <h2 className="text-lg font-semibold text-[#e8e8f0]">Настройка цен</h2>
          <button
            onClick={handleCancel}
            className="text-[#6c7293] hover:text-[#e8e8f0] transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Список продуктов */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {sortedProducts.map(product => {
            const currentPrice = prices[product.Name] ?? product.DefaultPricePerUnit.toString();
            
            return (
              <div key={product.Id} className="flex items-center gap-3">
                {/* Название продукта */}
                <div className="w-28 flex-shrink-0">
                  <span className="text-sm font-medium text-[#d1d5db] truncate block">
                    {product.Name}
                  </span>
                </div>

                {/* Поле ввода */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={currentPrice}
                    onChange={(e) => handlePriceChange(product.Name, e.target.value)}
                    className="w-full bg-[#0a0a14] border border-[#2a2a45] rounded-lg px-3 py-2 
                             text-right text-sm font-mono text-[#e8e8f0]
                             focus:outline-none focus:border-[#00d4aa] focus:ring-1 focus:ring-[#00d4aa]/30
                             placeholder-[#4b5563] transition-colors"
                    placeholder="0.00"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Кнопки */}
        <div className="p-5 border-t border-[#2a2a45]">
          <button
            onClick={handleSave}
            className="w-full py-3 bg-[#00d4aa] text-black font-semibold rounded-lg
                     hover:bg-[#00b894] active:bg-[#00a382] transition-colors"
          >
            Сохранить
          </button>
          <button
            onClick={handleCancel}
            className="w-full mt-2 py-2 text-sm text-[#6c7293] hover:text-[#9ca3af] transition-colors"
          >
            Отмена
          </button>
        </div>
      </div>

      {/* Стили скроллбара */}
      <style>{`
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #0a0a14;
          border-radius: 3px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #2a2a45;
          border-radius: 3px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #3d3d6b;
        }
      `}</style>
    </div>
  );
}
