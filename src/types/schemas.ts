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

export type NozzleConfig = {
  LogicalNumber: number;
  PhysicalNumber: number;
  ProductRef: string;
};

export type Product = {
  Id: string;
  Name: string;
  DefaultPricePerUnit: number;
};

export const NozzleConfigSchema = z.object({
  LogicalNumber: z.number(),
  PhysicalNumber: z.number(),
  ProductRef: z.string(),
});

export const PumpConfigSchema = z.object({
  Type: z.string(),
  Number: z.number(),
  EnableService: z.boolean(),
  Nozzles: z.array(NozzleConfigSchema),
});

export const ConfigurationSchema = z.object({
  Products: z.array(z.object({
    Id: z.string(),
    Name: z.string(),
    DefaultPricePerUnit: z.number(),
  })),
  Pumps: z.array(PumpConfigSchema),
});

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
});

export const PumpValueSchema = z.object({
  Number: z.number(),
  Status: PumpStatusSchema,
  EnableService: z.boolean(),
  LockTag: z.string(),
  Nozzles: z.array(z.object({
    Number: z.number(),
    ProductRef: z.string(),
    VolumeTotalCounter: z.number(),
    AmountTotalCounter: z.number(),
    DefaultPricePerUnit: z.number(),
  })),
  Transaction: TransactionSchema,
});

export const EquipmentStateSchema = z.object({
  SessionId: z.string(),
  Messages: z.number(),
  PumpValuesCollection: z.array(PumpValueSchema),
});

export type PumpStatus = z.infer<typeof PumpStatusSchema>;
export type PumpConfig = z.infer<typeof PumpConfigSchema>;
export type Configuration = z.infer<typeof ConfigurationSchema>;
export type PumpValue = z.infer<typeof PumpValueSchema>;
export type EquipmentState = z.infer<typeof EquipmentStateSchema>;

export const PUMP_STATUS = {
  ERROR: 0,
  OFF: 1, // Свободен
  PRESET: 2, // установлена доза
  CALL: 3, // 
  CALL_ERROR: 4,
  BUSY: 5, // идет отпуск
  BUSY_OVERFLOW: 6,
  WAIT_OFF_OVERFLOW: 7,
  WAIT_OFF_REMAINDER: 8, // Остаток
  WAIT_OFF: 9,
  WAIT_RESET: 10, // Ожидает обработки
} as const;

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
