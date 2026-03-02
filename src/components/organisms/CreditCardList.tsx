import { CreditCard } from '../molecules/CreditCard';
import type { CardFindRes } from '../../api/services/card/@types/CardFindRes';

interface CreditCardListProps {
    cards: CardFindRes[];
    selectedIds: string[];
    onToggleCard: (id: string) => void;
}

export const CreditCardList = ({ cards, selectedIds, onToggleCard }: CreditCardListProps) => {
    return (
        <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
                    <h2 className="text-lg font-semibold text-foreground">Meus Cartões</h2>
                </div>
                {selectedIds.length > 0 && (
                    <span className="text-sm text-muted-foreground">{selectedIds.length} selecionado(s)</span>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {cards.map((card) => (
                    <CreditCard
                        key={card.id || Math.random().toString()}
                        card={card}
                        isSelected={card.id ? selectedIds.includes(card.id) : false}
                        onClick={() => card.id && onToggleCard(card.id)}
                        showProgressBar={false}
                    />
                ))}
            </div>
        </section>
    );
};
