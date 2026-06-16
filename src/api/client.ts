// src/api/client.ts
import axios from 'axios';
import { ConfigurationSchema, EquipmentStateSchema } from '../types/schemas';

const apiClient = axios.create({
  baseURL: import.meta.env.DEV ? '' : 'http://rpi.directvision.ru:4001',
  headers: {
    'Accept': 'application/json',
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
