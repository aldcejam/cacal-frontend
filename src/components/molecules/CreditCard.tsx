import { Typography } from '../atoms/Typography';
import type { CardFindRes } from '../../api/services/card/@types/CardFindRes';

interface CreditCardProps {
    card: CardFindRes & { percent?: number; closing?: number; due?: number };
    isSelected?: boolean;
    onClick?: () => void;
    showProgressBar?: boolean;
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

export const CreditCard = ({ card, isSelected = false, onClick, showProgressBar = false }: CreditCardProps) => {
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
                            {card.bank?.name || 'Banco'}
                        </Typography>
                    </div>
                    <Typography variant="body-sm" className="font-mono opacity-80">
                        •••• {card.lastDigits || '0000'}
                    </Typography>
                </div>

                <div className="space-y-1 mb-4">
                    <Typography variant="body-xs" className="uppercase tracking-wider opacity-70 font-medium">
                        Limite Total
                    </Typography>
                    <Typography variant="h3" weight="bold" className="tracking-tight">
                        R$ {(card.limitValue || 0).toLocaleString('pt-BR')}
                    </Typography>
                </div>

                <div className="flex justify-between items-end">
                    <Typography variant="body-sm" className="opacity-90 font-medium">
                        Disponível: R$ {(card.available || 0).toLocaleString('pt-BR')}
                    </Typography>
                </div>

                {showProgressBar && card.percent !== undefined && (
                    <div className="mt-5">
                        <div className="w-full bg-black/20 rounded-full h-1.5 overflow-hidden">
                            <div
                                className="bg-white h-full rounded-full transition-all duration-1000"
                                style={{ width: `${card.percent}%` }}
                            ></div>
                        </div>
                        {(card.closing || card.due) && (
                            <div className="flex justify-between pt-3 mt-2 border-t border-white/10 text-xs text-white/90">
                                {card.closing && <div><span className="opacity-70">Fecha:</span> <strong>Dia {card.closing}</strong></div>}
                                {card.due && <div><span className="opacity-70">Vence:</span> <strong>Dia {card.due}</strong></div>}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Visual decorations */}
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -left-12 -top-12 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
        </div>
    );
};
