import type { UserSummary } from "../../user/@types/UserSummary";
import type { BankSummary } from "../../bank/@types/BankSummary";

export type CardSaveRes = {
  id?: string;
  lastDigits?: string;
  limitValue?: number;
  available?: number;
  dueDate?: string;
  closingDate?: string;
  user?: UserSummary;
  bank?: BankSummary;
  createdAt?: string;
};
