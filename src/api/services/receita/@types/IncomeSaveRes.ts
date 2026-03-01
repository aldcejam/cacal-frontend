import type { UserSummary } from "../../shared/@types/UserSummary";

export type IncomeSaveRes = {
  id?: string;
  descricao?: string;
  categoria?: string;
  valor?: number;
  diaRecebimento?: number;
  user?: UserSummary;
  createdAt?: string;
};
