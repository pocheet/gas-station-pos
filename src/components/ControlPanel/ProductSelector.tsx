// src/components/ControlPanel/ProductSelector.tsx
import React from 'react';
import type { Configuration } from '../../api/types';
import type { EquipmentState } from '../../api/types';
import { usePumpContext } from '../../context/PumpContext';
import './ProductSelector.css';

interface ProductSelectorProps {
  config: Configuration;
  state?: EquipmentState;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({ config, state }) => {
  const { selectedPump, selectedNozzle, selectNozzle } = usePumpContext();

  if (!selectedPump) return null;

  const pumpConfig = config.Pumps.find(p => p.Number === selectedPump);
  const pumpState = state?.PumpValuesCollection.find(p => p.Number === selectedPump);

  if (!pumpConfig) return null;

  const getProductColor = (productName: string): string => {
    const colorMap: Record<string, string> = {
      'АИ-92': '#4CAF50',
      'АИ-95': '#2196F3',
      'АИ-95+': '#9C27B0',
      'АИ-98': '#FF9800',
      'АИ-98+': '#F44336',
      'АИ-100+': '#E91E63',
      'Дизель': '#795548',
      'Дизель+': '#607D8B',
      'AdBlue': '#00BCD4',
    };
    return colorMap[productName] || '#6c7293';
  };

  return (
    <div className="product-selector">
      <h3>Выберите тип топлива</h3>
      <div className="product-grid">
        {pumpConfig.Nozzles.map((nozzle) => {
          const product = config.Products.find(p => p.Name === nozzle.ProductRef);
          const nozzleValue = pumpState?.Nozzles.find(
            n => n.Number === nozzle.LogicalNumber
          );
          const isSelected = selectedNozzle === nozzle.LogicalNumber;
          const productColor = getProductColor(nozzle.ProductRef);

          return (
            <button
              key={nozzle.LogicalNumber}
              className={`product-btn ${isSelected ? 'selected' : ''}`}
              onClick={() => selectNozzle(nozzle.LogicalNumber)}
              style={{
                '--product-color': productColor,
              } as React.CSSProperties}
            >
              <div 
                className="product-color-bar"
                style={{ backgroundColor: productColor }}
              />
              <div className="product-content">
                <div className="product-name">{nozzle.ProductRef}</div>
                <div className="product-details">
                  <span className="product-price">
                    {nozzleValue?.DefaultPricePerUnit || product?.DefaultPricePerUnit || 0} ₽/л
                  </span>
                  <span className="nozzle-badge">
                    Пистолет №{nozzle.PhysicalNumber}
                  </span>
                </div>
              </div>
              {isSelected && (
                <div className="selected-indicator">✓</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProductSelector;
