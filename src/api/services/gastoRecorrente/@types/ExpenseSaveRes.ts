import type { UserSummary } from "../../shared/@types/UserSummary";

export type ExpenseSaveRes = {
  id?: string;
  pagamento?: string;
  descricao?: string;
  categoria?: string;
  valor?: number;
  user?: UserSummary;
  createdAt?: string;
};
