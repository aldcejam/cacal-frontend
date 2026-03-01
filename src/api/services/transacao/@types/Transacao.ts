import type { Cartao } from "../../cartao/@types/Cartao";

export type Transacao = {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  card?: Cartao;
  description?: string;
  category?: string;
  value?: number;
  parcels?: string;
  total?: number;
};
