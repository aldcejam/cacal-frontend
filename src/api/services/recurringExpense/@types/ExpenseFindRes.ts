import type { UserSummary } from "../../user/@types/UserSummary";

export type ExpenseFindRes = {
  id?: string;
  paymentMethod?: string;
  description?: string;
  category?: string;
  value?: number;
  user?: UserSummary;
  createdAt?: string;
  updatedAt?: string;
};
