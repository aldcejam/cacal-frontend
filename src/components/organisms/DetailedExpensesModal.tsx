import { useState, useMemo, useEffect } from 'react';
import { Modal } from '../molecules/Modal';
import { Carousel } from '../molecules/Carousel';
import { CreditCard } from '../molecules/CreditCard';
import { RecurringExpensesCard } from '../molecules/RecurringExpensesCard';
import { TransactionTable } from './TransactionTable';
import { Typography } from '../atoms/Typography';
import { Button } from '../atoms/Button';

import type { User } from '../../api/services/user/@types/User';
import type { CardFindRes } from '../../api/services/card/@types/CardFindRes';
import type { ExpenseFindRes } from '../../api/services/recurringExpense/@types/ExpenseFindRes';
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
    creditCards: CardFindRes[];
    recurringExpenses: ExpenseFindRes[];
    transactions: TransactionFindRes[];
}

export const DetailedExpensesModal = ({
    isOpen,
    onClose,
    initialUserId,
    usuarios,
    creditCards,
    recurringExpenses,
    transactions
}: DetailedExpensesModalProps) => {
    // State for filtering users
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

    // ... rest of the component logic ...

    // Initialize selected users when modal opens or initialUserId changes
    useEffect(() => {
        if (isOpen && initialUserId) {
            setSelectedUserIds([initialUserId]);
        } else if (isOpen && !initialUserId && selectedUserIds.length === 0 && usuarios.length > 0) {
            // Default to all users if none selected
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

    // Filter Data based on selectedUserIds
    const filteredCreditCards = useMemo(() => {
        return creditCards.filter((c) => c.user?.id && selectedUserIds.includes(c.user.id));
    }, [selectedUserIds, creditCards]);

    const filteredRecurringExpenses = useMemo(() => {
        return recurringExpenses.filter((g) => g.user?.id && selectedUserIds.includes(g.user.id));
    }, [selectedUserIds, recurringExpenses]);

    // Cards Selection Logic for Table
    const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);

    useEffect(() => {
        // Init with all visible credit cards
        const cardIds = filteredCreditCards.map((c) => c.id).filter(Boolean) as string[];

        // Init with all visible recurring GROUPS
        // We need to know which USERS have recurring expenses in the filtered list
        const usersWithRecurring = Array.from(new Set(filteredRecurringExpenses.map((g) => g.user?.id).filter(Boolean))) as string[];
        const recurringGroupIds = usersWithRecurring.map((userId) => `recurring-group-${userId}`);

        setSelectedCardIds([...cardIds, ...recurringGroupIds]);

    }, [filteredCreditCards, filteredRecurringExpenses]);


    const handleToggleCard = (id: string) => {
        setSelectedCardIds(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    // Derived Selection State (for buttons)
    const allCardIds = useMemo(() => filteredCreditCards.map((c) => c.id).filter(Boolean) as string[], [filteredCreditCards]);
    const allRecurringGroupIds = useMemo(() => {
        const usersWithRecurring = Array.from(new Set(filteredRecurringExpenses.map((g) => g.user?.id).filter(Boolean))) as string[];
        return usersWithRecurring.map((userId) => `recurring-group-${userId}`);
    }, [filteredRecurringExpenses]);

    const isAllCardsSelected = allCardIds.length > 0 && allCardIds.every(id => selectedCardIds.includes(id));
    const isAllRecurringSelected = allRecurringGroupIds.length > 0 && allRecurringGroupIds.every(id => selectedCardIds.includes(id));
    const isAllSelected = isAllCardsSelected && isAllRecurringSelected;

    const handleSelectAllCards = () => {
        if (isAllCardsSelected) {
            // Deselect all cards
            setSelectedCardIds(prev => prev.filter(id => !allCardIds.includes(id)));
        } else {
            // Select all cards
            setSelectedCardIds(prev => {
                const recurringIds = prev.filter(id => id.startsWith('recurring-group-'));
                return [...Array.from(new Set([...recurringIds, ...allCardIds]))];
            });
        }
    };

    const handleSelectAllRecurring = () => {
        if (isAllRecurringSelected) {
            // Deselect all recurring
            setSelectedCardIds(prev => prev.filter(id => !allRecurringGroupIds.includes(id)));
        } else {
            // Select all recurring
            setSelectedCardIds(prev => {
                const cardIds = prev.filter(id => !id.startsWith('recurring-group-'));
                return [...Array.from(new Set([...cardIds, ...allRecurringGroupIds]))];
            });
        }
    };

    const handleSelectAll = () => {
        if (isAllSelected) {
            // Deselect everything
            setSelectedCardIds([]);
        } else {
            // Select everything
            setSelectedCardIds([...allCardIds, ...allRecurringGroupIds]);
        }
    };

    // Prepare Unified Transactions
    const tableTransactions = useMemo(() => {
        let combined: any[] = [];

        // 1. Credit Card Transactions
        // Filter by actually selected card IDs
        const activeCardIds = filteredCreditCards.map((c) => c.id).filter((id) => id && selectedCardIds.includes(id));
        const relevantTransactions = transactions.filter((t) => t.card?.id && activeCardIds.includes(t.card.id));
        combined.push(...relevantTransactions);

        // 2. Recurring Transactions
        // Identify which recurring groups are "selected"
        const activeRecurringGroupIds = selectedCardIds.filter(id => id.startsWith('recurring-group-'));
        const activeUserIds = activeRecurringGroupIds.map(id => id.replace('recurring-group-', ''));

        const activeRecurring = filteredRecurringExpenses.filter((g) => g.user?.id && activeUserIds.includes(g.user.id));

        const recurringAsTransactions = activeRecurring.map((g) => ({
            id: `rec-${g.id}`,
            card: { id: 'recurring', lastDigits: 'Rec' }, // Mock object for compat
            description: g.description,
            category: g.category,
            value: g.value || 0,
            parcels: 'Recorrente',
            total: g.value || 0,
            status: 'approved',
            isRecurring: true,
            paymentMethod: g.paymentMethod // Passed to table
        }));

        combined.push(...recurringAsTransactions);

        return combined.sort((a, b) => b.value - a.value); // Sort by value desc
    }, [selectedCardIds, filteredCreditCards, filteredRecurringExpenses, transactions]);

    // Group Recurring Expenses by User
    const groupedRecurringExpenses = useMemo(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const groups: { [key: string]: { userId: string, total: number, count: number, user: any } } = {};

        filteredRecurringExpenses.forEach((g) => {
            const userId = g.user?.id;
            if (!userId) return;

            if (!groups[userId]) {
                const user = g.user;
                groups[userId] = { userId: userId, total: 0, count: 0, user };
            }
            groups[userId].total += (g.value || 0);
            groups[userId].count += 1;
        });

        return Object.values(groups);
    }, [filteredRecurringExpenses]);


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

                {/* Bulk Actions */}
                <div className="flex flex-wrap gap-2 justify-center border-b border-border/40 pb-4">
                    <Button
                        variant={isAllCardsSelected ? "primary" : "outline"}
                        size="sm"
                        onClick={handleSelectAllCards}
                        leftIcon={<i className="ri-bank-card-line"></i>}
                    >
                        Todos os Cartões
                    </Button>
                    <Button
                        variant={isAllRecurringSelected ? "primary" : "outline"}
                        size="sm"
                        onClick={handleSelectAllRecurring}
                        leftIcon={<i className="ri-calendar-check-line"></i>}
                    >
                        Todos Recorrentes
                    </Button>
                    <Button
                        variant={isAllSelected ? "primary" : "outline"}
                        size="sm"
                        onClick={handleSelectAll}
                        leftIcon={<i className="ri-checkbox-multiple-line"></i>}
                    >
                        Selecionar Tudo
                    </Button>
                </div>

                {/* 2. Carousels */}
                <div className="space-y-6">
                    {/* Credit Cards */}
                    {filteredCreditCards.length > 0 && (
                        <div>
                            <Typography variant="body-sm" className="mb-3 text-muted-foreground uppercase tracking-wider font-semibold px-1">
                                Cartões de Crédito ({filteredCreditCards.length})
                            </Typography>
                            <Carousel>
                                {filteredCreditCards.map((card) => {
                                    const cardId = card.id || Math.random().toString();
                                    return (
                                        <div key={cardId} className="w-[300px] shrink-0 p-1">
                                            <CreditCard
                                                card={card}
                                                isSelected={selectedCardIds.includes(cardId)}
                                                onClick={() => handleToggleCard(cardId)}
                                                showProgressBar={true}
                                            />
                                        </div>
                                    );
                                })}
                            </Carousel>
                        </div>
                    )}

                    {/* Recurring Expenses (Grouped by User) */}
                    {groupedRecurringExpenses.length > 0 && (
                        <div>
                            <Typography variant="body-sm" className="mb-3 text-muted-foreground uppercase tracking-wider font-semibold px-1">
                                Custos Recorrentes ({groupedRecurringExpenses.length} Usuários)
                            </Typography>
                            <Carousel>
                                {groupedRecurringExpenses.map((group: any) => (
                                    <div key={group.userId} className="w-[300px] shrink-0 p-1">
                                        <RecurringExpensesCard
                                            totalValue={group.total}
                                            count={group.count}
                                            isSelected={selectedCardIds.includes(`recurring-group-${group.userId}`)}
                                            onClick={() => handleToggleCard(`recurring-group-${group.userId}`)}
                                        />
                                        <div className="mt-2 text-center">
                                            <p className="font-medium text-sm text-foreground truncate">{group.user?.name}</p>
                                            <p className="text-xs text-muted-foreground">Total recorrente</p>
                                        </div>
                                    </div>
                                ))}
                            </Carousel>
                        </div>
                    )}
                </div>

                {/* 3. Transaction Table */}
                <div className="pt-4 border-t border-border/50">
                    <TransactionTable
                        transactions={tableTransactions}
                        title="Detalhamento das Seleções"
                        emptyMessage="Nenhum item selecionado."
                    />
                </div>

            </div>
        </Modal>
    );
};
