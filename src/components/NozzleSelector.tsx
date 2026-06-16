// src/components/NozzleSelector.tsx
import type { NozzleConfig, Product, PumpValue } from '../types/schemas';

interface NozzleSelectorProps {
  nozzles: NozzleConfig[];
  products: Product[];
  pumpState?: PumpValue;
  selectedNozzle: number | null;
  onSelectNozzle: (number: number) => void;
}

export default function NozzleSelector({ 
  nozzles, 
  products, 
  pumpState,
  selectedNozzle, 
  onSelectNozzle 
}: NozzleSelectorProps) {
  const getProductPrice = (productRef: string) => {
    const nozzle = pumpState?.Nozzles.find(n => n.ProductRef === productRef);
    return nozzle?.DefaultPricePerUnit || 0;
  };

  return (
    <div className="mb-6">
      <div className="grid grid-cols-2 gap-2">
        {nozzles.map(nozzle => {
          const product = products.find(p => p.Name === nozzle.ProductRef);
          const price = getProductPrice(nozzle.ProductRef);
          const isSelected = selectedNozzle === nozzle.LogicalNumber;

          return (
            <button
              key={nozzle.LogicalNumber}
              onClick={() => onSelectNozzle(nozzle.LogicalNumber)}
              className={`
                p-4 rounded-lg text-left transition-all duration-200
                ${isSelected 
                  ? 'bg-[#00d4aa]/20 border-2 border-[#00d4aa]' 
                  : 'bg-[#1a1a2e] border-2 border-transparent hover:border-gray-600'
                }
              `}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-[#16213e] text-gray-300 px-2 py-0.5 rounded text-sm">
                  №{nozzle.PhysicalNumber}
                </span>
                <span className="text-white font-semibold">
                  {nozzle.ProductRef}
                </span>
              </div>
              <div className="text-[#ffd700] text-sm">
                {price} ₽/л
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
