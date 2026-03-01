import { gerarService } from "../gerarService";
import type { ServiceInputProps } from "../ServiceInputProps";
import type { Transacao } from "./@types/Transacao";

export const transacaoGateway = {
  findAll: async (input: ServiceInputProps<null, { start?: string; end?: string }>) =>
    await gerarService<Array<Transacao>>({
      endpoint: `/transacoes`,
      method: "GET",
      options: input,
    }),

  save: async (input: ServiceInputProps<Transacao, null>) =>
    await gerarService<Transacao>({
      endpoint: `/transacoes`,
      method: "POST",
      options: input,
    }),

  findById: async (id: string, input: ServiceInputProps<null, null>) =>
    await gerarService<Transacao>({
      endpoint: `/transacoes/${id}`,
      method: "GET",
      options: input,
    }),

  deleteById: async (id: string, input: ServiceInputProps<null, null>) =>
    await gerarService<void>({
      endpoint: `/transacoes/${id}`,
      method: "DELETE",
      options: input,
    }),

};
