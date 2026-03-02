import React, { useState, useEffect } from 'react';
import { Modal } from '../molecules/Modal';
import { Input } from '../atoms/Input';
import { Select } from '../atoms/Select';
import { Button } from '../atoms/Button';
import { useAuthStore } from '../../stores/useAuthStore';
import type { User } from '../../api/services/user/@types/User';
import { useCreateReceita } from '../../hooks/api/useCreateReceita';

interface NewIncomeModalProps {
    isOpen: boolean;
    onClose: () => void;
    users: User[];
}

const CATEGORIES = [
    { value: 'Salário', label: 'Salário' },
    { value: 'Benefício', label: 'Benefício' },
    { value: 'Investimento', label: 'Investimento' },
    { value: 'Extra', label: 'Extra' },
];

export const NewIncomeModal: React.FC<NewIncomeModalProps> = ({ isOpen, onClose, users }) => {
    const currentUser = useAuthStore(s => s.user);
    const { mutate: createReceita, isPending } = useCreateReceita();

    const [formData, setFormData] = useState({
        description: '',
        value: '',
        category: CATEGORIES[0].value,
        receiptDay: '1',
        userId: '',
    });

    useEffect(() => {
        if (isOpen && currentUser?.id) {
            setFormData(prev => ({ ...prev, userId: currentUser.id || '' }));
        }
    }, [isOpen, currentUser]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createReceita({
            ...formData,
            value: parseFloat(formData.value),
            receiptDay: parseInt(formData.receiptDay),
        }, {
            onSuccess: () => {
                onClose();
                setFormData({
                    description: '',
                    value: '',
                    category: CATEGORIES[0].value,
                    receiptDay: '1',
                    userId: currentUser?.id || '',
                });
            },
        });
    };

    const userOptions = users.map(u => ({
        value: u.id || '',
        label: u.name || 'Sem nome',
    }));

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Nova Receita">
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
                        label="Dia de Recebimento"
                        type="number"
                        min={1}
                        max={31}
                        required
                        value={formData.receiptDay}
                        onChange={e => setFormData(prev => ({ ...prev, receiptDay: e.target.value }))}
                    />
                </div>

                <Select
                    label="Proprietário da Receita"
                    options={userOptions}
                    value={formData.userId}
                    onChange={e => setFormData(prev => ({ ...prev, userId: e.target.value }))}
                    helperText="Selecione para quem esta receita será atribuída."
                />

                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="ghost" onClick={onClose} type="button">
                        Cancelar
                    </Button>
                    <Button variant="primary" type="submit" loading={isPending}>
                        Salvar Receita
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
