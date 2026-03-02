import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/api';
import type { User } from '../../api/services/user/@types/User';

export const useUsuarios = () => {
    return useQuery<User[]>({
        queryKey: ['usuarios'],
        queryFn: () => api.user.findAll({}),
    });
};
