// src/hooks/usePumpControl.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { pumpApi, type StartTransactionRequest } from '../api/client';
import { useState } from 'react';

export function usePumpControl() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  // Генерируем уникальный lock tag для сессии
  const generateLockTag = () => {
    return `operator-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const startFuelingMutation = useMutation({
    mutationFn: async (params: {
      pumpNumber: number;
      nozzleNumber: number;
      pricePerUnit: number;
      value: number;
      isValueAmount: boolean;
    }) => {
      setError(null);
      const lockTag = generateLockTag();

      try {
        // Шаг 1: Блокируем ТРК
        console.log('🔒 Locking pump...', { pumpNumber: params.pumpNumber, lockTag });
        await pumpApi.lockPump({
          pumpLockTag: lockTag,
          pumpNumber: params.pumpNumber,
        });

        // Шаг 2: Запускаем транзакцию
        console.log('⛽ Starting transaction...');
        const transactionRequest: StartTransactionRequest = {
          pumpLockTag: lockTag,
          pumpNumber: params.pumpNumber,
          nozzleNumber: params.nozzleNumber,
          isValueAmount: params.isValueAmount,
          value: params.value,
          pricePerUnit: params.pricePerUnit,
          payFormCode: 1, // Технологический
          unlockOnSuccess: true, // Автоматически разблокировать после успеха
        };

        const result = await pumpApi.startTransaction(transactionRequest);
        console.log('✅ Transaction started:', result);

        // Шаг 3: Разблокируем ТРК
        console.log('🔓 Unlocking pump...');
        await pumpApi.unlockPump({
          pumpLockTag: lockTag,
          pumpNumber: params.pumpNumber,
        });

        return result;
      } catch (err: any) {
        console.error('❌ Failed to start fueling:', err);
        
        // Пытаемся разблокировать в случае ошибки
        try {
          await pumpApi.unlockPump({
            pumpLockTag: lockTag,
            pumpNumber: params.pumpNumber,
          });
        } catch (unlockErr) {
          console.error('Failed to unlock after error:', unlockErr);
        }
        
        throw err;
      }
    },
    onSuccess: () => {
      // Обновляем состояние после успешного запуска
      queryClient.invalidateQueries({ queryKey: ['equipmentState'] });
      setError(null);
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || err.message || 'Неизвестная ошибка';
      setError(message);
      console.error('Transaction error:', err);
    },
  });

  return {
    startFueling: startFuelingMutation.mutate,
    isStarting: startFuelingMutation.isPending,
    error,
    clearError: () => setError(null),
  };
}
