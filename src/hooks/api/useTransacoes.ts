import { useQuery } from '@tanstack/react-query';
import { transactionGateway } from '../../api/services/transaction/transactionGateway';
import type { TransactionFindRes } from '../../api/services/transaction/@types/TransactionFindRes';

export const useTransacoes = (type?: string) => {
    return useQuery<TransactionFindRes[]>({
        queryKey: ['transacoes', type],
        queryFn: () => transactionGateway.getAll({ query: { type } }),
    });
};
