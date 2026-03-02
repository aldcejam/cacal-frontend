import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/api';
import type { CardFindRes } from '../../api/services/card/@types/CardFindRes';

export const useCartoes = () => {
    return useQuery<CardFindRes[]>({
        queryKey: ['cartoes'],
        queryFn: () => api.card.findAll({}),
    });
};
