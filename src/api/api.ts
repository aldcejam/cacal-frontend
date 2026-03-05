import { transactionGateway } from "./services/transaction/transactionGateway";
import { paymentGateway } from "./services/payment/paymentGateway";
import { userGateway } from "./services/user/userGateway";
import { bankGateway } from "./services/bank/bankGateway";
import { authGateway } from "./services/auth/authGateway";

export const api = {
  transaction: transactionGateway,
  payment: paymentGateway,
  user: userGateway,
  bank: bankGateway,
  auth: authGateway,
};
