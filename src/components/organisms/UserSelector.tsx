import React from 'react';
import type { User } from '../../api/services/user/@types/User';

interface UserSelectorProps {
    selectedUserIds: string[];
    onToggleUser: (userId: string) => void;
    currentUser: User;
    users?: User[]; // Optional for now to keep backward compat if needed, but better required
}

// Helper for color generation
const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00ffffff).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
};

export const UserSelector: React.FC<UserSelectorProps> = ({
    selectedUserIds,
    onToggleUser,
    currentUser,
    users = []
}) => {
    // Se não for usuário principal, só mostra o próprio usuário
    // Assuming isPrincipal is not on the new type yet? or it was removed? 
    // The previous task said "removed deprecated fields like isPrincipal". 
    // So we should probably remove this logic or adapt it.
    // For now, let's assume all users are available if requested.

    const availableUsers = users.length > 0 ? users : [currentUser];

    // If we want to simulate "principal" behavior, maybe check specific ID or just allow all
    // The refactor instruction said "removed isPrincipal". 
    // So let's simplify: show all users passed in props.

    return (
        <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <h2 className="text-lg font-semibold text-foreground">
                        Usuários
                    </h2>
                </div>
                {selectedUserIds.length > 0 && (
                    <span className="text-sm text-muted-foreground">
                        {selectedUserIds.length} selecionado(s)
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {availableUsers.map((user) => {
                    const userId = user.id || 'unknown';
                    const isSelected = selectedUserIds.includes(userId);
                    const userColor = stringToColor(user.name || 'User');

                    return (
                        <div
                            key={userId}
                            onClick={() => userId !== 'unknown' && onToggleUser(userId)}
                            className={`
                rounded-xl p-5 border-2 transition-all duration-300 cursor-pointer select-none
                ${isSelected
                                    ? 'opacity-100 scale-[1.02] ring-2 ring-offset-2 ring-offset-background ring-primary border-primary/50 bg-card'
                                    : 'opacity-70 hover:opacity-100 hover:scale-[1.01] border-border bg-card/50'}
              `}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg"
                                        style={{ backgroundColor: userColor }}
                                    >
                                        {(user.name || 'U').charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">{user.name || 'Usuário'}</h3>
                                    </div>
                                </div>
                                {isSelected && (
                                    <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{user.email || ''}</p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
