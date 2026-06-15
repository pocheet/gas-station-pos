// src/utils/constants.ts
export const API_BASE_URL = 'http://rpi.directvision.ru:4001';

export const POLLING_INTERVAL = 1000; // 1 секунда

export const DEFAULT_PRESET_VALUES = {
  volume: [10, 20, 30, 50, 100],
  amount: [500, 1000, 1500, 2000, 3000],
};

export const PUMP_STATUS = {
  ERROR: 0,
  OFF: 1,
  PRESET: 2,
  CALL: 3,
  CALL_ERROR: 4,
  BUSY: 5,
  BUSY_OVERFLOW: 6,
  WAIT_OFF_OVERFLOW: 7,
  WAIT_OFF_REMAINDER: 8,
  WAIT_OFF: 9,
  WAIT_RESET: 10,
} as const;

export const PRODUCT_COLORS: Record<string, string> = {
  'АИ-92': '#4CAF50',
  'АИ-95': '#2196F3',
  'АИ-95+': '#9C27B0',
  'АИ-98': '#FF9800',
  'АИ-98+': '#F44336',
  'АИ-100+': '#E91E63',
  'Дизель': '#795548',
  'Дизель+': '#607D8B',
  'AdBlue': '#00BCD4',
};
