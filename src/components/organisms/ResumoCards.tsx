import { MetricCard } from '../molecules/MetricCard';

interface ResumoCardsProps {
    totalPending: number;
    totalLeftover: number;
}

export const ResumoCards = ({ totalPending, totalLeftover }: ResumoCardsProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <MetricCard
                title="Pendências do Período"
                value={`R$ ${totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                subtitle="Ainda a pagar neste Mês"
                icon={<i className="ri-calendar-check-line"></i>}
            />
            <MetricCard
                title="Sobra Projetada"
                value={`R$ ${totalLeftover.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                subtitle="Ganhos - Despesas"
                icon={<i className="ri-wallet-3-line"></i>}
                variant={totalLeftover >= 0 ? "default" : "danger"}
            />
        </div>
    );
};
