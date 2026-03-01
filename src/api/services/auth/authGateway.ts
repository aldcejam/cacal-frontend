import { gerarService } from "../gerarService";
import type { ServiceInputProps } from "../ServiceInputProps";
import type { RegisterRequest } from "./@types/RegisterRequest";
import type { AuthResponse } from "./@types/AuthResponse";
import type { LoginRequest } from "./@types/LoginRequest";

export const authGateway = {
  register: async (input: ServiceInputProps<RegisterRequest, null>) =>
    await gerarService<AuthResponse>({
      endpoint: `/auth/register`,
      method: "POST",
      options: input,
    }),

  login: async (input: ServiceInputProps<LoginRequest, null>) =>
    await gerarService<AuthResponse>({
      endpoint: `/auth/login`,
      method: "POST",
      options: input,
    }),

};
