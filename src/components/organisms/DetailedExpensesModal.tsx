import { useState, useMemo, useEffect } from 'react';
import { Modal } from '../molecules/Modal';
import { TransactionTable } from './TransactionTable';
import type { User } from '../../api/services/user/@types/User';
import type { TransactionFindRes } from '../../api/services/transaction/@types/TransactionFindRes';

// Helper for color generation
const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00ffffff).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
};

interface DetailedExpensesModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialUserId: string | null;
    usuarios: User[];
    transactions: TransactionFindRes[];
}

export const DetailedExpensesModal = ({
    isOpen,
    onClose,
    initialUserId,
    usuarios,
    transactions
}: DetailedExpensesModalProps) => {
    // State for filtering users
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen && initialUserId) {
            setSelectedUserIds([initialUserId]);
        } else if (isOpen && !initialUserId && selectedUserIds.length === 0 && usuarios.length > 0) {
            const firstId = usuarios[0].id;
            if (firstId) {
                setSelectedUserIds([firstId]);
            }
        }
    }, [isOpen, initialUserId, usuarios]);

    const handleToggleUser = (userId: string) => {
        setSelectedUserIds(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const tableTransactions = useMemo(() => {
        return transactions.filter(t => t.user?.id && selectedUserIds.includes(t.user.id)).sort((a, b) => (b.value || 0) - (a.value || 0));
    }, [transactions, selectedUserIds]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Detalhamento Financeiro"
        >
            <div className="space-y-8 min-h-[500px]">

                {/* 1. User Filter */}
                <div className="flex justify-center gap-4 py-2 overflow-x-auto">
                    {usuarios.map((user) => {
                        const userId = user.id;
                        if (!userId) return null;

                        const isSelected = selectedUserIds.includes(userId);
                        const userColor = stringToColor(user.name || 'User');
                        return (
                            <div
                                key={userId}
                                onClick={() => handleToggleUser(userId)}
                                className={`
                                    flex flex-col items-center gap-2 cursor-pointer transition-all duration-200
                                    ${isSelected ? 'opacity-100 scale-105' : 'opacity-40 hover:opacity-70 hover:scale-105'}
                                `}
                            >
                                <div
                                    className={`
                                        w-12 h-12 rounded-full flex items-center justify-center text-white font-bold
                                        shadow-lg ring-2 ring-offset-2 ring-offset-card
                                        ${isSelected ? 'ring-primary' : 'ring-transparent'}
                                    `}
                                    style={{ backgroundColor: userColor }}
                                >
                                    {(user.name || 'U').charAt(0).toUpperCase()}
                                </div>
                                <span className="text-xs font-medium text-foreground">{(user.name || 'Usuário').split(' ')[0]}</span>
                            </div>
                        )
                    })}
                </div>

                {/* 2. Transaction Table */}
                <div className="pt-4 border-t border-border/50">
                    <TransactionTable
                        transactions={tableTransactions}
                        title="Transações do Mês"
                        emptyMessage="Nenhuma transação encontrada no período para o(s) usuário(s) selecionado(s)."
                    />
                </div>

            </div>
        </Modal>
    );
};
