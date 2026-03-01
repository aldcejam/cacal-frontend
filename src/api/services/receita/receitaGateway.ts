import { gerarService } from "../gerarService";
import type { ServiceInputProps } from "../ServiceInputProps";
import type { Receita } from "./@types/Receita";

export const receitaGateway = {
  findAll: async (input: ServiceInputProps<null, { start?: string; end?: string }>) =>
    await gerarService<Array<Receita>>({
      endpoint: `/receitas`,
      method: "GET",
      options: input,
    }),

  save: async (input: ServiceInputProps<Receita, null>) =>
    await gerarService<Receita>({
      endpoint: `/receitas`,
      method: "POST",
      options: input,
    }),

  findById: async (id: string, input: ServiceInputProps<null, null>) =>
    await gerarService<Receita>({
      endpoint: `/receitas/${id}`,
      method: "GET",
      options: input,
    }),

  deleteById: async (id: string, input: ServiceInputProps<null, null>) =>
    await gerarService<void>({
      endpoint: `/receitas/${id}`,
      method: "DELETE",
      options: input,
    }),

};
