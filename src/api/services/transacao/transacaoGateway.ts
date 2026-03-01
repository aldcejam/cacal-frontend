import { gerarService } from "../gerarService";
import type { ServiceInputProps } from "../ServiceInputProps";
import type { TransactionFindRes } from "./@types/TransactionFindRes";
import type { TransactionSaveReq } from "./@types/TransactionSaveReq";
import type { TransactionSaveRes } from "./@types/TransactionSaveRes";

export const transacaoGateway = {
  findAll: async (input: ServiceInputProps<null, { start?: string; end?: string }>) =>
    await gerarService<Array<TransactionFindRes>>({
      endpoint: `/transacoes`,
      method: "GET",
      options: input,
    }),

  save: async (input: ServiceInputProps<TransactionSaveReq, null>) =>
    await gerarService<TransactionSaveRes>({
      endpoint: `/transacoes`,
      method: "POST",
      options: input,
    }),

  findById: async (id: string, input: ServiceInputProps<null, null>) =>
    await gerarService<TransactionFindRes>({
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
