import { userGateway } from "./services/user/userGateway";
import { transactionGateway } from "./services/transaction/transactionGateway";
import { incomeGateway } from "./services/income/incomeGateway";
import { recurringExpenseGateway } from "./services/recurringExpense/recurringExpenseGateway";
import { cardGateway } from "./services/card/cardGateway";
import { bankGateway } from "./services/bank/bankGateway";
import { authGateway } from "./services/auth/authGateway";

export const api = {
  user: userGateway,
  transaction: transactionGateway,
  income: incomeGateway,
  recurringExpense: recurringExpenseGateway,
  card: cardGateway,
  bank: bankGateway,
  auth: authGateway,
};
