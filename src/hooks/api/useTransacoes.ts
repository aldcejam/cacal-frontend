import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/api';
import type { TransactionFindRes } from '../../api/services/transaction/@types/TransactionFindRes';

export const useTransacoes = () => {
    return useQuery<TransactionFindRes[]>({
        queryKey: ['transacoes'],
        queryFn: () => api.transaction.findAll({}),
    });
};
