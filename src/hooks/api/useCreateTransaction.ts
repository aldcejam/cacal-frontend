import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionGateway } from '../../api/services/transaction/transactionGateway';
import type { TransactionSaveReq } from '../../api/services/transaction/@types/TransactionSaveReq';
import { toast } from 'react-toastify';

export const useCreateTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: TransactionSaveReq) => transactionGateway.create({ body: data }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transacoes'] });
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            toast.success('Transação criada com sucesso!');
        },
        onError: (error: any) => {
            toast.error(error?.detail || 'Erro ao criar transação');
        }
    });
};
