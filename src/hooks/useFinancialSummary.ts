import { useMemo } from 'react';
import { useTransacoes } from './api/useTransacoes';
import { useCartoes } from './api/useCartoes';
import { useGastosRecorrentes } from './api/useGastosRecorrentes';
import { useReceitas } from './api/useReceitas';
import { useUsuarios } from './api/useUsuarios';

export const useFinancialSummary = () => {
    const { data: transactions = [], isLoading: loadingTrans, error: errorTrans } = useTransacoes();
    const { data: cards = [], isLoading: loadingCards, error: errorCards } = useCartoes();
    const { data: recurringExpenses = [], isLoading: loadingRecur, error: errorRecur } = useGastosRecorrentes();
    const { data: receitas = [], isLoading: loadingReceitas, error: errorReceitas } = useReceitas();
    const { data: usuarios = [], isLoading: loadingUsers, error: errorUsers } = useUsuarios();

    const loading = loadingTrans || loadingCards || loadingRecur || loadingReceitas || loadingUsers;
    const error = errorTrans || errorCards || errorRecur || errorReceitas || errorUsers ? "Failed to load financial data" : null;

    const totalGastos = useMemo(() => {
        return recurringExpenses.reduce((acc, curr) => acc + (curr.value || 0), 0);
    }, [recurringExpenses]);

    const totalCartoes = useMemo(() => {
        return cards.length;
    }, [cards]);

    const totalLimite = useMemo(() => {
        return cards.reduce((acc, card) => acc + (card.limitValue || 0), 0);
    }, [cards]);

    const totalDisponivel = useMemo(() => {
        return cards.reduce((acc, card) => acc + (card.available || 0), 0);
    }, [cards]);

    return {
        totalGastos,
        totalCartoes,
        totalLimite,
        totalDisponivel,
        transactions,
        cards,
        recurringExpenses,
        receitas,
        usuarios,
        loading,
        error
    };
};
