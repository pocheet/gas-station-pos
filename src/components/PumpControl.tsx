// src/components/PumpControl.tsx
import { type Configuration, type EquipmentState, type Order, type OrderItem, PUMP_STATUS } from '../types/schemas';
import { usePumpControl } from '../hooks/usePumpControl';
import TransactionInfo from './TransactionInfo';
import OrderTable from './OrderTable';
import OrderInfo from './OrderInfo';
import { Alert, Snackbar } from '@mui/material';

interface PumpControlProps {
  pumpNumber: number | null;
  config?: Configuration;
  state?: EquipmentState;
  selectedNozzle: number | null;
  order: Order | null;
  activeItemId?: string | null;
  fuelingItemId?: string | null;
  canCreateOrder?: boolean;
  onSelectItem?: (item: OrderItem) => void;
  onRemoveItem?: (itemId: string) => void;
  onCreateOrder: () => void;
  onEditOrder?: () => void;
  onStartFueling: () => void;
  onStopFueling: () => void;
  onContinueFueling: () => void;
  onCompleteOrder: () => void;
  isStarting?: boolean;
  isStopping?: boolean;
  isContinuing?: boolean;
  isCompleting?: boolean;
  isStopped?: boolean;
  presetMode?: 'volume' | 'amount';
  presetValue?: string;
  pricePerUnit?: number;
  discountPercent?: number | null;
}

export default function PumpControl({ 
  pumpNumber, 
  config, 
  state, 
  selectedNozzle,
  order,
  activeItemId,
  fuelingItemId,
  canCreateOrder = false,
  onSelectItem,
  onRemoveItem,
  onCreateOrder,
  onEditOrder,
  onStartFueling,
  onStopFueling,
  onContinueFueling,
  onCompleteOrder,
  isStarting = false,
  isStopping = false,
  isContinuing = false,
  isCompleting = false,
  isStopped = false,
  presetMode = 'volume',
  presetValue = '0',
  pricePerUnit = 0,
  discountPercent = null,
}: PumpControlProps) {
  const { 
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
  const canStart = order?.status === 'created' && !!pump && pump.Status === PUMP_STATUS.OFF;

  return (
    <div className="max-w-2xl mx-auto">
      {/* TransactionInfo — статус, пистолет, показатели, прогресс */}
      {/* <TransactionInfo
        pump={pump}
        pumpNumber={pumpNumber}
        selectedNozzle={selectedNozzle}
        onStop={onStopFueling}
        onContinue={onContinueFueling}
        onReset={onCompleteOrder}
        isStopping={isStopping}
        isContinuing={isContinuing}
        isResetting={isCompleting}
        onStart={onStartFueling}
        isStarting={isStarting}
        canStart={canStart}
        presetMode={presetMode}
        presetValue={presetValue}
        pricePerUnit={pricePerUnit}
        discountPercent={discountPercent}
      /> */}
      <div className="h-60"></div>

      {/* Таблица заказа */}
      <OrderTable
        items={order?.items || []}
        status={order?.status || 'draft'}
        selectedPump={pumpNumber}
        activeItemId={activeItemId}
        fuelingItemId={fuelingItemId}
        isStopped={isStopped}
        isCompleted={order?.status === 'completed'}
        onSelectItem={onSelectItem}
        onRemoveItem={onRemoveItem}
        onEditOrder={onEditOrder}
      />

      {/* Информация о заказе и кнопки управления */}
      <OrderInfo
        order={order}
        onCreateOrder={onCreateOrder}
        onStartFueling={onStartFueling}
        onStopFueling={onStopFueling}
        onContinueFueling={onContinueFueling}
        onCompleteOrder={onCompleteOrder}
        isStarting={isStarting}
        isStopping={isStopping}
        isContinuing={isContinuing}
        isCompleting={isCompleting}
        canStart={canStart}
        canCreate={canCreateOrder}
        isStopped={isStopped}
      />

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