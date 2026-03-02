import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/api';
import type { IncomeSaveReq } from '../../api/services/income/@types/IncomeSaveReq';
import { toast } from 'react-toastify';

export const useCreateReceita = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: IncomeSaveReq) => api.income.save({ body: data }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['receitas'] });
            toast.success('Receita criada com sucesso!');
        },
        onError: (error: any) => {
            toast.error(error?.detail || 'Erro ao criar receita');
        }
    });
};
