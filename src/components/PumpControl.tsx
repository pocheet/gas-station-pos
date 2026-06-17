// src/components/PumpControl.tsx
import { useState } from 'react';
import { type Configuration, type EquipmentState, PUMP_STATUS } from '../types/schemas';
import { usePumpControl } from '../hooks/usePumpControl';
import NozzleSelector from './NozzleSelector';
import PresetKeyboard from './PresetKeyboard';
import TransactionInfo from './TransactionInfo';
import { Alert, Snackbar, Button } from '@mui/material';

interface PumpControlProps {
  pumpNumber: number | null;
  config?: Configuration;
  state?: EquipmentState;
}

export default function PumpControl({ pumpNumber, config, state }: PumpControlProps) {
  const [selectedNozzle, setSelectedNozzle] = useState<number | null>(null);
  const [presetMode, setPresetMode] = useState<'volume' | 'amount'>('volume');
  const [presetValue, setPresetValue] = useState('0');
  
  const { 
    startFueling, 
    isStarting, 
    resetTransaction, 
    isResetting, 
    error, 
    success,
    clearError,
    clearSuccess 
  } = usePumpControl();

  if (!pumpNumber) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-lg">
        Выберите ТРК для начала работы
      </div>
    );
  }

  const pump = state?.PumpValuesCollection.find(p => p.Number === pumpNumber);
  const pumpConfig = config?.Pumps.find(p => p.Number === pumpNumber);

  // Определяем статусы
  const isPumpReady = pump?.Status === PUMP_STATUS.OFF;
  const isPumpBusy = pump?.Status === PUMP_STATUS.BUSY || pump?.Status === PUMP_STATUS.BUSY_OVERFLOW;
  const canReset = pump?.Status === PUMP_STATUS.WAIT_OFF_REMAINDER || 
                   pump?.Status === PUMP_STATUS.WAIT_OFF_OVERFLOW || 
                   pump?.Status === PUMP_STATUS.WAIT_RESET;
  
  const hasActiveTransaction = pump?.Transaction && 
    pump.Transaction.TransactionId !== '00000000-0000-0000-0000-000000000000';

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

  const handleResetTransaction = () => {
    if (!pumpNumber || !pump) return;

    const transaction = pump.Transaction;
    
    resetTransaction({
      pumpNumber,
      amount: transaction.RealTimeAmount,
      pricePerUnit: transaction.PricePerUnit,
      emergencyReset: false,
    });
  };

  const handleEmergencyReset = () => {
    if (!pumpNumber) return;
    
    resetTransaction({
      pumpNumber,
      emergencyReset: true,
    });
  };

  const getStatusText = () => {
    if (!pump) return '';
    switch (pump.Status) {
      case PUMP_STATUS.OFF: return '✅ Готов к работе';
      case PUMP_STATUS.BUSY: return '⛽ Идет налив';
      case PUMP_STATUS.BUSY_OVERFLOW: return '⚠️ Перелив!';
      case PUMP_STATUS.WAIT_RESET: return '🔄 Ожидает сброса';
      case PUMP_STATUS.WAIT_OFF_REMAINDER: return '⏸️ Ожидает продолжения';
      case PUMP_STATUS.WAIT_OFF: return '⬆️ Повесьте пистолет';
      default: return '⏳ Обработка';
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Заголовок и статус */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">
          ТРК {pumpNumber}
        </h1>
        <span className="text-sm text-gray-400">
          {getStatusText()}
        </span>
      </div>

      {/* Если ТРК готова - показываем выбор пистолета и клавиатуру */}
      {isPumpReady && (
        <>
          <NozzleSelector
            nozzles={pumpConfig?.Nozzles || []}
            products={config?.Products || []}
            pumpState={pump}
            selectedNozzle={selectedNozzle}
            onSelectNozzle={setSelectedNozzle}
          />
          
          <PresetKeyboard
            mode={presetMode}
            value={presetValue}
            onModeChange={setPresetMode}
            onValueChange={setPresetValue}
            selectedNozzle={selectedNozzle}
            onStart={handleStartFueling}
            isStarting={isStarting}
            canStart={!!selectedNozzle && presetValue !== '0' && !isStarting}
            pricePerUnit={getSelectedNozzlePrice()}
          />
        </>
      )}

      {/* Если идет налив или требует сброса - показываем информацию и кнопки управления */}
      {(isPumpBusy || canReset || hasActiveTransaction) && (
        <TransactionInfo
          pump={pump!}
          pumpNumber={pumpNumber}
          onReset={handleResetTransaction}
          onEmergencyReset={handleEmergencyReset}
          isResetting={isResetting}
          canReset={canReset}
        />
      )}

      {/* Если ТРК занята другим процессом */}
      {!isPumpReady && !isPumpBusy && !canReset && !hasActiveTransaction && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <span className="text-6xl mb-4">⏳</span>
          <p className="text-lg">ТРК занята другим процессом</p>
          <p className="text-sm mt-2">Дождитесь завершения операции</p>
        </div>
      )}

      {/* Уведомления */}
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

      <Snackbar 
        open={!!success} 
        autoHideDuration={3000} 
        onClose={clearSuccess}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={clearSuccess} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </div>
  );
}
