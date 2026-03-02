import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/api';
import type { ExpenseFindRes } from '../../api/services/recurringExpense/@types/ExpenseFindRes';

export const useGastosRecorrentes = () => {
    return useQuery<ExpenseFindRes[]>({
        queryKey: ['gastosRecorrentes'],
        queryFn: () => api.recurringExpense.findAll({}),
    });
};
