// src/pages/MainPage.tsx
import { useState, useEffect } from 'react';
import { useConfiguration } from '../hooks/useConfiguration';
import { useEquipmentState } from '../hooks/useEquipmentState';
import { usePumpControl } from '../hooks/usePumpControl';

import PumpSidebar from '../components/PumpSidebar';
import PumpControl from '../components/PumpControl';
import PresetKeyboard from '../components/PresetKeyboard';
import PaymentMethodSelector from '../components/PaymentMethodSelector';
import TopNavbar from '../components/TopNavbar';
import Footer from '../components/Footer';

import { PAYMENT_METHODS, type OrderItem } from '../types/schemas';

export default function MainPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [selectedPump, setSelectedPump] = useState<number | null>(null);
  const [selectedNozzle, setSelectedNozzle] = useState<number | null>(null);
  const [presetMode, setPresetMode] = useState<'volume' | 'amount'>('volume');
  const [presetValue, setPresetValue] = useState('0');
  const [payFormCode, setPayFormCode] = useState<number>(PAYMENT_METHODS.TECHNOLOGICAL);
  const [discountPercent, setDiscountPercent] = useState<number | null>(null);
  
  const { data: config } = useConfiguration();
  const { data: state } = useEquipmentState();
  const { startFueling, isStarting } = usePumpControl();

  const pump = state?.PumpValuesCollection.find(p => p.Number === selectedPump);

  const getSelectedNozzlePrice = (): number => {
    if (!selectedNozzle || !pump) return 0;
    const nozzle = pump.Nozzles.find(n => n.Number === selectedNozzle);
    const basePrice = nozzle?.DefaultPricePerUnit ?? 0;
    if (discountPercent) return basePrice * (1 - discountPercent / 100);
    return basePrice;
  };

  // Создаём/обновляем строку заказа при изменении пистолета, объёма или скидки
  useEffect(() => {
    if (!selectedPump || !selectedNozzle || presetValue === '0') return;

    const productName = pump?.Nozzles.find(n => n.Number === selectedNozzle)?.ProductRef || '—';
    const pricePerUnit = getSelectedNozzlePrice();
    const volume = parseFloat(presetValue);
    const totalAmount = volume * pricePerUnit;

    setOrders(prev => {
      // Ищем существующий заказ для этой ТРК
      const existingIndex = prev.findIndex(o => o.pumpNumber === selectedPump);
      
      const updatedOrder: OrderItem = {
        id: existingIndex >= 0 
          ? prev[existingIndex].id 
          : `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        pumpNumber: selectedPump,
        nozzleNumber: selectedNozzle,
        productName,
        volume,
        pricePerUnit,
        discountPercent,
        totalAmount,
        timestamp: new Date().toISOString(),
      };

      if (existingIndex >= 0) {
        // Обновляем существующую строку
        const updated = [...prev];
        updated[existingIndex] = updatedOrder;
        return updated;
      } else {
        // Добавляем новую строку
        return [...prev, updatedOrder];
      }
    });
  }, [selectedPump, selectedNozzle, presetValue, discountPercent]);

  // Сброс строки при смене ТРК
  const handleSelectPump = (num: number) => {
    setSelectedPump(num);
    setSelectedNozzle(null);
    setPresetValue('0');
  };

  const handleStartFueling = () => {
    if (!selectedNozzle || !selectedPump || presetValue === '0') return;

    startFueling({
      pumpNumber: selectedPump,
      nozzleNumber: selectedNozzle,
      pricePerUnit: getSelectedNozzlePrice(),
      value: parseFloat(presetValue),
      isValueAmount: presetMode === 'amount',
      payFormCode,
    });
  };

  const handleRemoveOrder = (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  return (
    <div className="h-screen flex flex-col bg-[#0a0a14]">
      <TopNavbar />
      
      <div className="flex flex-1 overflow-hidden">
        <PumpSidebar
          pumps={state?.PumpValuesCollection || []}
          selectedPump={selectedPump}
          onSelectPump={handleSelectPump}
          selectedNozzle={selectedNozzle}
          onSelectNozzle={setSelectedNozzle}
        />
        
        <main className="flex-1 p-5 overflow-auto">
          <PumpControl
            pumpNumber={selectedPump}
            config={config}
            state={state}
            selectedNozzle={selectedNozzle}
            orders={orders}
            removeOrder={handleRemoveOrder}
            onStart={handleStartFueling}
            isStarting={isStarting}
            canStart={!!selectedNozzle && selectedPump !== null && presetValue !== '0' && !isStarting}
            presetMode={presetMode}
            presetValue={presetValue}
            pricePerUnit={getSelectedNozzlePrice()}
            discountPercent={discountPercent}
          />
        </main>

        <aside className="w-[350px] bg-[#1a1a2e] overflow-y-auto border-l border-gray-700 p-4">
          <PaymentMethodSelector
            value={payFormCode}
            onChange={setPayFormCode}
            disabled={!pump || pump.Status !== 1}
            discountPercent={discountPercent}
            onDiscountSelect={(percent) => {
              setDiscountPercent(percent === discountPercent ? null : percent);
            }}
          />
          
          <PresetKeyboard
            mode={presetMode}
            value={presetValue}
            onModeChange={setPresetMode}
            onValueChange={setPresetValue}
            selectedNozzle={selectedNozzle}
            onStart={handleStartFueling}
            isStarting={isStarting}
            canStart={!!selectedNozzle && !!selectedPump && presetValue !== '0' && !isStarting}
            pricePerUnit={getSelectedNozzlePrice()}
            pumpStatus={pump?.Status}
          />
        </aside>
      </div>

      <Footer products={config?.Products} />
    </div>
  );
}
