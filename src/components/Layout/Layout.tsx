// src/components/Layout/Layout.tsx
import React from 'react';
import Header from './Header';
import StatusBar from './StatusBar';
import PumpGrid from '../PumpGrid/PumpGrid';
import ControlPanel from '../ControlPanel/ControlPanel';
import { useEquipmentState } from '../../hooks/useEquipmentState';
import { useConfiguration } from '../../hooks/useConfiguration';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorBoundary from '../common/ErrorBoundary';

const Layout: React.FC = () => {
  const { data: config, isLoading: configLoading, error: configError } = useConfiguration();
  const { data: state, isLoading: stateLoading, error: stateError } = useEquipmentState(1000);

  if (configLoading) {
    return (
      <div className="loading-screen">
        <LoadingSpinner size="large" />
        <p>Загрузка конфигурации оборудования...</p>
      </div>
    );
  }

  if (configError) {
    return (
      <div className="error-screen">
        <h2>⚠️ Ошибка загрузки конфигурации</h2>
        <p>{(configError as Error).message}</p>
        <button onClick={() => window.location.reload()}>Повторить</button>
      </div>
    );
  }

  return (
    <div className="pos-terminal">
      <Header />
      <div className="main-content">
        <ErrorBoundary fallback={<div>Ошибка загрузки ТРК</div>}>
          <PumpGrid 
            pumps={state?.PumpValuesCollection || []}
            config={config!}
            isLoading={stateLoading}
          />
        </ErrorBoundary>
        <ErrorBoundary fallback={<div>Ошибка панели управления</div>}>
          <ControlPanel 
            config={config!}
            state={state}
          />
        </ErrorBoundary>
      </div>
      <StatusBar 
        sessionId={state?.SessionId}
        messages={state?.Messages}
        lastUpdate={stateLoading ? 'Обновление...' : new Date().toLocaleTimeString()}
      />
    </div>
  );
};

export default Layout;
