// src/hooks/usePumpControl.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { pumpApi, type StartTransactionRequest, type ResetTransactionRequest } from '../api/client';
import { useState } from 'react';

export function usePumpControl() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const generateLockTag = () => {
    return `operator-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Запуск налива
  const startFuelingMutation = useMutation({
    mutationFn: async (params: {
      pumpNumber: number;
      nozzleNumber: number;
      pricePerUnit: number;
      value: number;
      isValueAmount: boolean;
    }) => {
      setError(null);
      setSuccess(null);
      const lockTag = generateLockTag();

      try {
        // Шаг 1: Блокируем ТРК
        console.log('🔒 Locking pump for start...', { pumpNumber: params.pumpNumber });
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
          payFormCode: 1,
          unlockOnSuccess: true,
        };

        const result = await pumpApi.startTransaction(transactionRequest);
        console.log('✅ Transaction started:', result);

        // Шаг 3: Разблокируем ТРК
        console.log('🔓 Unlocking pump...');
        await pumpApi.unlockPump({
          pumpLockTag: lockTag,
          pumpNumber: params.pumpNumber,
        });

        setSuccess('Налив успешно запущен');
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
      queryClient.invalidateQueries({ queryKey: ['equipmentState'] });
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || err.response?.data?.title || err.message || 'Неизвестная ошибка';
      setError(message);
    },
  });

  // Сброс транзакции
  const resetTransactionMutation = useMutation({
    mutationFn: async (params: {
      pumpNumber: number;
      amount?: number;
      pricePerUnit?: number;
      emergencyReset?: boolean;
    }) => {
      setError(null);
      setSuccess(null);
      const lockTag = generateLockTag();

      try {
        // Шаг 1: Блокируем ТРК
        console.log('🔒 Locking pump for reset...', { pumpNumber: params.pumpNumber });
        await pumpApi.lockPump({
          pumpLockTag: lockTag,
          pumpNumber: params.pumpNumber,
        });

        // Шаг 2: Сбрасываем транзакцию
        console.log('🔄 Resetting transaction...');
        const resetRequest: ResetTransactionRequest = {
          pumpLockTag: lockTag,
          pumpNumber: params.pumpNumber,
          amount: params.amount,
          pricePerUnit: params.pricePerUnit,
          emergencyReset: params.emergencyReset || false,
          unlockOnSuccess: true,
        };

        const result = await pumpApi.resetTransaction(resetRequest);
        console.log('✅ Transaction reset:', result);

        // Шаг 3: Разблокируем ТРК
        console.log('🔓 Unlocking pump...');
        await pumpApi.unlockPump({
          pumpLockTag: lockTag,
          pumpNumber: params.pumpNumber,
        });

        setSuccess('Транзакция успешно завершена');
        return result;
      } catch (err: any) {
        console.error('❌ Failed to reset transaction:', err);
        
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
      queryClient.invalidateQueries({ queryKey: ['equipmentState'] });
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || err.response?.data?.title || err.message || 'Неизвестная ошибка';
      setError(message);
    },
  });

  return {
    startFueling: startFuelingMutation.mutate,
    isStarting: startFuelingMutation.isPending,
    resetTransaction: resetTransactionMutation.mutate,
    isResetting: resetTransactionMutation.isPending,
    error,
    success,
    clearError: () => setError(null),
    clearSuccess: () => setSuccess(null),
  };
}
