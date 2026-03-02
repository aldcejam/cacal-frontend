import type { UserSummary } from "../../user/@types/UserSummary";

export type ExpenseSaveRes = {
  id?: string;
  paymentMethod?: string;
  description?: string;
  category?: string;
  value?: number;
  user?: UserSummary;
  createdAt?: string;
};
