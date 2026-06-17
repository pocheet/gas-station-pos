// src/components/PumpControl.tsx
import { useState } from 'react';
import type { Configuration, EquipmentState } from '../types/schemas';
import { usePumpControl } from '../hooks/usePumpControl';
import NozzleSelector from './NozzleSelector';
import PresetKeyboard from './PresetKeyboard';
import { Alert, Snackbar } from '@mui/material';

interface PumpControlProps {
  pumpNumber: number | null;
  config?: Configuration;
  state?: EquipmentState;
}

export default function PumpControl({ pumpNumber, config, state }: PumpControlProps) {
  const [selectedNozzle, setSelectedNozzle] = useState<number | null>(null);
  const [presetMode, setPresetMode] = useState<'volume' | 'amount'>('volume');
  const [presetValue, setPresetValue] = useState('0');
  
  const { startFueling, isStarting, error, clearError } = usePumpControl();

  if (!pumpNumber) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-lg">
        Выберите ТРК для начала работы
      </div>
    );
  }

  const pump = state?.PumpValuesCollection.find(p => p.Number === pumpNumber);
  const pumpConfig = config?.Pumps.find(p => p.Number === pumpNumber);

  // Получаем цену выбранного топлива
  const getSelectedNozzlePrice = (): number => {
    if (!selectedNozzle || !pump) return 0;
    const nozzle = pump.Nozzles.find(n => n.Number === selectedNozzle);
    return nozzle?.DefaultPricePerUnit ?? 0;
  };

  const handleStartFueling = () => {
    if (!selectedNozzle || !pumpNumber || presetValue === '0') return;

    const pricePerUnit = getSelectedNozzlePrice();
    const value = parseFloat(presetValue);
    const isValueAmount = presetMode === 'amount';

    startFueling({
      pumpNumber,
      nozzleNumber: selectedNozzle,
      pricePerUnit,
      value,
      isValueAmount,
    });
  };

  const isPumpReady = pump?.Status === 1; // Статус "Off" - готов к работе
  const canStart = selectedNozzle && presetValue !== '0' && isPumpReady && !isStarting;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">
        ТРК {pumpNumber}
        <span className="text-sm font-normal text-gray-400 ml-3">
          {isPumpReady ? '✅ Готов к работе' : '⏳ Занята'}
        </span>
      </h1>
      
      <NozzleSelector
        nozzles={pumpConfig?.Nozzles || []}
        products={config?.Products || []}
        pumpState={pump}
        selectedNozzle={selectedNozzle}
        onSelectNozzle={setSelectedNozzle}
      />
      
      {isPumpReady && <PresetKeyboard
        mode={presetMode}
        value={presetValue}
        onModeChange={setPresetMode}
        onValueChange={setPresetValue}
        selectedNozzle={selectedNozzle}
        onStart={handleStartFueling}
        isStarting={isStarting}
        canStart={canStart}
        pricePerUnit={getSelectedNozzlePrice()}
      />}

      {/* Показываем ошибку если есть */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={clearError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={clearError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      {/* Показываем информацию о текущей транзакции */}
      {pump?.Transaction && pump.Transaction.TransactionId !== '00000000-0000-0000-0000-000000000000' && (
        <div className="mt-6 p-4 bg-[#1a1a2e] rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">Текущая транзакция</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-gray-400 text-sm">Объем:</span>
              <div className="text-[#00d4aa] font-mono text-xl">
                {pump.Transaction.RealTimeVolume.toFixed(2)} л
              </div>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Сумма:</span>
              <div className="text-[#ffd700] font-mono text-xl">
                {pump.Transaction.RealTimeAmount.toFixed(2)} ₽
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
