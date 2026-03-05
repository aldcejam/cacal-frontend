import { gerarService } from "../gerarService";
import type { ServiceInputProps } from "../ServiceInputProps";
import type { PaymentFindRes } from "./@types/PaymentFindRes";
import type { PaymentSaveReq } from "./@types/PaymentSaveReq";

export const paymentGateway = {
  findById: async (id: string, input: ServiceInputProps<null, null>) =>
    await gerarService<PaymentFindRes>({
      endpoint: `/api/payments/${id}`,
      method: "GET",
      options: input,
    }),

  update: async (id: string, input: ServiceInputProps<PaymentSaveReq, null>) =>
    await gerarService<PaymentFindRes>({
      endpoint: `/api/payments/${id}`,
      method: "PUT",
      options: input,
    }),

  delete: async (id: string, input: ServiceInputProps<null, null>) =>
    await gerarService<void>({
      endpoint: `/api/payments/${id}`,
      method: "DELETE",
      options: input,
    }),

  findAll: async (input: ServiceInputProps<null, null>) =>
    await gerarService<Array<PaymentFindRes>>({
      endpoint: `/api/payments`,
      method: "GET",
      options: input,
    }),

  save: async (input: ServiceInputProps<PaymentSaveReq, null>) =>
    await gerarService<void>({
      endpoint: `/api/payments`,
      method: "POST",
      options: input,
    }),

};
