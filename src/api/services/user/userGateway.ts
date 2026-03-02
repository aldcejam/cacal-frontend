import { gerarService } from "../gerarService";
import type { ServiceInputProps } from "../ServiceInputProps";
import type { User } from "./@types/User";

export const userGateway = {
  findAll: async (input: ServiceInputProps<null, null>) =>
    await gerarService<Array<User>>({
      endpoint: `/users`,
      method: "GET",
      options: input,
    }),

  save: async (input: ServiceInputProps<User, null>) =>
    await gerarService<User>({
      endpoint: `/users`,
      method: "POST",
      options: input,
    }),

  findById: async (id: string, input: ServiceInputProps<null, null>) =>
    await gerarService<User>({
      endpoint: `/users/${id}`,
      method: "GET",
      options: input,
    }),

  deleteById: async (id: string, input: ServiceInputProps<null, null>) =>
    await gerarService<void>({
      endpoint: `/users/${id}`,
      method: "DELETE",
      options: input,
    }),

};
