// src/hooks/useEquipmentState.ts
import { useQuery } from '@tanstack/react-query';
import { stateApi } from '../api/client';

export const useEquipmentState = () => {
  return useQuery({
    queryKey: ['equipmentState'],
    queryFn: stateApi.getEquipmentState,
    refetchInterval: 1000,
  });
};
