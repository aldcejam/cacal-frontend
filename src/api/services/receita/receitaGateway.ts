import { gerarService } from "../gerarService";
import type { ServiceInputProps } from "../ServiceInputProps";
import type { IncomeFindRes } from "./@types/IncomeFindRes";
import type { IncomeSaveReq } from "./@types/IncomeSaveReq";
import type { IncomeSaveRes } from "./@types/IncomeSaveRes";

export const receitaGateway = {
  findAll: async (input: ServiceInputProps<null, { start?: string; end?: string }>) =>
    await gerarService<Array<IncomeFindRes>>({
      endpoint: `/receitas`,
      method: "GET",
      options: input,
    }),

  save: async (input: ServiceInputProps<IncomeSaveReq, null>) =>
    await gerarService<IncomeSaveRes>({
      endpoint: `/receitas`,
      method: "POST",
      options: input,
    }),

  findById: async (id: string, input: ServiceInputProps<null, null>) =>
    await gerarService<IncomeFindRes>({
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
