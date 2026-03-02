import { useMemo } from 'react';
import type { IncomeFindRes } from '../../api/services/income/@types/IncomeFindRes';
import type { TransactionFindRes } from '../../api/services/transaction/@types/TransactionFindRes';
import type { ExpenseFindRes } from '../../api/services/recurringExpense/@types/ExpenseFindRes';
import type { User } from '../../api/services/user/@types/User';
import type { CardFindRes } from '../../api/services/card/@types/CardFindRes';

interface FinancialOverviewProps {
    onUserClick?: (userId: string) => void;
    receitas: IncomeFindRes[];
    transactions: TransactionFindRes[];
    recurringExpenses: ExpenseFindRes[];
    usuarios: User[];
    cards: CardFindRes[];
}

// Helper for color generation
const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00ffffff).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
};

export const FinancialOverview = ({
    onUserClick,
    receitas,
    transactions,
    recurringExpenses,
    usuarios,
    cards
}: FinancialOverviewProps) => {
    // 1. Calculate Family Totals
    const familyTotals = useMemo(() => {
        const totalIncome = receitas.reduce((acc, r) => acc + (r.value || 0), 0);

        const totalRecurring = recurringExpenses.reduce((acc, g) => acc + (g.value || 0), 0);

        const totalCreditCard = transactions.reduce((acc, t) => acc + (t.value || 0), 0);

        const totalExpenses = totalRecurring + totalCreditCard;
        const balance = totalIncome - totalExpenses;

        return { totalIncome, totalExpenses, balance, totalRecurring, totalCreditCard };
    }, [receitas, recurringExpenses, transactions]);

    // 2. Calculate Per User
    const userStats = useMemo(() => {
        return usuarios.map((user) => {
            const userId = user.id;
            if (!userId) return null; // Skip users without ID

            const userIncome = receitas
                .filter((r) => r.user?.id === userId)
                .reduce((acc, r) => acc + (r.value || 0), 0);

            const userRecurring = recurringExpenses
                .filter((g) => g.user?.id === userId)
                .reduce((acc, g) => acc + (g.value || 0), 0);

            // Find user's cards
            const userCardIds = cards
                .filter((c) => c.user?.id === userId && c.id)
                .map((c) => c.id!);

            const userCreditCard = transactions
                .filter((t) => t.card?.id && userCardIds.includes(t.card.id))
                .reduce((acc, t) => acc + (t.value || 0), 0);

            const totalExpenses = userRecurring + userCreditCard;
            const balance = userIncome - totalExpenses;

            const userColor = stringToColor(user.name || 'User');

            return {
                user,
                userIncome,
                userExpenses: totalExpenses,
                userBalance: balance,
                userColor
            };
        }).filter(Boolean) as any[]; // Filter out nulls
    }, [usuarios, receitas, recurringExpenses, cards, transactions]);

    return (
        <section className="mb-8 space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                <h2 className="text-xl font-bold text-foreground">Fluxo de Caixa Mensal</h2>
            </div>

            {/* Family Overview */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="currentColor"><path d="M3 10V22H21V10H3ZM5 12H19V20H5V12ZM19 8H5V4H19V8ZM19 2H5C3.89 2 3 2.89 3 4V8H22V4C22 2.89 21.11 2 20 2H19Z" /></svg>
                </div>

                <div className="relative z-10">
                    <h3 className="text-white/80 text-sm font-medium uppercase tracking-wider mb-6">Visão Familiar Total</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-emerald-400 text-sm font-medium mb-1">Entradas Totais</p>
                            <p className="text-3xl font-bold text-white">R$ {familyTotals.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        </div>
                        <div>
                            <p className="text-rose-400 text-sm font-medium mb-1">Saídas Totais</p>
                            <p className="text-3xl font-bold text-white">R$ {familyTotals.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                            <p className="text-xs text-white/50 mt-1">
                                (Cartão: {familyTotals.totalCreditCard.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} +
                                Fixos: {familyTotals.totalRecurring.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})
                            </p>
                        </div>
                        <div>
                            <p className="text-blue-400 text-sm font-medium mb-1">Saldo Final</p>
                            <p className={`text-3xl font-bold ${familyTotals.balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                R$ {familyTotals.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Users Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {userStats.map(({ user, userIncome, userExpenses, userBalance, userColor }) => (
                    <div
                        key={user.id}
                        onClick={() => onUserClick && onUserClick(user.id)}
                        className={`
                            bg-card rounded-xl border border-border/50 p-5 shadow-sm 
                            transition-all duration-300 group
                            ${onUserClick ? 'cursor-pointer hover:shadow-lg hover:bg-secondary/10 hover:-translate-y-1' : ''}
                        `}
                    >
                        <div className="flex items-center gap-3 mb-4 border-b border-border/50 pb-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm transition-transform group-hover:scale-110" style={{ backgroundColor: userColor }}>
                                {(user.name || 'U').charAt(0).toUpperCase()}
                            </div>
                            <div className="overflow-hidden">
                                <h4 className="font-semibold text-foreground truncate">{user.name || 'Usuário'}</h4>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Entradas</span>
                                <span className="font-medium text-emerald-500">
                                    + {userIncome.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Saídas</span>
                                <span className="font-medium text-rose-500">
                                    - {userExpenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </span>
                            </div>
                            <div className="pt-2 border-t border-border/50 flex justify-between items-center font-bold">
                                <span className="text-sm text-foreground">Sobra</span>
                                <span className={`text-base ${userBalance >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {userBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
