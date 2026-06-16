// src/pages/MainPage.tsx
import { useState } from 'react';
import { useConfiguration } from '../hooks/useConfiguration';
import { useEquipmentState } from '../hooks/useEquipmentState';
import PumpSidebar from '../components/PumpSidebar';
import PumpControl from '../components/PumpControl';
import TopNavbar from '../components/TopNavbar';

export default function MainPage() {
  const [selectedPump, setSelectedPump] = useState<number | null>(null);
  const { data: config } = useConfiguration();
  const { data: state } = useEquipmentState();

  return (
    <div className="h-screen flex flex-col bg-[#0a0a14]">
      <TopNavbar pumps={state?.PumpValuesCollection || []} />
      
      <div className="flex flex-1 overflow-hidden">
        <PumpSidebar
          pumps={state?.PumpValuesCollection || []}
          selectedPump={selectedPump}
          onSelectPump={setSelectedPump}
        />
        
        <main className="flex-1 p-5 overflow-auto">
          <PumpControl
            pumpNumber={selectedPump}
            config={config}
            state={state}
          />
        </main>
      </div>
    </div>
  );
}
