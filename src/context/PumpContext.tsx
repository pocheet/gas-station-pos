// src/context/PumpContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';

interface PumpContextType {
  selectedPump: number | null;
  selectedNozzle: number | null;
  presetMode: 'volume' | 'amount';
  presetValue: string;
  selectPump: (pumpNumber: number) => void;
  selectNozzle: (nozzleNumber: number) => void;
  setPresetMode: (mode: 'volume' | 'amount') => void;
  setPresetValue: (value: string) => void;
  resetSelection: () => void;
}

const PumpContext = createContext<PumpContextType | undefined>(undefined);

export const PumpProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedPump, setSelectedPump] = useState<number | null>(null);
  const [selectedNozzle, setSelectedNozzle] = useState<number | null>(null);
  const [presetMode, setPresetMode] = useState<'volume' | 'amount'>('volume');
  const [presetValue, setPresetValue] = useState<string>('');

  const selectPump = useCallback((pumpNumber: number) => {
    setSelectedPump(pumpNumber);
    setSelectedNozzle(null);
    setPresetValue('');
  }, []);

  const selectNozzle = useCallback((nozzleNumber: number) => {
    setSelectedNozzle(nozzleNumber);
  }, []);

  const resetSelection = useCallback(() => {
    setSelectedPump(null);
    setSelectedNozzle(null);
    setPresetValue('');
  }, []);

  return (
    <PumpContext.Provider value={{
      selectedPump,
      selectedNozzle,
      presetMode,
      presetValue,
      selectPump,
      selectNozzle,
      setPresetMode,
      setPresetValue,
      resetSelection,
    }}>
      {children}
    </PumpContext.Provider>
  );
};

export const usePumpContext = () => {
  const context = useContext(PumpContext);
  if (!context) {
    throw new Error('usePumpContext must be used within PumpProvider');
  }
  return context;
};
