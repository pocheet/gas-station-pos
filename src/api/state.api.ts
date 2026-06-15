// src/api/state.api.ts
import { apiClient } from './client';
import type { EquipmentState } from './types';

export const stateApi = {
  getEquipmentState: async (): Promise<EquipmentState> => {
    const { data } = await apiClient.get<EquipmentState>('/api/v1/GetFuelEquipmentValues');
    return data;
  },
};