import { gerarService } from "../gerarService";
import type { ServiceInputProps } from "../ServiceInputProps";
import type { TransactionFindRes } from "./@types/TransactionFindRes";
import type { TransactionSaveReq } from "./@types/TransactionSaveReq";
import type { MonthSummary } from "./@types/MonthSummary";
import type { TransactionFilterDto } from "./@types/TransactionFilterDto";

export const transactionGateway = {
  getById: async (id: string, input: ServiceInputProps<null, null>) =>
    await gerarService<TransactionFindRes>({
      endpoint: `/api/transactions/${id}`,
      method: "GET",
      options: input,
    }),

  update: async (id: string, input: ServiceInputProps<TransactionSaveReq, null>) =>
    await gerarService<TransactionFindRes>({
      endpoint: `/api/transactions/${id}`,
      method: "PUT",
      options: input,
    }),

  delete: async (id: string, input: ServiceInputProps<null, null>) =>
    await gerarService<void>({
      endpoint: `/api/transactions/${id}`,
      method: "DELETE",
      options: input,
    }),

  getAll: async (input: ServiceInputProps<null, { filter?: TransactionFilterDto }>) =>
    await gerarService<Array<TransactionFindRes>>({
      endpoint: `/api/transactions`,
      method: "GET",
      options: input,
    }),

  create: async (input: ServiceInputProps<TransactionSaveReq, null>) =>
    await gerarService<void>({
      endpoint: `/api/transactions`,
      method: "POST",
      options: input,
    }),

  getSummary: async (input: ServiceInputProps<null, null>) =>
    await gerarService<MonthSummary>({
      endpoint: `/api/transactions/summary`,
      method: "GET",
      options: input,
    }),

};
