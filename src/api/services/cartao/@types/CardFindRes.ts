import type { UserSummary } from "../../shared/@types/UserSummary";
import type { BankSummary } from "../../shared/@types/BankSummary";

export type CardFindRes = {
  id?: string;
  lastDigits?: string;
  limitValue?: number;
  available?: number;
  dueDate?: string;
  closingDate?: string;
  user?: UserSummary;
  bank?: BankSummary;
  createdAt?: string;
  updatedAt?: string;
};
