// src/api/config.api.ts
import { apiClient } from './client';
import type { Configuration } from './types';

export const configApi = {
  getConfiguration: async (): Promise<Configuration> => {
    const { data } = await apiClient.get<Configuration>('/api/v1/GetConfiguration');
    return data;
  },
};
