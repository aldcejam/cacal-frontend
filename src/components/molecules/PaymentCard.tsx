import { Typography } from '../atoms/Typography';
import type { PaymentFindRes } from '../../api/services/payment/@types/PaymentFindRes';

interface PaymentCardProps {
    payment: PaymentFindRes;
    isSelected?: boolean;
    onClick?: () => void;
}

const darkenColor = (hex: string, percent: number) => {
    let useHex = hex.replace(/^\s*#|\s*$/g, '');
    if (useHex.length === 3) useHex = useHex.replace(/(.)/g, '$1$1');

    const num = parseInt(useHex, 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = ((num >> 8) & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;

    return '#' + (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1);
};

export const PaymentCard = ({ payment, isSelected = false, onClick }: PaymentCardProps) => {
    const primaryColor = '#333';
    const secondaryColor = darkenColor(primaryColor, 30);

    const gradientStyle = {
        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
    };

    const opacityClass = isSelected
        ? 'opacity-100 scale-[1.02] ring-2 ring-offset-2 ring-offset-background ring-primary shadow-xl'
        : 'opacity-90 hover:opacity-100 hover:scale-[1.01] hover:shadow-lg';

    return (
        <div
            onClick={onClick}
            style={gradientStyle}
            className={`rounded-xl p-6 text-white transition-all duration-300 cursor-pointer select-none border border-white/10 relative overflow-hidden ${onClick ? opacityClass : ''}`}
        >
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-5 bg-white/20 rounded-md backdrop-blur-sm border border-white/10"></div>
                        <Typography variant="body-base" weight="semibold" className="text-white">
                            {payment.name || 'Pagamento'}
                        </Typography>
                    </div>
                </div>

                <div className="space-y-1 mb-4">
                    <Typography variant="body-xs" className="uppercase tracking-wider opacity-70 font-medium">
                        Tipo de Relação
                    </Typography>
                    <Typography variant="body-base" weight="bold" className="tracking-tight">
                        {payment.personName ? `Pessoa: ${payment.personName}` : (payment.bankId ? 'Instituição Bancária' : 'Genérico')}
                    </Typography>
                </div>

                <div className="flex justify-between items-end">
                    <Typography variant="body-sm" className="opacity-90 font-medium">
                        Modalidade: {payment.type || 'Indefinida'}
                    </Typography>
                </div>
            </div>

            {/* Visual decorations */}
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -left-12 -top-12 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
        </div>
    );
};
