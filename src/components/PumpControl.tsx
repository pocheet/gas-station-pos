// src/components/PumpControl.tsx
import { useState } from 'react';
import type { Configuration, EquipmentState } from '../types/schemas';
import NozzleSelector from './NozzleSelector';
import PresetKeyboard from './PresetKeyboard';

interface PumpControlProps {
  pumpNumber: number | null;
  config?: Configuration;
  state?: EquipmentState;
}

export default function PumpControl({ pumpNumber, config, state }: PumpControlProps) {
  const [selectedNozzle, setSelectedNozzle] = useState<number | null>(null);
  const [presetMode, setPresetMode] = useState<'volume' | 'amount'>('volume');
  const [presetValue, setPresetValue] = useState('0');

  if (!pumpNumber) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-lg">
        Выберите ТРК для начала работы
      </div>
    );
  }

  const pump = state?.PumpValuesCollection.find(p => p.Number === pumpNumber);
  const pumpConfig = config?.Pumps.find(p => p.Number === pumpNumber);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">
        ТРК {pumpNumber}
      </h1>
      
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
      />
    </div>
  );
}
