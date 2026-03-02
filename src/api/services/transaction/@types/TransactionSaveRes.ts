import type { CardSummary } from "../../card/@types/CardSummary";

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
