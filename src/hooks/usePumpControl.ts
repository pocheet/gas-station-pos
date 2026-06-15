// src/hooks/usePumpControl.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { STATE_QUERY_KEY } from './useEquipmentState';

interface AuthorizeParams {
  pumpNumber: number;
  nozzleNumber: number;
  productId: string;
  presetVolume?: number;
  presetAmount?: number;
}

export const usePumpControl = () => {
  const queryClient = useQueryClient();

  const authorizeMutation = useMutation({
    mutationFn: async (params: AuthorizeParams) => {
      const { data } = await apiClient.post('/v1/Authorize', params);
      return data;
    },
    onSuccess: () => {
      // Инвалидируем кэш состояния для немедленного обновления
      queryClient.invalidateQueries({ queryKey: STATE_QUERY_KEY });
    },
  });

  const stopMutation = useMutation({
    mutationFn: async (pumpNumber: number) => {
      const { data } = await apiClient.post('/v1/StopPump', { pumpNumber });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STATE_QUERY_KEY });
    },
  });

  return {
    authorize: authorizeMutation.mutate,
    stop: stopMutation.mutate,
    isAuthorizing: authorizeMutation.isLoading,
    isStopping: stopMutation.isLoading,
  };
};
