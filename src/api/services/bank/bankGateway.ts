import { gerarService } from "../gerarService";
import type { ServiceInputProps } from "../ServiceInputProps";
import type { BankFindRes } from "./@types/BankFindRes";
import type { BankSaveReq } from "./@types/BankSaveReq";
import type { BankSaveRes } from "./@types/BankSaveRes";

export const bankGateway = {
  findAll: async (input: ServiceInputProps<null, null>) =>
    await gerarService<Array<BankFindRes>>({
      endpoint: `/banks`,
      method: "GET",
      options: input,
    }),

  save: async (input: ServiceInputProps<BankSaveReq, null>) =>
    await gerarService<BankSaveRes>({
      endpoint: `/banks`,
      method: "POST",
      options: input,
    }),

  findById: async (id: string, input: ServiceInputProps<null, null>) =>
    await gerarService<BankFindRes>({
      endpoint: `/banks/${id}`,
      method: "GET",
      options: input,
    }),

  deleteById: async (id: string, input: ServiceInputProps<null, null>) =>
    await gerarService<void>({
      endpoint: `/banks/${id}`,
      method: "DELETE",
      options: input,
    }),

};
