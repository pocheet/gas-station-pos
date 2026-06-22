// src/hooks/usePumpControl.ts
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { pumpApi } from '../api/client';
import type {
  StartTransactionRequest, 
  ResetTransactionRequest, 
  StopTransactionRequest,
  ContinueTransactionRequest 
} from '../api/client';

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
        console.log('🔒 Locking pump for start...');
        await pumpApi.lockPump({
          pumpLockTag: lockTag,
          pumpNumber: params.pumpNumber,
        });

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
        console.log('✅ Transaction started');

        await pumpApi.unlockPump({
          pumpLockTag: lockTag,
          pumpNumber: params.pumpNumber,
        });

        setSuccess('Налив успешно запущен');
        return result;
      } catch (err: any) {
        console.error('❌ Failed to start fueling:', err);
        
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

  // Остановка транзакции
  const stopTransactionMutation = useMutation({
    mutationFn: async (params: {
      pumpNumber: number;
    }) => {
      setError(null);
      setSuccess(null);
      const lockTag = generateLockTag();

      try {
        console.log('🔒 Locking pump for stop...');
        await pumpApi.lockPump({
          pumpLockTag: lockTag,
          pumpNumber: params.pumpNumber,
        });

        console.log('🛑 Stopping transaction...');
        const stopRequest: StopTransactionRequest = {
          pumpLockTag: lockTag,
          pumpNumber: params.pumpNumber,
        };

        const result = await pumpApi.stopTransaction(stopRequest);
        console.log('✅ Transaction stopped');

        await pumpApi.unlockPump({
          pumpLockTag: lockTag,
          pumpNumber: params.pumpNumber,
        });

        setSuccess('Налив остановлен');
        return result;
      } catch (err: any) {
        console.error('❌ Failed to stop transaction:', err);
        
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

  // Продолжение транзакции
  const continueTransactionMutation = useMutation({
    mutationFn: async (params: {
      pumpNumber: number;
    }) => {
      setError(null);
      setSuccess(null);
      const lockTag = generateLockTag();

      try {
        console.log('🔒 Locking pump for continue...');
        await pumpApi.lockPump({
          pumpLockTag: lockTag,
          pumpNumber: params.pumpNumber,
        });

        console.log('▶️ Continuing transaction...');
        const continueRequest: ContinueTransactionRequest = {
          pumpLockTag: lockTag,
          pumpNumber: params.pumpNumber,
          unlockOnSuccess: true,
        };

        const result = await pumpApi.continueTransaction(continueRequest);
        console.log('✅ Transaction continued');

        await pumpApi.unlockPump({
          pumpLockTag: lockTag,
          pumpNumber: params.pumpNumber,
        });

        setSuccess('Налив продолжен');
        return result;
      } catch (err: any) {
        console.error('❌ Failed to continue transaction:', err);
        
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

  // src/hooks/usePumpControl.ts - обновляем resetTransactionMutation

  const resetTransactionMutation = useMutation({
    mutationFn: async (params: {
      pumpNumber: number;
      amount?: number;
      pricePerUnit?: number;
    }) => {
      setError(null);
      setSuccess(null);
      const lockTag = generateLockTag();

      try {
        await pumpApi.lockPump({
          pumpLockTag: lockTag,
          pumpNumber: params.pumpNumber,
        });

        const resetRequest: ResetTransactionRequest = {
          pumpLockTag: lockTag,
          pumpNumber: params.pumpNumber,
          amount: params.amount,
          pricePerUnit: params.pricePerUnit,
          emergencyReset: false,
          unlockOnSuccess: true,
        };

        const result = await pumpApi.resetTransaction(resetRequest);

        await pumpApi.unlockPump({
          pumpLockTag: lockTag,
          pumpNumber: params.pumpNumber,
        });

        setSuccess('Транзакция успешно завершена');
        return result;
      } catch (err: any) {
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
    stopTransaction: stopTransactionMutation.mutate,
    isStopping: stopTransactionMutation.isPending,
    continueTransaction: continueTransactionMutation.mutate,
    isContinuing: continueTransactionMutation.isPending,
    resetTransaction: resetTransactionMutation.mutate,
    isResetting: resetTransactionMutation.isPending,
    error,
    success,
    clearError: () => setError(null),
    clearSuccess: () => setSuccess(null),
  };
}
