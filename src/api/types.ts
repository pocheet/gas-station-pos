// src/api/types.ts
export interface Product {
  Id: string;
  Name: string;
  DefaultPricePerUnit: number;
}

export interface NozzleConfig {
  LogicalNumber: number;
  PhysicalNumber: number;
  ProductRef: string;
}

export interface PumpConfig {
  Type: string;
  Number: number;
  EnableService: boolean;
  AutoOverflowControl: boolean;
  MaxPresetVolume: number;
  MinPresetVolume: number;
  OverflowThreshold: number;
  EnableAutoStartTransaction: boolean;
  Nozzles: NozzleConfig[];
}

export interface Configuration {
  Products: Product[];
  Pumps: Pump[];
  TankGaugingDevices: any;
}

// Используем const объект вместо enum
export const PumpStatus = {
  Error: 0,
  Off: 1,
  Preset: 2,
  Call: 3,
  CallError: 4,
  Busy: 5,
  BusyOverflow: 6,
  WaitOffOverflow: 7,
  WaitOffRemainder: 8,
  WaitOff: 9,
  WaitReset: 10,
} as const;

export type PumpStatusType = typeof PumpStatus[keyof typeof PumpStatus];

export interface NozzleValue {
  Number: number;
  ProductRef: string;
  AmountTotalCounter: number;
  VolumeTotalCounter: number;
  DefaultPricePerUnit: number;
}

export interface Transaction {
  TransactionId: string;
  IsInternalPreset: boolean;
  PresetTimeStamp: string;
  DoneTimeStamp: string;
  ResetTimeStamp: string;
  ProductId: string;
  PumpNumber: number;
  NozzleNumber: number;
  PayFormCode: number;
  PricePerUnit: number;
  IsAmountPreset: boolean;
  PresetAmount: number;
  PresetVolume: number;
  RealTimeAmount: number;
  RealTimeVolume: number;
  TotalAmountCounterBefore: number;
  TotalAmountCounterAfter: number;
  TotalVolumeCounterBefore: number;
  TotalVolumeCounterAfter: number;
  AttachedData: any;
}

export interface PumpValue {
  Number: number;
  LockTag: string;
  PollException: string;
  Nozzles: NozzleValue[];
  Transaction: Transaction;
  SelectedNozzle: number | null;
  Status: PumpStatusType;
  EnableService: boolean;
  EnableAutoStartTransaction: boolean;
}

export interface EquipmentState {
  SessionId: string;
  Messages: number;
  PumpValuesCollection: PumpValue[];
  TankGaugingValuesCollection: any;
}

// Добавляем недостающий тип Pump
export interface Pump {
  Type: string;
  Number: number;
  EnableService: boolean;
  AutoOverflowControl: boolean;
  MaxPresetVolume: number;
  MinPresetVolume: number;
  OverflowThreshold: number;
  EnableAutoStartTransaction: boolean;
  Nozzles: NozzleConfig[];
}
