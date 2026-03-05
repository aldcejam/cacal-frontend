import React, { useState, useEffect } from 'react';
import { Modal } from '../molecules/Modal';
import { Input } from '../atoms/Input';
import { Select } from '../atoms/Select';
import { Button } from '../atoms/Button';
import { useCreateTransaction } from '../../hooks/api/useCreateTransaction';

interface NewIncomeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CATEGORIES = [
    { value: 'Salário', label: 'Salário' },
    { value: 'Benefício', label: 'Benefício' },
    { value: 'Investimento', label: 'Investimento' },
    { value: 'Extra', label: 'Extra' },
];

export const NewIncomeModal: React.FC<NewIncomeModalProps> = ({ isOpen, onClose }) => {
    const { mutate: createTransaction, isPending } = useCreateTransaction();

    const [formData, setFormData] = useState({
        description: '',
        value: '',
        category: CATEGORIES[0].value,
        paymentId: '',
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (isOpen) {
            setFormData(prev => ({ ...prev, date: new Date().toISOString().split('T')[0] }));
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createTransaction({
            description: formData.description,
            category: formData.category,
            value: parseFloat(formData.value),
            type: 'INCOME',
            isPaid: true, // we assume incomes are paid right away or we could add a field
            recurrenceDetails: { tipo: 'AVULSO', date: formData.date },
            paymentId: formData.paymentId || undefined
        }, {
            onSuccess: () => {
                onClose();
                setFormData({
                    description: '',
                    value: '',
                    category: CATEGORIES[0].value,
                    paymentId: '',
                    date: new Date().toISOString().split('T')[0]
                });
            },
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Nova Entrada">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Descrição"
                        placeholder="Ex: Salário Mensal"
                        required
                        value={formData.description}
                        onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    />
                    <Input
                        label="Valor"
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        required
                        value={formData.value}
                        onChange={e => setFormData(prev => ({ ...prev, value: e.target.value }))}
                        leftIcon={<span className="text-muted-foreground text-xs font-bold">R$</span>}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        label="Categoria"
                        options={CATEGORIES}
                        value={formData.category}
                        onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    />
                    <Input
                        label="Data da Entrada"
                        type="date"
                        required
                        value={formData.date}
                        onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="ghost" onClick={onClose} type="button">
                        Cancelar
                    </Button>
                    <Button variant="primary" type="submit" loading={isPending}>
                        Salvar Entrada
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
