import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/api';
import type { IncomeFindRes } from '../../api/services/income/@types/IncomeFindRes';

export const useReceitas = () => {
    return useQuery<IncomeFindRes[]>({
        queryKey: ['receitas'],
        queryFn: () => api.income.findAll({}),
    });
};
