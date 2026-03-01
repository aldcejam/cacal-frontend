import { usuarioGateway } from "./services/usuario/usuarioGateway";
import { transacaoGateway } from "./services/transacao/transacaoGateway";
import { receitaGateway } from "./services/receita/receitaGateway";
import { gastoRecorrenteGateway } from "./services/gastoRecorrente/gastoRecorrenteGateway";
import { cartaoGateway } from "./services/cartao/cartaoGateway";
import { bancoGateway } from "./services/banco/bancoGateway";
import { authGateway } from "./services/auth/authGateway";

export const api = {
  usuario: usuarioGateway,
  transacao: transacaoGateway,
  receita: receitaGateway,
  gastoRecorrente: gastoRecorrenteGateway,
  cartao: cartaoGateway,
  banco: bancoGateway,
  auth: authGateway,
};
