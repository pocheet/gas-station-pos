// src/types/api.ts
export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export interface LockPumpResponse extends ApiResponse {
  lockTag: string;
}

export interface StartTransactionResponse extends ApiResponse {
  transactionId: string;
}
