import { gerarService } from "../gerarService";
import type { ServiceInputProps } from "../ServiceInputProps";
import type { Cartao } from "./@types/Cartao";

export const cartaoGateway = {
  findAll: async (input: ServiceInputProps<null, { start?: string; end?: string }>) =>
    await gerarService<Array<Cartao>>({
      endpoint: `/cartoes`,
      method: "GET",
      options: input,
    }),

  save: async (input: ServiceInputProps<Cartao, null>) =>
    await gerarService<Cartao>({
      endpoint: `/cartoes`,
      method: "POST",
      options: input,
    }),

  findById: async (id: string, input: ServiceInputProps<null, null>) =>
    await gerarService<Cartao>({
      endpoint: `/cartoes/${id}`,
      method: "GET",
      options: input,
    }),

  deleteById: async (id: string, input: ServiceInputProps<null, null>) =>
    await gerarService<void>({
      endpoint: `/cartoes/${id}`,
      method: "DELETE",
      options: input,
    }),

};
