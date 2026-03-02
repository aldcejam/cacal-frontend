import { gerarService } from "../gerarService";
import type { ServiceInputProps } from "../ServiceInputProps";
import type { CardFindRes } from "./@types/CardFindRes";
import type { CardSaveReq } from "./@types/CardSaveReq";
import type { CardSaveRes } from "./@types/CardSaveRes";

export const cardGateway = {
  findAll: async (input: ServiceInputProps<null, { start?: string; end?: string }>) =>
    await gerarService<Array<CardFindRes>>({
      endpoint: `/cards`,
      method: "GET",
      options: input,
    }),

  save: async (input: ServiceInputProps<CardSaveReq, null>) =>
    await gerarService<CardSaveRes>({
      endpoint: `/cards`,
      method: "POST",
      options: input,
    }),

  findById: async (id: string, input: ServiceInputProps<null, null>) =>
    await gerarService<CardFindRes>({
      endpoint: `/cards/${id}`,
      method: "GET",
      options: input,
    }),

  deleteById: async (id: string, input: ServiceInputProps<null, null>) =>
    await gerarService<void>({
      endpoint: `/cards/${id}`,
      method: "DELETE",
      options: input,
    }),

};
