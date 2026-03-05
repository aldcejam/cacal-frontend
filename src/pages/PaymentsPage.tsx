import { useState, useMemo, useEffect } from 'react';
import { useTransacoes } from '../hooks/api/useTransacoes';
import { usePayments } from '../hooks/api/usePayments';
import { useUsuarios } from '../hooks/api/useUsuarios';

import { UserSelector } from '../components/organisms/UserSelector';
import { PaymentList } from '../components/organisms/PaymentList';
import { TransactionTable } from '../components/organisms/TransactionTable';

interface SortConfig {
    key: any;
    direction: 'asc' | 'desc';
}

export default function PaymentsPage() {
    const { data: transactions = [], isLoading: loadingTrans, error: errorTrans } = useTransacoes();
    const { data: payments = [], isLoading: loadingPayments, error: errorPayments } = usePayments();
    const { data: usuarios = [], isLoading: loadingUsers, error: errorUsers } = useUsuarios();

    const loading = loadingTrans || loadingPayments || loadingUsers;
    const error = errorTrans || errorPayments || errorUsers ? "Failed to load payment data" : null;

    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [selectedPaymentIds, setSelectedPaymentIds] = useState<string[]>([]);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });


    useEffect(() => {
        // Initialize selected user being the first one (simulating current user)
        if (usuarios.length > 0 && selectedUserIds.length === 0) {
            const firstId = usuarios[0].id;
            if (firstId) setSelectedUserIds([firstId]);
        }
    }, [usuarios, selectedUserIds.length]);

    const currentUser = usuarios.length > 0 ? usuarios[0] : null;

    // --- Handlers ---

    const handleToggleUser = (userId: string) => {
        setSelectedUserIds(prev => {
            if (prev.includes(userId)) {
                return prev.filter(id => id !== userId);
                // Currently payments don't directly map to a 'User' like cards did (cards had user.id). 
                // We'll just manage standard filtering based on what's available.
            }
            return [...prev, userId];
        });
    };

    const handleTogglePayment = (id: string) => {
        setSelectedPaymentIds(prev => {
            if (prev.includes(id)) {
                return prev.filter(paymentId => paymentId !== id);
            }
            return [...prev, id];
        });
    };

    const handleSort = (key: any) => {
        if (!key) return;
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    // --- Derived State ---

    // Filtrar transações por usuário selecionado. Payments do not have direct user_id on front anymore, so we filter transactions.
    const availablePayments = payments; // In real case, filter this by users who own the payment if you add user in Payment entity

    const filteredTransactions = useMemo(() => {
        let data = transactions;

        // Filtrar transações de usuários selecionados
        data = data.filter(t => t.user?.id && selectedUserIds.includes(t.user.id));

        // Filtrar por pagamentos selecionados
        if (selectedPaymentIds.length > 0) {
            data = data.filter(t => t.paymentId && selectedPaymentIds.includes(t.paymentId));
        }

        if (sortConfig.key) {
            data = [...data].sort((a, b) => {
                let valA: number, valB: number;

                if (sortConfig.key === 'value') {
                    valA = a.value || 0;
                    valB = b.value || 0;
                } else {
                    valA = a.value || 0;
                    valB = b.value || 0;
                }

                if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
                if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return data;
    }, [selectedPaymentIds, sortConfig, selectedUserIds, transactions]);

    const getSelectedPaymentNames = () => {
        if (selectedPaymentIds.length === 0) return '';
        if (selectedPaymentIds.length === availablePayments.length) return 'Todos os Meios de Pagamento';

        const names = availablePayments
            .filter(p => p.id && selectedPaymentIds.includes(p.id))
            .map(p => p.name || 'Pagamento');

        if (names.length <= 2) return names.join(' e ');
        return `${names[0]} e mais ${names.length - 1}`;
    };

    const Header = () => (
        <header className="flex items-center justify-between mb-8 pt-2 md:pt-0 pl-12 md:pl-0">
            <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">Meios de Pagamento</h1>
                <p className="text-sm text-muted-foreground hidden sm:block">Gerencie seus métodos de pagamento e relacionamentos.</p>
            </div>

            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-md shadow-emerald-900/20 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                <span className="hidden sm:inline">Nova Transação</span>
            </button>
        </header>
    );

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 flex items-center justify-center h-full text-red-500">
                <p>Erro ao carregar dados: {error}</p>
            </div>
        );
    }

    return (
        <div className="flex-1 p-6 md:p-8 overflow-y-auto w-full">
            <Header />

            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
                {currentUser && (
                    <UserSelector
                        selectedUserIds={selectedUserIds}
                        onToggleUser={handleToggleUser}
                        currentUser={currentUser}
                    />
                )}

                <PaymentList
                    payments={availablePayments}
                    selectedIds={selectedPaymentIds}
                    onTogglePayment={handleTogglePayment}
                />

                <TransactionTable
                    transactions={filteredTransactions}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    title={selectedPaymentIds.length > 0 ? `Transações: ${getSelectedPaymentNames()}` : 'Transações de Pagamento'}
                    emptyMessage="Nenhuma transação encontrada para os meios de pagamento selecionados."
                />
            </div>
        </div>
    );
}
