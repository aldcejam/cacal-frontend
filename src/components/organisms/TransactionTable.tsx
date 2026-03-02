import { Badge } from '../atoms/Badge';
import type { TransactionFindRes } from '../../api/services/transaction/@types/TransactionFindRes';
import type { CardFindRes } from '../../api/services/card/@types/CardFindRes';

interface TransactionTableProps {
    transactions: TransactionFindRes[];
    cards?: CardFindRes[]; // Unused but updated type just in case
    selectedIds?: string[];
    title?: string;
    onSort?: (key: any) => void;
    sortConfig?: { key: any; direction: string };
    emptyMessage?: string;
}

export const TransactionTable = ({
    transactions,
    title = "Despesas",
    onSort,
    sortConfig,
}: TransactionTableProps) => {

    const totalValue = transactions.reduce((acc, t) => acc + (t.value || 0), 0);
    const totalFull = transactions.reduce((acc, t) => acc + (t.total || 0), 0);

    const renderSortIcon = (key: string) => {
        if (!sortConfig || !onSort) return null;
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${sortConfig.key === key && sortConfig.direction === 'desc' ? 'rotate-180' : ''} ${sortConfig.key === key ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}>
                <path d="m6 9 6 6 6-6" />
            </svg>
        );
    };

    // Helper for category style (simplified version of local helpers)
    const getCategoryColor = (cat: string) => {
        switch (cat) {
            case 'Streaming': return 'violet';
            case 'Alimentação': return 'default'; // Using default for amber/yellow usually
            case 'Eletrônicos': return 'blue';
            case 'Transporte': return 'emerald';
            case 'Saúde': return 'red'; // Rose
            case 'Telecomunicações': return 'cyan';
            case 'Educação': return 'blue'; // Indigo
            default: return 'default';
        }
    };

    return (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                    {title}
                </h2>
            </div>

            {transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 bg-card/50 border border-dashed border-border rounded-xl text-center animate-in fade-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-muted-foreground opacity-50">
                            <path d="M5 12h14"></path>
                            <path d="M12 5v14"></path>
                        </svg>
                    </div>
                </div>
            ) : (
                <div className="bg-card rounded-xl border border-border/50 overflow-hidden shadow-sm">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b border-border/50 transition-colors hover:bg-transparent bg-secondary/20">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Origem</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Descrição</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Categoria</th>

                                    <th
                                        className="h-12 px-4 align-middle font-medium text-muted-foreground text-right cursor-pointer hover:text-foreground transition-colors group"
                                        onClick={() => onSort && onSort('value')}
                                    >
                                        <div className="flex items-center justify-end gap-1">
                                            Valor
                                            {renderSortIcon('value')}
                                        </div>
                                    </th>
                                    <th
                                        className="h-12 px-4 align-middle font-medium text-muted-foreground text-center cursor-pointer hover:text-foreground transition-colors group"
                                        onClick={() => onSort && onSort('parcels')}
                                    >
                                        <div className="flex items-center justify-center gap-1">
                                            Parcelas
                                            {renderSortIcon('parcels')}
                                        </div>
                                    </th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {transactions.map((t) => {
                                    const card = t.card;
                                    return (
                                        <tr key={t.id || Math.random().toString()} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                                            <td className="p-4 align-middle font-medium text-foreground">
                                                <div className="flex items-center gap-2">
                                                    {card ? (
                                                        <>
                                                            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                                            Cartão final {card.lastDigits || '0000'}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                                            <span className="text-muted-foreground">{'Outro'}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle text-foreground font-medium">{t.description || 'Sem descrição'}</td>
                                            <td className="p-4 align-middle">
                                                <Badge variant={getCategoryColor(t.category || '') as any}>
                                                    {t.category || 'Geral'}
                                                </Badge>
                                            </td>
                                            <td className="p-4 align-middle text-right text-foreground font-medium">
                                                R$ {(t.value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="p-4 align-middle text-center text-muted-foreground tabular-nums">
                                                {t.parcels || '1/1'}
                                            </td>
                                            <td className="p-4 align-middle text-right text-foreground font-semibold">
                                                R$ {(t.total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot className="font-medium bg-secondary/20 border-t border-border/50">
                                <tr>
                                    <td className="p-4 align-middle font-semibold text-foreground" colSpan={3}>Total</td>
                                    <td className="p-4 align-middle text-right font-bold text-primary">
                                        R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="p-4 align-middle"></td>
                                    <td className="p-4 align-middle text-right font-bold text-primary">
                                        R$ {totalFull.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </td>
                                </tr>
                            </tfoot>
                        </table >
                    </div >
                </div >
            )}
        </section >
    );
};
