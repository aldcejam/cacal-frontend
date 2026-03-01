import { gerarService } from "../gerarService";
import type { ServiceInputProps } from "../ServiceInputProps";
import type { Usuario } from "./@types/Usuario";

export const usuarioGateway = {
  findAll: async (input: ServiceInputProps<null, null>) =>
    await gerarService<Array<Usuario>>({
      endpoint: `/usuarios`,
      method: "GET",
      options: input,
    }),

  save: async (input: ServiceInputProps<Usuario, null>) =>
    await gerarService<Usuario>({
      endpoint: `/usuarios`,
      method: "POST",
      options: input,
    }),

  findById: async (id: string, input: ServiceInputProps<null, null>) =>
    await gerarService<Usuario>({
      endpoint: `/usuarios/${id}`,
      method: "GET",
      options: input,
    }),

  deleteById: async (id: string, input: ServiceInputProps<null, null>) =>
    await gerarService<void>({
      endpoint: `/usuarios/${id}`,
      method: "DELETE",
      options: input,
    }),

};
