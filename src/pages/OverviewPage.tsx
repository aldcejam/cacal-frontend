import { useState } from 'react';

import { useFinancialSummary } from '../hooks/useFinancialSummary';

import { FinancialOverview } from '../components/organisms/FinancialOverview';
import { DetailedExpensesModal } from '../components/organisms/DetailedExpensesModal';
import { ResumoCards } from '../components/organisms/ResumoCards';
import { PageHeader } from '../components/molecules/PageHeader';

export default function OverviewPage() {
    const {
        summaryData,
        usuarios,
        loading,
        error
    } = useFinancialSummary();

    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const defaultSummary = { leftover: 0, pendingToPay: 0, periodTransactions: [] };
    const currSummary = summaryData || defaultSummary;

    return (
        <div className="flex-1 p-6 md:p-8 overflow-y-auto w-full">
            <PageHeader
                title="Visão Geral"
                description="Consolidação e projeção de entradas e saídas no mês atual."
            />

            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
                <FinancialOverview
                    onUserClick={(userId) => {
                        setSelectedUserId(userId);
                        setIsModalOpen(true);
                    }}
                    summary={currSummary}
                    usuarios={usuarios}
                />

                <ResumoCards
                    totalPending={currSummary.pendingToPay}
                    totalLeftover={currSummary.leftover}
                />

                <DetailedExpensesModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    initialUserId={selectedUserId}
                    transactions={currSummary.periodTransactions || []}
                    usuarios={usuarios}
                />
            </div>
        </div>
    );
}
