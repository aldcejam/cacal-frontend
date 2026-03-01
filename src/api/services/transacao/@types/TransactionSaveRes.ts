import type { CardSummary } from "../../shared/@types/CardSummary";

export type TransactionSaveRes = {
  id?: string;
  description?: string;
  category?: string;
  value?: number;
  parcels?: string;
  total?: number;
  card?: CardSummary;
  createdAt?: string;
};
