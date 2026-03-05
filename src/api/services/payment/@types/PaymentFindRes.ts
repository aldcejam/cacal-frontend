export type PaymentFindRes = {
  id?: string;
  name?: string;
  type?: string;
  bankId?: string;
  personName?: string;
  details?: Record<string, unknown>;
};
