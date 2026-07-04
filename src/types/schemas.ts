// src/types/schemas.ts
import { z } from 'zod';

export const PumpStatusSchema = z.union([
  z.literal(0), // Error
  z.literal(1), // Off
  z.literal(2), // Preset
  z.literal(3), // Call
  z.literal(4), // CallError
  z.literal(5), // Busy
  z.literal(6), // BusyOverflow
  z.literal(7), // WaitOffOverflow
  z.literal(8), // WaitOffRemainder
  z.literal(9), // WaitOff
  z.literal(10), // WaitReset
]);

// NozzleConfig
export const NozzleConfigSchema = z.object({
  LogicalNumber: z.number(),
  PhysicalNumber: z.number(),
  ProductRef: z.string(),
});

export type NozzleConfig = z.infer<typeof NozzleConfigSchema>;

// Product
export const ProductSchema = z.object({
  Id: z.string(),
  Name: z.string(),
  DefaultPricePerUnit: z.number(),
});

export type Product = z.infer<typeof ProductSchema>;

// PumpConfig
export const PumpConfigSchema = z.object({
  Type: z.string(),
  Number: z.number(),
  EnableService: z.boolean(),
  Nozzles: z.array(NozzleConfigSchema),
});

export type PumpConfig = z.infer<typeof PumpConfigSchema>;

// Configuration
export const ConfigurationSchema = z.object({
  Products: z.array(ProductSchema),
  Pumps: z.array(PumpConfigSchema),
});

export type Configuration = z.infer<typeof ConfigurationSchema>;

// Transaction
export const TransactionSchema = z.object({
  TransactionId: z.string(),
  PresetVolume: z.number(),
  PresetAmount: z.number(),
  RealTimeVolume: z.number(),
  RealTimeAmount: z.number(),
  PricePerUnit: z.number(),
  ProductId: z.string(),
  NozzleNumber: z.number(),
  PayFormCode: z.number().optional(),
  PresetTimeStamp: z.string(),
  DoneTimeStamp: z.string(),
  ResetTimeStamp: z.string(),
});

export type Transaction = z.infer<typeof TransactionSchema>;

// NozzleValue
export const NozzleValueSchema = z.object({
  Number: z.number(),
  ProductRef: z.string(),
  VolumeTotalCounter: z.number(),
  AmountTotalCounter: z.number(),
  DefaultPricePerUnit: z.number(),
});

export type NozzleValue = z.infer<typeof NozzleValueSchema>;

// SelectedNozzleValue — объект пистолета
export const SelectedNozzleValueSchema = z.object({
  Number: z.number(),
  ProductRef: z.string(),
  VolumeTotalCounter: z.number(),
  AmountTotalCounter: z.number(),
  DefaultPricePerUnit: z.number(),
});

export type SelectedNozzleValue = z.infer<typeof SelectedNozzleValueSchema>;

// SelectedNozzle может быть null, числом или объектом
export const SelectedNozzleSchema = z.union([
  SelectedNozzleValueSchema,
  z.number(),
  z.null(),
]);

// PumpValue
export const PumpValueSchema = z.object({
  Number: z.number(),
  Status: PumpStatusSchema,
  EnableService: z.boolean(),
  LockTag: z.string().optional(),
  SelectedNozzle: SelectedNozzleSchema.optional(),
  Nozzles: z.array(NozzleValueSchema),
  Transaction: TransactionSchema,
});

export type PumpValue = z.infer<typeof PumpValueSchema>;

// EquipmentState
export const EquipmentStateSchema = z.object({
  SessionId: z.string(),
  Messages: z.number(),
  PumpValuesCollection: z.array(PumpValueSchema),
});

export type EquipmentState = z.infer<typeof EquipmentStateSchema>;

// PumpStatusType
export type PumpStatusType = z.infer<typeof PumpStatusSchema>;

// Константы статусов
export const PUMP_STATUS = {
  ERROR: 0,
  OFF: 1,               // Свободен
  PRESET: 2,            // Установлена доза
  CALL: 3,              // Пистолет снят
  CALL_ERROR: 4,        // Ошибка пистолета
  BUSY: 5,              // Идёт отпуск
  BUSY_OVERFLOW: 6,     // Перелив
  WAIT_OFF_OVERFLOW: 7, // Завершение с переливом
  WAIT_OFF_REMAINDER: 8,// Остаток
  WAIT_OFF: 9,          // Повесьте пистолет
  WAIT_RESET: 10,       // Ожидает обработки
} as const;

// Способы оплаты
export const PAYMENT_METHODS = {
  TECHNOLOGICAL: 1,
  CASH: 2,
  CASHLESS: 3,
} as const;

export type PaymentMethod = typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS];

export const PAYMENT_METHOD_LABELS: Record<number, string> = {
  [PAYMENT_METHODS.TECHNOLOGICAL]: 'Технологический',
  [PAYMENT_METHODS.CASH]: 'Наличный',
  [PAYMENT_METHODS.CASHLESS]: 'Безналичный',
};

export type OrderItem = {
  id: string;
  pumpNumber: number;
  nozzleNumber: number;
  productName: string;
  volume: number;
  pricePerUnit: number;
  discountPercent: number | null;
  totalAmount: number;
  timestamp: string;
};

export const OrderItemSchema = z.object({
  id: z.string(),
  pumpNumber: z.number(),
  nozzleNumber: z.number(),
  productName: z.string(),
  volume: z.number(),
  pricePerUnit: z.number(),
  discountPercent: z.number().nullable(),
  totalAmount: z.number(),
  timestamp: z.string(),
});
