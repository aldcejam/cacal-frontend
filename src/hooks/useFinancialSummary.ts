import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { transactionGateway } from '../api/services/transaction/transactionGateway';
import { paymentGateway } from '../api/services/payment/paymentGateway';
import { useUsuarios } from './api/useUsuarios';

export const useFinancialSummary = () => {

    // Custom unified query for the MonthSummary payload
    const { data: summaryData, isLoading: loadingSummary, error: errorSummary } = useQuery({
        queryKey: ['transactions', 'summary'],
        queryFn: () => transactionGateway.getSummary({})
    });

    const { data: payments = [], isLoading: loadingPayments, error: errorPayments } = useQuery({
        queryKey: ['payments'],
        queryFn: () => paymentGateway.findAll({})
    });

    const { data: usuarios = [], isLoading: loadingUsers, error: errorUsers } = useUsuarios();

    const loading = loadingSummary || loadingPayments || loadingUsers;
    console.error("errorSummary:", errorSummary, "errorPayments:", errorPayments, "errorUsers:", errorUsers);
    const error = errorSummary || errorPayments || errorUsers ? "Failed to load financial data" : null;

    return {
        summaryData,
        payments,
        usuarios,
        loading,
        error
    };
};
