// src/pages/MainPage.tsx
import { useState, useCallback, useEffect } from 'react';
import { useConfiguration } from '../hooks/useConfiguration';
import { useEquipmentState } from '../hooks/useEquipmentState';
import { usePumpControl } from '../hooks/usePumpControl';

import PumpSidebar from '../components/PumpSidebar';
import PumpControl from '../components/PumpControl';
import PresetKeyboard from '../components/PresetKeyboard';
import PaymentMethodSelector from '../components/PaymentMethodSelector';
import TopNavbar from '../components/TopNavbar';
import Footer from '../components/Footer';

import { PAYMENT_METHODS, PUMP_STATUS, type Order, type OrderItem } from '../types/schemas';

export default function MainPage() {
  const [ordersMap, setOrdersMap] = useState<Record<number, Order>>({});
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [fuelingItemId, setFuelingItemId] = useState<string | null>(null);
  const [selectedPump, setSelectedPump] = useState<number | null>(null);
  const [selectedNozzle, setSelectedNozzle] = useState<number | null>(null);
  const [presetMode, setPresetMode] = useState<'volume' | 'amount'>('volume');
  const [presetValue, setPresetValue] = useState('0');
  const [payFormCode, setPayFormCode] = useState<number>(PAYMENT_METHODS.CASH);
  const [discountPercent, setDiscountPercent] = useState<number | null>(null);
  const [isStopped, setIsStopped] = useState(false);

  const { data: config } = useConfiguration();
  const { data: state } = useEquipmentState();
  const { 
    startFueling, isStarting,
    stopTransaction, isStopping,
    continueTransaction, isContinuing,
    resetTransaction, isResetting,
  } = usePumpControl();

  const pump = state?.PumpValuesCollection.find(p => p.Number === selectedPump);
  const currentOrder = selectedPump ? ordersMap[selectedPump] || null : null;

  const getBasePrice = () => {
    if (!selectedNozzle || !pump) return 0;
    return pump.Nozzles.find(n => n.Number === selectedNozzle)?.DefaultPricePerUnit ?? 0;
  };

  const getPricePerUnit = () => {
    const base = getBasePrice();
    return discountPercent ? base * (1 - discountPercent / 100) : base;
  };

  // Создание новой пустой строки при входе в диспенсер
  const ensureActiveItem = useCallback(() => {
    if (!selectedPump) return;

    setOrdersMap(prev => {
      const existing = prev[selectedPump];
      
      // Если заказ уже создан или в процессе налива — не трогаем
      if (existing?.status === 'created' || existing?.status === 'fueling') return prev;

      const order = existing || {
        id: `${selectedPump}-${Date.now()}`,
        pumpNumber: selectedPump,
        status: 'draft' as const,
        items: [],
        totalSum: 0,
        totalDiscount: 0,
        totalAmount: 0,
        createdAt: new Date().toISOString(),
      };

      // Создаём строку только если список пуст
      if (order.items.length === 0) {
        const newItem: OrderItem = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          pumpNumber: selectedPump,
          nozzleNumber: selectedNozzle || 0,
          productName: selectedNozzle
            ? pump?.Nozzles.find(n => n.Number === selectedNozzle)?.ProductRef || '—'
            : '—',
          volume: 0,
          pricePerUnit: getPricePerUnit(),
          discountPercent: null,
          totalAmount: 0,
        };

        setActiveItemId(newItem.id);

        return {
          ...prev,
          [selectedPump]: {
            ...order,
            items: [...order.items, newItem],
          },
        };
      }

      // Если строки уже есть — проверяем, есть ли активная
      if (!activeItemId || !order.items.find(i => i.id === activeItemId)) {
        // Выбираем первую строку как активную
        setActiveItemId(order.items[0].id);
      }

      return prev;
    });
  }, [selectedPump, selectedNozzle]);

  useEffect(() => {
    if (selectedPump) {
      ensureActiveItem();
    }
  }, [selectedPump]);

  // Обновление активной строки при изменении параметров
  useEffect(() => {
    if (!selectedPump || !activeItemId) return;

    // Не обновляем если заказ создан или в процессе налива
    if (currentOrder?.status === 'created' || currentOrder?.status === 'fueling') return;

    const productName = selectedNozzle
      ? pump?.Nozzles.find(n => n.Number === selectedNozzle)?.ProductRef || '—'
      : '—';
    const pricePerUnit = getPricePerUnit();
    const value = parseFloat(presetValue) || 0;
    const volume = presetMode === 'volume' ? value : (pricePerUnit > 0 ? value / pricePerUnit : 0);
    const totalAmount = presetMode === 'amount' ? value : value * pricePerUnit;

    setOrdersMap(prev => {
      const order = prev[selectedPump];
      if (!order || order.status === 'fueling') return prev;

      const updatedItems = order.items.map(item => {
        if (item.id === activeItemId) {
          return {
            ...item,
            nozzleNumber: selectedNozzle || item.nozzleNumber,
            productName,
            volume,
            pricePerUnit,
            discountPercent,
            totalAmount,
          };
        }
        return item;
      });

      const totalSum = updatedItems.reduce((s, i) => s + i.totalAmount, 0);
      const totalDiscount = updatedItems.reduce((s, i) => {
        if (!i.discountPercent) return s;
        const base = i.pricePerUnit / (1 - i.discountPercent / 100);
        return s + (base - i.pricePerUnit) * i.volume;
      }, 0);

      return {
        ...prev,
        [selectedPump]: {
          ...order,
          items: updatedItems,
          totalSum,
          totalDiscount,
          totalAmount: totalSum - totalDiscount,
        },
      };
    });
  }, [selectedNozzle, presetValue, presetMode, discountPercent, activeItemId]);

  // Отслеживаем завершение налива
  useEffect(() => {
    if (!selectedPump || !currentOrder || currentOrder.status !== 'fueling') return;

    const pump = state?.PumpValuesCollection.find(p => p.Number === selectedPump);
    if (!pump) return;

    // Если налив завершён (статус WaitReset = 10 или WaitOff = 9)
    if (pump.Status === PUMP_STATUS.WAIT_RESET || pump.Status === PUMP_STATUS.WAIT_OFF) {
      setOrdersMap(prev => {
        const order = prev[selectedPump];
        if (!order) return prev;
        return {
          ...prev,
          [selectedPump]: {
            ...order,
            status: 'completed',
          },
        };
      });
      setIsStopped(false);
    }

    // Если налив остановлен (WaitOffRemainder = 8)
    if (pump.Status === PUMP_STATUS.WAIT_OFF_REMAINDER) {
      setIsStopped(true);
    }

    // Если снова идёт налив (после продолжения)
    if (pump.Status === PUMP_STATUS.BUSY) {
      setIsStopped(false);
    }
  }, [state?.PumpValuesCollection, selectedPump, currentOrder?.status]);

  // Кнопка "Ввод" — создаёт новую строку
  const handleAddItem = () => {
    if (!selectedPump) return;

    const newItem: OrderItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      pumpNumber: selectedPump,
      nozzleNumber: 0,
      productName: '—',
      volume: 0,
      pricePerUnit: 0,
      discountPercent: null,
      totalAmount: 0,
    };

    setOrdersMap(prev => {
      const order = prev[selectedPump];
      if (!order) return prev;
      return {
        ...prev,
        [selectedPump]: {
          ...order,
          items: [...order.items, newItem],
        },
      };
    });

    setActiveItemId(newItem.id);
    setSelectedNozzle(null);
    setPresetValue('0');
    setDiscountPercent(null);
  };

  // Удаление/обнуление строки
  const handleRemoveItem = (itemId: string) => {
    if (!selectedPump) return;

    setOrdersMap(prev => {
      const order = prev[selectedPump];
      if (!order) return prev;

      const updatedItems = order.items.length === 1
        ? order.items.map(i => i.id === itemId
            ? { ...i, nozzleNumber: 0, productName: '—', volume: 0, pricePerUnit: 0, discountPercent: null, totalAmount: 0 }
            : i)
        : order.items.filter(i => i.id !== itemId);

      const totalSum = updatedItems.reduce((s, i) => s + i.totalAmount, 0);
      const totalDiscount = updatedItems.reduce((s, i) => {
        if (!i.discountPercent) return s;
        const base = i.pricePerUnit / (1 - i.discountPercent / 100);
        return s + (base - i.pricePerUnit) * i.volume;
      }, 0);

      return {
        ...prev,
        [selectedPump]: {
          ...order,
          items: updatedItems,
          totalSum,
          totalDiscount,
          totalAmount: totalSum - totalDiscount,
        },
      };
    });

    if (itemId === activeItemId) {
      setActiveItemId(null);
      setPresetValue('0');
    }
  };

  // Выбор строки
  const handleSelectItem = (item: OrderItem) => {
    if (!selectedPump || currentOrder?.status === 'fueling') return;

    setActiveItemId(item.id);
    setSelectedNozzle(item.nozzleNumber || null);
    setPresetValue(item.volume > 0 ? item.volume.toString() : '0');
    setDiscountPercent(item.discountPercent);
  };

  // Проверка возможности создания заказа
  const canCreateOrder = currentOrder
    ? currentOrder.items.length > 0 && currentOrder.items.every(i => i.volume > 0 && i.nozzleNumber > 0)
    : false;

  // Создание заказа
  const handleCreateOrder = () => {
    if (!selectedPump || !currentOrder || !canCreateOrder) return;
    setOrdersMap(prev => ({
      ...prev,
      [selectedPump]: {
        ...currentOrder,
        status: 'created',
      },
    }));
    if (currentOrder.items.length > 0) {
      setFuelingItemId(currentOrder.items[0].id);
    }
  };

  // Редактирование заказа (возврат в draft)
  const handleEditOrder = () => {
    if (!selectedPump || !currentOrder || currentOrder.status !== 'created') return;

    setOrdersMap(prev => ({
      ...prev,
      [selectedPump]: {
        ...currentOrder,
        status: 'draft',
      },
    }));
    setFuelingItemId(null);
  };

  // Запуск налива
  const handleStartFueling = () => {
    if (!selectedPump || !currentOrder || currentOrder.status !== 'created') return;

    const fuelingItem = fuelingItemId
      ? currentOrder.items.find(i => i.id === fuelingItemId)
      : currentOrder.items[0];

    if (!fuelingItem) return;

    startFueling({
      pumpNumber: selectedPump,
      nozzleNumber: fuelingItem.nozzleNumber,
      pricePerUnit: fuelingItem.pricePerUnit,
      value: fuelingItem.volume,
      isValueAmount: false,
      payFormCode,
    });

    setOrdersMap(prev => ({
      ...prev,
      [selectedPump]: {
        ...currentOrder,
        status: 'fueling',
      },
    }));
    setIsStopped(false);
  };

  // Остановка налива
  const handleStopFueling = () => {
    if (!selectedPump) return;
    stopTransaction({ pumpNumber: selectedPump });
    setIsStopped(true);
  };

  // Продолжение налива
  const handleContinueFueling = () => {
    if (!selectedPump) return;
    continueTransaction({ pumpNumber: selectedPump });
    setIsStopped(false);
  };

  // Завершение заказа
  const handleCompleteOrder = () => {
    if (!selectedPump || !pump) return;

    // Если есть активная транзакция — сбрасываем её
    const tx = pump.Transaction;
    const hasTransaction = tx && tx.TransactionId !== '00000000-0000-0000-0000-000000000000';
    
    if (hasTransaction) {
      resetTransaction({
        pumpNumber: selectedPump,
        amount: tx.RealTimeAmount,
        pricePerUnit: tx.PricePerUnit,
      });
    }

    // Возвращаем заказ в режим сбора (draft)
    setOrdersMap(prev => {
      const order = prev[selectedPump];
      if (!order) return prev;
      return {
        ...prev,
        [selectedPump]: {
          ...order,
          status: 'draft',
        },
      };
    });

    // Сбрасываем состояния
    setIsStopped(false);
    setFuelingItemId(null);
    setActiveItemId(null);
    setPresetValue('0');
    setSelectedNozzle(null);
    setDiscountPercent(null);
  };

  // Сброс формы
  const resetForm = useCallback(() => {
    setPresetValue('0');
    setSelectedNozzle(null);
    setDiscountPercent(null);
    setActiveItemId(null);
  }, []);

  const handleSelectPump = (num: number) => {
    if (selectedPump === num) return;
    resetForm();
    setSelectedPump(num);
    setFuelingItemId(null);
    setIsStopped(false);
  };

  const isKeyboardLocked = currentOrder?.status === 'created' || currentOrder?.status === 'fueling' || isStopped;

  return (
    <div className="h-screen flex flex-col bg-[#0a0a14]">
      <TopNavbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Левая панель */}
        <PumpSidebar
          pumps={state?.PumpValuesCollection || []}
          selectedPump={selectedPump}
          onSelectPump={handleSelectPump}
          selectedNozzle={selectedNozzle}
          onSelectNozzle={(num) => {
            // Блокируем смену пистолета если заказ создан или идёт налив
            if (currentOrder?.status === 'created' || currentOrder?.status === 'fueling') return;
            setSelectedNozzle(num);
          }}
        />

        {/* Центр */}
        <main className="flex-1 p-5 overflow-auto">
          <PumpControl
            pumpNumber={selectedPump}
            config={config}
            state={state}
            selectedNozzle={selectedNozzle}
            order={currentOrder}
            activeItemId={activeItemId}
            fuelingItemId={fuelingItemId}
            canCreateOrder={canCreateOrder}
            onSelectItem={handleSelectItem}
            onRemoveItem={handleRemoveItem}
            onCreateOrder={handleCreateOrder}
            onEditOrder={handleEditOrder}
            onStartFueling={handleStartFueling}
            onStopFueling={handleStopFueling}
            onContinueFueling={handleContinueFueling}
            onCompleteOrder={handleCompleteOrder}
            isStarting={isStarting}
            isStopping={isStopping}
            isContinuing={isContinuing}
            isCompleting={isResetting}
            isStopped={isStopped}
            presetMode={presetMode}
            presetValue={presetValue}
            pricePerUnit={getPricePerUnit()}
            discountPercent={discountPercent}
          />
        </main>

        {/* Правая панель */}
        <aside className="w-[350px] bg-[#1a1a2e] overflow-y-auto border-l border-gray-700 p-4 my-5 rounded-l-2xl flex flex-col">
          {/* PaymentMethodSelector — прижат к верху */}
          <div>
            <PaymentMethodSelector
              value={payFormCode}
              onChange={setPayFormCode}
              disabled={!pump || pump.Status !== PUMP_STATUS.OFF || isKeyboardLocked}
              discountPercent={discountPercent}
              onDiscountSelect={(percent) => {
                setDiscountPercent(percent === discountPercent ? null : percent);
              }}
            />
          </div>

          {/* PresetKeyboard — прижат к низу */}
          <div className="mt-auto">
            <PresetKeyboard
              mode={presetMode}
              value={presetValue}
              onModeChange={setPresetMode}
              onValueChange={setPresetValue}
              selectedNozzle={selectedNozzle}
              onStart={handleAddItem}
              isStarting={false}
              canStart={
                !!selectedNozzle && 
                presetValue !== '0' && 
                currentOrder?.status === 'draft' &&
                pump?.Status === PUMP_STATUS.OFF
              }
              pricePerUnit={getPricePerUnit()}
              pumpStatus={isKeyboardLocked ? -1 : pump?.Status}
            />
          </div>
        </aside>
      </div>

      <Footer products={config?.Products} />
    </div>
  );
}
