import type { Usuario } from "../../usuario/@types/Usuario";
import type { Banco } from "../../banco/@types/Banco";

export type Cartao = {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  lastDigits?: string;
  limitValue?: number;
  available?: number;
  dueDate?: string;
  closingDate?: string;
  user?: Usuario;
  bank?: Banco;
};
