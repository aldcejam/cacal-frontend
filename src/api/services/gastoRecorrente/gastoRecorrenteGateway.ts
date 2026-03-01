import { gerarService } from "../gerarService";
import type { ServiceInputProps } from "../ServiceInputProps";
import type { GastoRecorrente } from "./@types/GastoRecorrente";

export const gastoRecorrenteGateway = {
  findAll: async (input: ServiceInputProps<null, { start?: string; end?: string }>) =>
    await gerarService<Array<GastoRecorrente>>({
      endpoint: `/gastosRecorrentes`,
      method: "GET",
      options: input,
    }),

  save: async (input: ServiceInputProps<GastoRecorrente, null>) =>
    await gerarService<GastoRecorrente>({
      endpoint: `/gastosRecorrentes`,
      method: "POST",
      options: input,
    }),

  findById: async (id: string, input: ServiceInputProps<null, null>) =>
    await gerarService<GastoRecorrente>({
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
