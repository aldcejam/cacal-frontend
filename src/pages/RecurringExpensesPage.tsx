import { useState, useMemo, useEffect } from 'react';
import { useGastosRecorrentes } from '../hooks/api/useGastosRecorrentes';
import { useUsuarios } from '../hooks/api/useUsuarios';
import type { ExpenseFindRes } from '../api/services/recurringExpense/@types/ExpenseFindRes';

import { UserSelector } from '../components/organisms/UserSelector';
import { MetricCard } from '../components/molecules/MetricCard';
import { RecurringExpensesTable } from '../components/organisms/RecurringExpensesTable';

export default function RecurringExpensesPage() {
    const { data: gastosRecorrentes = [], isLoading: loadingGastos, error: errorGastos } = useGastosRecorrentes();
    const { data: usuarios = [], isLoading: loadingUsers, error: errorUsers } = useUsuarios();

    const loading = loadingGastos || loadingUsers;
    const error = errorGastos || errorUsers ? "Failed to load data" : null;

    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [sortConfig, setSortConfig] = useState<any>({ key: null, direction: 'asc' });

    useEffect(() => {
        if (usuarios.length > 0 && selectedUserIds.length === 0) {
            const firstId = usuarios[0].id;
            if (firstId) {
                setSelectedUserIds([firstId]);
            }
        }
    }, [usuarios]);

    const currentUser = usuarios.length > 0 ? usuarios[0] : null;

    // --- Handlers ---
    const handleToggleUser = (userId: string) => {
        setSelectedUserIds(prev => {
            if (prev.includes(userId)) {
                return prev.filter(id => id !== userId);
            }
            return [...prev, userId];
        });
    };

    const handleSort = (key: keyof ExpenseFindRes) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // --- Filtering & Sorting ---
    const filteredGastos = useMemo(() => {
        return gastosRecorrentes.filter(g => g.user?.id && selectedUserIds.includes(g.user.id));
    }, [selectedUserIds, gastosRecorrentes]);

    const sortedGastos = useMemo(() => {
        let sortableItems = [...filteredGastos];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                // @ts-ignore - dynamic sort
                const valA = a[sortConfig.key] || '';
                // @ts-ignore - dynamic sort
                const valB = b[sortConfig.key] || '';

                if (valA < valB) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (valA > valB) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredGastos, sortConfig]);

    const totalGastos = filteredGastos.reduce((acc, g) => acc + (g.value || 0), 0);

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
            <header className="flex items-center justify-between mb-8 pl-12 md:pl-0">
                <div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">Gastos Recorrentes</h1>
                    <p className="text-sm text-muted-foreground hidden sm:block">Gerencie assinaturas e pagamentos fixos mensais.</p>
                </div>
            </header>

            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
                {currentUser && (
                    <UserSelector
                        selectedUserIds={selectedUserIds}
                        onToggleUser={handleToggleUser}
                        currentUser={currentUser}
                    />
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <MetricCard
                        title="Total Mensal"
                        value={`R$ ${totalGastos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                        subtitle="Soma das despesas listadas"
                        icon={<i className="ri-money-dollar-circle-line"></i>}
                        variant="default"
                    />
                </div>

                <RecurringExpensesTable
                    gastos={sortedGastos}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    showUserColumn={selectedUserIds.length > 1}
                />
            </div>
        </div>
    );
}
