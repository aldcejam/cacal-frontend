import { gerarService } from "../gerarService";
import type { ServiceInputProps } from "../ServiceInputProps";
import type { RegisterReq } from "./@types/RegisterReq";
import type { AuthRes } from "./@types/AuthRes";
import type { LoginReq } from "./@types/LoginReq";

export const authGateway = {
  register: async (input: ServiceInputProps<RegisterReq, null>) =>
    await gerarService<AuthRes>({
      endpoint: `/auth/register`,
      method: "POST",
      options: input,
    }),

  login: async (input: ServiceInputProps<LoginReq, null>) =>
    await gerarService<AuthRes>({
      endpoint: `/auth/login`,
      method: "POST",
      options: input,
    }),

};
