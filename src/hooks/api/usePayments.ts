import { useQuery } from '@tanstack/react-query';
import { paymentGateway } from '../../api/services/payment/paymentGateway';
import type { PaymentFindRes } from '../../api/services/payment/@types/PaymentFindRes';

export function usePayments() {
    return useQuery<PaymentFindRes[], Error>({
        queryKey: ['payments'],
        queryFn: async () => {
            const data = await paymentGateway.findAll({});
            return data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}
