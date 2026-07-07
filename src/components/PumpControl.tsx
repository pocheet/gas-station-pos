// src/components/PumpControl.tsx
import { type Configuration, type EquipmentState, type OrderItem } from '../types/schemas';
import { usePumpControl } from '../hooks/usePumpControl';
import TransactionInfo from './TransactionInfo';
import OrderTable from './OrderTable';
import { Alert, Snackbar } from '@mui/material';

interface PumpControlProps {
  pumpNumber: number | null;
  config?: Configuration;
  state?: EquipmentState;
  selectedNozzle: number | null;
  orders: OrderItem[];
  removeOrder: (id: string) => void;
  onStart?: () => void;
  isStarting?: boolean;
  canStart?: boolean;
}

export default function PumpControl({ 
  pumpNumber, 
  config, 
  state, 
  selectedNozzle,
  orders,
  removeOrder,
  onStart,
  isStarting = false,
  canStart = false,
}: PumpControlProps) {
  const { 
    stopTransaction,
    isStopping,
    continueTransaction,
    isContinuing,
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

  const handleStopTransaction = () => {
    stopTransaction({ pumpNumber });
  };

  const handleContinueTransaction = () => {
    continueTransaction({ pumpNumber });
  };

  const handleResetTransaction = () => {
    if (!pump) return;
    resetTransaction({
      pumpNumber,
      amount: pump.Transaction.RealTimeAmount,
      pricePerUnit: pump.Transaction.PricePerUnit,
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <TransactionInfo
        pump={pump}
        pumpNumber={pumpNumber}
        selectedNozzle={selectedNozzle}
        onStop={handleStopTransaction}
        onContinue={handleContinueTransaction}
        onReset={handleResetTransaction}
        isStopping={isStopping}
        isContinuing={isContinuing}
        isResetting={isResetting}
        onStart={onStart}
        isStarting={isStarting}
        canStart={canStart}
      />

      <OrderTable
        orders={orders}
        onRemoveOrder={removeOrder}
        selectedPump={pumpNumber}
      />

      <Snackbar open={!!error} autoHideDuration={6000} onClose={clearError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={clearError} severity="error">{error}</Alert>
      </Snackbar>
      <Snackbar open={!!success} autoHideDuration={3000} onClose={clearSuccess}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={clearSuccess} severity="success">{success}</Alert>
      </Snackbar>
    </div>
  );
}
