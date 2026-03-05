import { useState, useEffect, useMemo } from 'react';
import { useTransacoes } from '../hooks/api/useTransacoes';
import type { TransactionFindRes } from '../api/services/transaction/@types/TransactionFindRes';

import { UserSelector } from '../components/organisms/UserSelector';
import { Button } from '../components/atoms/Button';
import { Badge } from '../components/atoms/Badge';
import { MetricCard } from '../components/molecules/MetricCard';
import { NewIncomeModal } from '../components/organisms/NewIncomeModal';

const getCategoryColor = (cat: string) => {
    switch (cat) {
        case 'Salário': return 'emerald';
        case 'Benefício': return 'blue';
        case 'Investimento': return 'violet';
        case 'Extra': return 'amber';
        default: return 'default';
    }
};

// Helper for color generation
const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00ffffff).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
};

interface HeaderProps {
    onOpenNewIncome: () => void;
}

const Header = ({ onOpenNewIncome }: HeaderProps) => (
    <header className="flex items-center justify-between mb-8 pt-2 md:pt-0 pl-12 md:pl-0">
        <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Entradas de Caixa</h1>
            <p className="text-sm text-muted-foreground hidden sm:block">Gerencie seus rendimentos, salários e benefícios.</p>
        </div>

        <Button variant="primary" onClick={onOpenNewIncome}>
            <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                <span className="hidden sm:inline">Nova Entrada</span>
            </div>
        </Button>
    </header>
);

// IncomesTable Component (Defined locally)
const IncomesTable = ({
    receitas,
    showUserColumn,
}: {
    receitas: TransactionFindRes[],
    showUserColumn: boolean,
}) => {
    const totalValue = receitas.reduce((acc, r) => acc + (r.value || 0), 0);

    return (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* ... Header and table structure same ... */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Receitas Encontradas
                </h2>
            </div>

            {receitas.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 bg-card/50 border border-dashed border-border rounded-xl text-center animate-in fade-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-muted-foreground opacity-50"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                    </div>
                    <h3 className="text-lg font-medium text-muted-foreground">Nenhuma entrada encontrada</h3>
                </div>
            ) : (
                <div className="bg-card rounded-xl border border-border/50 overflow-hidden shadow-sm">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b border-border/50 transition-colors hover:bg-transparent bg-secondary/20">
                                    {showUserColumn && (
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Usuário</th>
                                    )}
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Descrição</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Categoria</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Meio</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Valor</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {receitas.map((receita) => {
                                    const user = receita.user;
                                    const userColor = stringToColor(user?.name || 'User');
                                    return (
                                        <tr key={receita.id || Math.random().toString()} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                                            {showUserColumn && user && (
                                                <td className="p-4 align-middle">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: userColor }}>
                                                            {(user.name || 'U').charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="text-foreground font-medium text-sm">{user.name || 'Usuário'}</span>
                                                    </div>
                                                </td>
                                            )}
                                            <td className="p-4 align-middle text-foreground font-medium">{receita.description}</td>
                                            <td className="p-4 align-middle">
                                                <Badge variant={getCategoryColor(receita.category || '') as any}>{receita.category || 'Geral'}</Badge>
                                            </td>
                                            <td className="p-4 align-middle text-muted-foreground">
                                                {receita.paymentName || '-'}
                                            </td>
                                            <td className="p-4 align-middle text-right text-emerald-500 font-bold">
                                                R$ {(receita.value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="p-4 align-middle text-center">
                                                <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot className="font-medium bg-secondary/20 border-t border-border/50">
                                <tr>
                                    <td className="p-4 align-middle font-semibold text-foreground" colSpan={showUserColumn ? 3 : 2}>Total</td>
                                    <td className="p-4 align-middle"></td>
                                    <td className="p-4 align-middle text-right font-bold text-emerald-500 text-lg">
                                        R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="p-4 align-middle"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            )}
        </section>
    );
};

import { useAuthStore } from '../stores/useAuthStore';
import { useUsuarios } from '../hooks/api/useUsuarios';

export default function IncomesPage() {
    const { data: transacoes = [], isLoading: loadingReceitas, error: errorReceitas } = useTransacoes('INCOME');
    const { data: usuarios = [], isLoading: loadingUsers, error: errorUsers } = useUsuarios();

    const currentUser = useAuthStore(s => s.user);

    const loading = loadingReceitas || loadingUsers;
    const error = errorReceitas || errorUsers ? "Failed to load incomes data" : null;

    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [isNewIncomeModalOpen, setIsNewIncomeModalOpen] = useState(false);

    useEffect(() => {
        if (currentUser && selectedUserIds.length === 0) {
            setSelectedUserIds([currentUser.id!]);
        }
    }, [currentUser, selectedUserIds.length]);

    const handleToggleUser = (userId: string) => {
        setSelectedUserIds(prev => {
            if (prev.includes(userId)) {
                return prev.filter(id => id !== userId);
            }
            return [...prev, userId];
        });
    };

    const filteredReceitas = useMemo(() => {
        return transacoes.filter(r => r.user?.id && selectedUserIds.includes(r.user.id));
    }, [selectedUserIds, transacoes]);

    const totalIncome = filteredReceitas.reduce((acc, r) => acc + (r.value || 0), 0);

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
            <Header onOpenNewIncome={() => setIsNewIncomeModalOpen(true)} />

            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
                {currentUser && (
                    <UserSelector
                        selectedUserIds={selectedUserIds}
                        onToggleUser={handleToggleUser}
                        currentUser={currentUser}
                        users={usuarios}
                    />
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <MetricCard
                        title="Total de Entradas"
                        value={`R$ ${totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                        subtitle="Soma de todas as entradas selecionadas"
                        icon={<i className="ri-wallet-3-line"></i>}
                        variant="default"
                    />
                </div>

                <IncomesTable
                    receitas={filteredReceitas}
                    showUserColumn={selectedUserIds.length > 1}
                />
            </div>

            <NewIncomeModal
                isOpen={isNewIncomeModalOpen}
                onClose={() => setIsNewIncomeModalOpen(false)}
            />
        </div>
    );
}
