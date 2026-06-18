// src/api/client.ts
import axios from 'axios';
import { ConfigurationSchema, EquipmentStateSchema } from '../types/schemas';

const apiClient = axios.create({
  baseURL: import.meta.env.DEV ? '' : 'http://rpi.directvision.ru:4001',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const configApi = {
  getConfiguration: async () => {
    const { data } = await apiClient.get('/api/v1/GetConfiguration');
    return ConfigurationSchema.parse(data);
  },
};

export const stateApi = {
  getEquipmentState: async () => {
    const { data } = await apiClient.get('/api/v1/GetFuelEquipmentValues');
    return EquipmentStateSchema.parse(data);
  },
};

export interface LockPumpRequest {
  pumpLockTag: string;
  pumpNumber: number;
}

export interface StartTransactionRequest {
  Tags?: Record<string, any>;
  externalId?: string;
  isValueAmount: boolean;
  nozzleNumber: number;
  payFormCode: number;
  pricePerUnit: number;
  pumpLockTag: string;
  pumpNumber: number;
  shiftId?: string;
  tankNumber?: number;
  unlockOnSuccess: boolean;
  value: number;
}

export interface ResetTransactionRequest {
  Tags?: Record<string, any>;
  amount?: number;
  emergencyAmount?: number;
  emergencyReset?: boolean;
  emergencyVolume?: number;
  externalId?: string;
  payFormCode?: number;
  pricePerUnit?: number;
  pumpLockTag: string;
  pumpNumber: number;
  shiftId?: string;
  tankNumber?: number;
  unlockOnSuccess: boolean;
}

export interface StopTransactionRequest {
  pumpLockTag: string;
  pumpNumber: number;
}

export interface UnlockPumpRequest {
  pumpLockTag: string;
  pumpNumber: number;
}

export const pumpApi = {
  // Блокировка ТРК
  lockPump: async (request: LockPumpRequest) => {
    const { data } = await apiClient.post('/api/v1/LockPump', request);
    return data;
  },

  // Запуск транзакции
  startTransaction: async (request: StartTransactionRequest) => {
    const { data } = await apiClient.post('/api/v1/StartPumpTransaction', request);
    return data;
  },

  // Сброс транзакции
  resetTransaction: async (request: ResetTransactionRequest) => {
    const { data } = await apiClient.post('/api/v1/ResetPumpTransaction', request);
    return data;
  },

  // Остановка транзакции
  stopTransaction: async (request: StopTransactionRequest) => {
    const { data } = await apiClient.post('/api/v1/StopPumpTransaction', request);
    return data;
  },
  
  // Разблокировка ТРК
  unlockPump: async (request: UnlockPumpRequest) => {
    const { data } = await apiClient.post('/api/v1/UnlockPump', request);
    return data;
  },
};
