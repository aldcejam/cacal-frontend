import type { TransactionFindRes } from "./TransactionFindRes";

export type MonthSummary = {
  pendingToPay?: number;
  leftover?: number;
  periodTransactions?: Array<TransactionFindRes>;
};
