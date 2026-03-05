import type { UserRes } from "../../user/@types/UserRes";

export type TransactionFindRes = {
  id?: string;
  description?: string;
  category?: string;
  value?: number;
  paymentId?: string;
  paymentName?: string;
  type?: string;
  isPaid?: boolean;
  recurrenceDetails?: Record<string, unknown>;
  user?: UserRes;
};
