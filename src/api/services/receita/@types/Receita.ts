import type { Usuario } from "../../usuario/@types/Usuario";

export type Receita = {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  user?: Usuario;
  descricao?: string;
  categoria?: string;
  valor?: number;
  diaRecebimento?: number;
};
