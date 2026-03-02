import { gerarService } from "../gerarService";
import type { ServiceInputProps } from "../ServiceInputProps";
import type { ExpenseFindRes } from "./@types/ExpenseFindRes";
import type { ExpenseSaveReq } from "./@types/ExpenseSaveReq";
import type { ExpenseSaveRes } from "./@types/ExpenseSaveRes";

export const recurringExpenseGateway = {
  findAll: async (input: ServiceInputProps<null, { start?: string; end?: string }>) =>
    await gerarService<Array<ExpenseFindRes>>({
      endpoint: `/gastosRecorrentes`,
      method: "GET",
      options: input,
    }),

  save: async (input: ServiceInputProps<ExpenseSaveReq, null>) =>
    await gerarService<ExpenseSaveRes>({
      endpoint: `/gastosRecorrentes`,
      method: "POST",
      options: input,
    }),

  findById: async (id: string, input: ServiceInputProps<null, null>) =>
    await gerarService<ExpenseFindRes>({
      endpoint: `/gastosRecorrentes/${id}`,
      method: "GET",
      options: input,
    }),

  deleteById: async (id: string, input: ServiceInputProps<null, null>) =>
    await gerarService<void>({
      endpoint: `/gastosRecorrentes/${id}`,
      method: "DELETE",
      options: input,
    }),

};
