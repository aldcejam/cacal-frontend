export type TransactionSaveReq = {
  description: string;
  category: string;
  value: number;
  paymentId?: string;
  type: string;
  isPaid: boolean;
  recurrenceDetails?: Record<string, unknown>;
};
