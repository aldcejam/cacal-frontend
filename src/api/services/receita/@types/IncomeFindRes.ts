import type { UserSummary } from "../../shared/@types/UserSummary";

export type IncomeFindRes = {
  id?: string;
  descricao?: string;
  categoria?: string;
  valor?: number;
  diaRecebimento?: number;
  user?: UserSummary;
  createdAt?: string;
  updatedAt?: string;
};
