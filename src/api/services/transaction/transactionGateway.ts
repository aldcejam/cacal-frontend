import { gerarService } from "../gerarService";
import type { ServiceInputProps } from "../ServiceInputProps";
import type { TransactionFindRes } from "./@types/TransactionFindRes";
import type { TransactionSaveReq } from "./@types/TransactionSaveReq";
import type { TransactionSaveRes } from "./@types/TransactionSaveRes";

export const transactionGateway = {
  findAll: async (input: ServiceInputProps<null, { start?: string; end?: string }>) =>
    await gerarService<Array<TransactionFindRes>>({
      endpoint: `/transactions`,
      method: "GET",
      options: input,
    }),

  save: async (input: ServiceInputProps<TransactionSaveReq, null>) =>
    await gerarService<TransactionSaveRes>({
      endpoint: `/transactions`,
      method: "POST",
      options: input,
    }),

  findById: async (id: string, input: ServiceInputProps<null, null>) =>
    await gerarService<TransactionFindRes>({
      endpoint: `/transactions/${id}`,
      method: "GET",
      options: input,
    }),

  deleteById: async (id: string, input: ServiceInputProps<null, null>) =>
    await gerarService<void>({
      endpoint: `/transactions/${id}`,
      method: "DELETE",
      options: input,
    }),

};
