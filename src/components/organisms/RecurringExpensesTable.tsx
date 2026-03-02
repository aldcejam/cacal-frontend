import type { ExpenseFindRes } from '../../api/services/recurringExpense/@types/ExpenseFindRes';
import { Badge } from '../atoms/Badge';

// Helper for category style reused locally
const getCategoryColor = (cat: string) => {
    switch (cat) {
        case 'Streaming': return 'violet';
        case 'Alimentação': return 'default';
        case 'Eletrônicos': return 'blue';
        case 'Transporte': return 'emerald';
        case 'Saúde': return 'red';
        case 'Telecomunicações': return 'cyan';
        case 'Educação': return 'blue';
        default: return 'default';
    }
};

const getPaymentStyle = (pagamento: string) => {
    switch (pagamento) {
        case 'Cartão de Crédito': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
        case 'Débito Automático': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
        case 'PIX': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
        case 'Boleto': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
        default: return 'bg-secondary text-secondary-foreground border-border';
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

interface RecurringExpensesTableProps {
    gastos: ExpenseFindRes[];
    onSort?: (key: any) => void;
    sortConfig?: { key: any; direction: string };
    showUserColumn?: boolean;
}

export const RecurringExpensesTable = ({
    gastos,
    onSort,
    sortConfig,
    showUserColumn
}: RecurringExpensesTableProps) => {

    const renderSortIcon = (key: string) => {
        if (!sortConfig) return null;
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${sortConfig.key === key && sortConfig.direction === 'desc' ? 'rotate-180' : ''} ${sortConfig.key === key ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}>
                <path d="m6 9 6 6 6-6" />
            </svg>
        );
    };

    return (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                    Gastos Recorrentes
                </h2>
            </div>


            {gastos.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 bg-card/50 border border-dashed border-border rounded-xl text-center animate-in fade-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-muted-foreground opacity-50">
                            <path d="M5 12h14"></path>
                            <path d="M12 5v14"></path>
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-muted-foreground">Nenhum gasto recorrente cadastrado</h3>
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
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer group hover:text-foreground transition-colors" onClick={() => onSort?.('description')}>
                                        <div className="flex items-center gap-1">
                                            Descrição
                                            {renderSortIcon('description')}
                                        </div>
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer group hover:text-foreground transition-colors" onClick={() => onSort?.('paymentMethod')}>
                                        <div className="flex items-center gap-1">
                                            Pagamento
                                            {renderSortIcon('paymentMethod')}
                                        </div>
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer group hover:text-foreground transition-colors" onClick={() => onSort?.('category')}>
                                        <div className="flex items-center gap-1">
                                            Categoria
                                            {renderSortIcon('category')}
                                        </div>
                                    </th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right cursor-pointer group hover:text-foreground transition-colors" onClick={() => onSort?.('value')}>
                                        <div className="flex items-center justify-end gap-1">
                                            Valor
                                            {renderSortIcon('value')}
                                        </div>
                                    </th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {gastos.map((g, index) => {
                                    const user = g.user;
                                    const userColor = stringToColor(user?.name || 'User');
                                    return (
                                        <tr key={g.id || `temp-${index}`} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
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
                                            <td className="p-4 align-middle text-foreground font-medium">{g.description || 'Sem descrição'}</td>
                                            <td className="p-4 align-middle">
                                                <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${getPaymentStyle(g.paymentMethod || '')}`}>
                                                    {g.paymentMethod || 'Cartão'}
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <Badge variant={getCategoryColor(g.category || '') as any}>{g.category || 'Geral'}</Badge>
                                            </td>
                                            <td className="p-4 align-middle text-right text-foreground font-medium">
                                                R$ {(g.value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="p-4 align-middle text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </section>
    );
};
