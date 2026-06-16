// src/hooks/useConfiguration.ts
import { useQuery } from '@tanstack/react-query';
import { configApi } from '../api/client';

export const useConfiguration = () => {
  return useQuery({
    queryKey: ['configuration'],
    queryFn: configApi.getConfiguration,
    staleTime: Infinity,
  });
};
