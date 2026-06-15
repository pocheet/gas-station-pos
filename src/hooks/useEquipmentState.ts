// src/hooks/useEquipmentState.ts
import { useQuery } from '@tanstack/react-query';
import { stateApi } from '../api/state.api';

export const STATE_QUERY_KEY = ['equipmentState'] as const;

export const useEquipmentState = (pollingInterval: number = 1000) => {
  return useQuery({
    queryKey: STATE_QUERY_KEY,
    queryFn: stateApi.getEquipmentState,
    refetchInterval: pollingInterval,
    staleTime: 500, // Данные устаревают через 500ms
    cacheTime: 0, // Не кэшируем, всегда запрашиваем свежие
    retry: 2,
    retryDelay: 500,
    select: (data) => {
      // Трансформируем данные для удобства использования
      return {
        ...data,
        pumpMap: new Map(
          data.PumpValuesCollection.map(pump => [pump.Number, pump])
        ),
        activeTransactions: data.PumpValuesCollection.filter(
          pump => pump.Transaction.TransactionId !== '00000000-0000-0000-0000-000000000000'
        ),
        fuelingPumps: data.PumpValuesCollection.filter(
          pump => pump.Status === 5 // Busy status
        ),
      };
    },
  });
};
