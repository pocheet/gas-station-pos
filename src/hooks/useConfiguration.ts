// src/hooks/useConfiguration.ts
import { useQuery } from '@tanstack/react-query';
import { configApi } from '../api/config.api';

export const CONFIG_QUERY_KEY = ['configuration'] as const;

export const useConfiguration = () => {
  return useQuery({
    queryKey: CONFIG_QUERY_KEY,
    queryFn: configApi.getConfiguration,
    staleTime: Infinity, // Конфигурация меняется только при перезапуске сервера
    cacheTime: Infinity,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
