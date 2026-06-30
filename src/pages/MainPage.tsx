// src/pages/MainPage.tsx
import { useState } from 'react';
import { useConfiguration } from '../hooks/useConfiguration';
import { useEquipmentState } from '../hooks/useEquipmentState';
import { usePumpControl } from '../hooks/usePumpControl';
import PumpSidebar from '../components/PumpSidebar';
import PumpControl from '../components/PumpControl';
import PresetKeyboard from '../components/PresetKeyboard';
import PaymentMethodSelector from '../components/PaymentMethodSelector';
import TopNavbar from '../components/TopNavbar';
import { PAYMENT_METHODS } from '../types/schemas';

export default function MainPage() {
  const [selectedPump, setSelectedPump] = useState<number | null>(null);
  const [selectedNozzle, setSelectedNozzle] = useState<number | null>(null);
  const [presetMode, setPresetMode] = useState<'volume' | 'amount'>('volume');
  const [presetValue, setPresetValue] = useState('0');
  const [payFormCode, setPayFormCode] = useState<number>(PAYMENT_METHODS.TECHNOLOGICAL);
  const [discountPercent, setDiscountPercent] = useState<number | null>(null);
  
  const { data: config } = useConfiguration();
  const { data: state } = useEquipmentState();
  
  const { 
    startFueling, 
    isStarting,
  } = usePumpControl();

  const pump = state?.PumpValuesCollection.find(p => p.Number === selectedPump);
  
  // const getSelectedNozzlePrice = (): number => {
  //   if (!selectedNozzle || !pump) return 0;
  //   const nozzle = pump.Nozzles.find(n => n.Number === selectedNozzle);
  //   return nozzle?.DefaultPricePerUnit ?? 0;
  // };

  const getSelectedNozzlePrice = (): number => {
    if (!selectedNozzle || !pump) return 0;
    const nozzle = pump.Nozzles.find(n => n.Number === selectedNozzle);
    const basePrice = nozzle?.DefaultPricePerUnit ?? 0;
    
    // Применяем скидку к цене
    if (discountPercent) {
      return basePrice * (1 - discountPercent / 100);
    }
    return basePrice;
  };

  const handleStartFueling = () => {
    if (!selectedNozzle || !selectedPump || presetValue === '0') return;

    const pricePerUnit = getSelectedNozzlePrice();
    const value = parseFloat(presetValue);
    const isValueAmount = presetMode === 'amount';

    startFueling({
      pumpNumber: selectedPump,
      nozzleNumber: selectedNozzle,
      pricePerUnit,
      value,
      isValueAmount,
      payFormCode,
    });
  };

  return (
    <div className="h-screen flex flex-col bg-[#0a0a14]">
      <TopNavbar />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Левая панель - список ТРК */}
        <PumpSidebar
          pumps={state?.PumpValuesCollection || []}
          selectedPump={selectedPump}
          onSelectPump={(num) => {
            setSelectedPump(num);
            setSelectedNozzle(null);
            setPresetValue('0');
          }}
        />
        
        {/* Центр - контент */}
        <main className="flex-1 p-5 overflow-auto">
          <PumpControl
            pumpNumber={selectedPump}
            config={config}
            state={state}
            selectedNozzle={selectedNozzle}
            onSelectNozzle={setSelectedNozzle}
          />
        </main>

        {/* Правая панель - клавиатура и способ оплаты */}
        <aside className="w-[350px] bg-[#1a1a2e] overflow-y-auto border-l border-gray-700 p-4">
          <PaymentMethodSelector
            value={payFormCode}
            onChange={setPayFormCode}
            disabled={!pump || pump.Status !== 1}
            discountPercent={discountPercent}
            onDiscountClick={() => {
              // Ничего не делаем — попап управляется внутри
            }}
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
    </div>
  );
}
