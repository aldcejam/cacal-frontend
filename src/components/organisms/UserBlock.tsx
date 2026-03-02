import type { User } from '../../api/services/user/@types/User';
import type { CardFindRes } from '../../api/services/card/@types/CardFindRes';
import type { ExpenseFindRes } from '../../api/services/recurringExpense/@types/ExpenseFindRes';
import { CreditCard } from '../molecules/CreditCard';
import { RecurringExpensesCard } from '../molecules/RecurringExpensesCard';
// We are reusing CreditCard molecule here instead of the inline card

interface UserBlockProps {
    user: User;
    cards: CardFindRes[];
    gastosRecorrentes: ExpenseFindRes[];
    selectedCardIds: string[];
    onToggleCard: (cardId: string) => void;
}

// Helper to generate color from string
const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00ffffff).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
};

export const UserBlock: React.FC<UserBlockProps> = ({
    user,
    cards,
    gastosRecorrentes,
    selectedCardIds,
    onToggleCard
}) => {
    const totalGastos = gastosRecorrentes.reduce((acc, g) => acc + (g.value || 0), 0);
    const userColor = stringToColor(user.name || 'User');

    return (
        <div className="min-w-[90vw] md:min-w-[600px] lg:min-w-[700px] bg-card rounded-xl border border-border/50 p-6 shadow-sm">
            {/* Header do Usuário */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
                    style={{ backgroundColor: userColor }}
                >
                    {(user.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                    <h3 className="text-xl font-bold text-foreground">{user.name || 'Usuário'}</h3>
                    <p className="text-sm text-muted-foreground">{user.email || 'sem@email.com'}</p>
                </div>
            </div>

            {/* Seção de Cartões */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" />
                    </svg>
                    <h4 className="text-base font-semibold text-foreground">Cartões</h4>
                    <span className="text-xs text-muted-foreground">({cards.length})</span>
                </div>

                {cards.length === 0 ? (
                    <div className="p-4 bg-secondary/30 rounded-lg border border-dashed border-border text-center">
                        <p className="text-sm text-muted-foreground">Nenhum cartão cadastrado</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {cards.map((card) => {
                            const cardId = card.id || Math.random().toString();
                            return (
                                <CreditCard
                                    key={cardId}
                                    card={card}
                                    isSelected={selectedCardIds.includes(cardId)}
                                    onClick={() => onToggleCard(cardId)}
                                    showProgressBar={false}
                                />
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Seção de Gastos Recorrentes */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <h4 className="text-base font-semibold text-foreground">Gastos Recorrentes</h4>
                    <span className="text-xs text-muted-foreground">({gastosRecorrentes.length})</span>
                </div>

                {gastosRecorrentes.length === 0 ? (
                    <div className="p-4 bg-secondary/30 rounded-lg border border-dashed border-border text-center">
                        <p className="text-sm text-muted-foreground">Nenhum gasto recorrente cadastrado</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <RecurringExpensesCard
                            totalValue={totalGastos}
                            count={gastosRecorrentes.length}
                            isSelected={selectedCardIds.includes(`recurring-${user.id}`)}
                            onClick={() => onToggleCard(`recurring-${user.id}`)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
