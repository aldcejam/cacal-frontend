import type { Usuario } from "../../usuario/@types/Usuario";

export type GastoRecorrente = {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  user?: Usuario;
  pagamento?: string;
  descricao?: string;
  categoria?: string;
  valor?: number;
};
