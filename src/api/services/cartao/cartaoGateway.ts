import { gerarService } from "../gerarService";
import type { ServiceInputProps } from "../ServiceInputProps";
import type { CardFindRes } from "./@types/CardFindRes";
import type { CardSaveReq } from "./@types/CardSaveReq";
import type { CardSaveRes } from "./@types/CardSaveRes";

export const cartaoGateway = {
  findAll: async (input: ServiceInputProps<null, { start?: string; end?: string }>) =>
    await gerarService<Array<CardFindRes>>({
      endpoint: `/cartoes`,
      method: "GET",
      options: input,
    }),

  save: async (input: ServiceInputProps<CardSaveReq, null>) =>
    await gerarService<CardSaveRes>({
      endpoint: `/cartoes`,
      method: "POST",
      options: input,
    }),

  findById: async (id: string, input: ServiceInputProps<null, null>) =>
    await gerarService<CardFindRes>({
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
