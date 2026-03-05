export type PaymentSaveReq = {
  name: string;
  type: string;
  bankId?: string;
  personName?: string;
  details?: Record<string, unknown>;
};
