import type { UserSummary } from "../../user/@types/UserSummary";

export type IncomeSaveRes = {
  id?: string;
  description?: string;
  category?: string;
  value?: number;
  receiptDay?: number;
  user?: UserSummary;
  createdAt?: string;
};
