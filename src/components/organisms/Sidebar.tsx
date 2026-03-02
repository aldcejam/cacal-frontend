import type { User } from '../../api/services/user/@types/User';
import { Link, useLocation } from 'react-router-dom';

// Icons wrapper for cleaner usage
const Icons = {
    Home: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
    CreditCard: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>,
    Repeat: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
    PieChart: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></svg>,
    Settings: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.35a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>,
    Menu: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>,
    ChevronLeft: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>,
    DesignSystem: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    Wallet: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16v4" /><path d="M3 15v4a2 2 0 0 0 2 2h16v-4" /><path d="M13 13h4v4h-4z" /></svg>
};



interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
    onMenuClick: () => void;
    currentUser: User | null;
}

export const Sidebar = ({
    isOpen,
    toggleSidebar,
    onMenuClick,
    currentUser
}: SidebarProps) => {
    const location = useLocation();

    const menuItems = [
        { name: 'Visão Geral', icon: <Icons.Home />, path: '/' },
        { name: 'Entradas', icon: <Icons.Wallet />, path: '/entradas' },
        { name: 'Meus Cartões', icon: <Icons.CreditCard />, path: '/cartoes' },
        { name: 'Gastos Recorrentes', icon: <Icons.Repeat />, path: '/gastos-recorrentes' },
        { name: 'Design System', icon: <Icons.DesignSystem />, path: '/design-system' },
        { name: 'Relatórios', icon: <Icons.PieChart />, path: '/relatorios' },
        { name: 'Configurações', icon: <Icons.Settings />, path: '/configuracoes' },
    ];

    return (
        <>
            {/* Overlay Mobile */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={toggleSidebar}
            />

            {/* Container da Sidebar */}
            <aside
                className={`
                    fixed top-0 left-0 z-50 h-screen 
                    bg-background/80 backdrop-blur-xl border-r border-white/10
                    transition-all duration-300 ease-in-out flex flex-col 
                    overflow-hidden shadow-2xl shadow-black/50
                    ${isOpen ? 'w-72 translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20'}
                `}
            >
                {/* Header da Sidebar */}
                <div className="h-20 flex items-center px-6 border-b border-white/5 shrink-0 relative">

                    {/* Logo Area */}
                    <div className={`flex items-center gap-4 overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                        <div className="relative group cursor-pointer">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-xl blur opacity-40 group-hover:opacity-75 transition duration-500"></div>
                            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-900/30">
                                <div className="w-5 h-5 bg-white rounded-full opacity-90 shadow-inner" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-lg tracking-tight text-foreground leading-tight">MinhasContas</span>
                            <span className="text-[10px] uppercase tracking-widest text-emerald-500 font-semibold">Premium</span>
                        </div>
                    </div>

                    {/* Toggle Button - Desktop (Absolute to be independent of flex flow when collapsed) */}
                    <button
                        onClick={toggleSidebar}
                        className={`
                            absolute right-4 top-1/2 -translate-y-1/2
                            p-2 rounded-full 
                            text-muted-foreground hover:text-white 
                            bg-transparent hover:bg-white/5 
                            transition-all duration-200
                            ${!isOpen ? 'left-1/2 -translate-x-1/2 right-auto' : ''}
                        `}
                        title={isOpen ? "Recolher Menu" : "Expandir Menu"}
                    >
                        {isOpen ? <Icons.ChevronLeft /> : <Icons.Menu />}
                    </button>
                </div>

                {/* Navegação */}
                <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto scrollbar-hide">
                    <div className={`px-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider transition-opacity duration-300 ${!isOpen && 'opacity-0 hidden'}`}>
                        Menu Principal
                    </div>

                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                onClick={onMenuClick}
                                title={!isOpen ? item.name : ''}
                                className={`
                                    w-full flex items-center rounded-xl cursor-pointer text-sm font-medium transition-all duration-300 group relative overflow-hidden
                                    ${isActive
                                        ? 'text-white shadow-lg shadow-emerald-900/20'
                                        : 'text-muted-foreground hover:text-white hover:bg-white/5'}
                                    ${isOpen ? 'px-4 py-3.5 gap-4' : 'justify-center py-3.5 px-0'}
                                `}
                            >
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/90 to-teal-600/90 opacity-100 transition-opacity duration-300" />
                                )}

                                <span className={`relative z-10 min-w-[20px] transition-transform duration-300 ${!isOpen && isActive ? 'text-emerald-400' : ''} ${!isOpen && 'hover:scale-110'}`}>
                                    {item.icon}
                                </span>

                                <span className={`relative z-10 transition-all duration-300 whitespace-nowrap ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 absolute'}`}>
                                    {item.name}
                                </span>

                                {/* Tooltip for collapsed state */}
                                {!isOpen && (
                                    <div className="opacity-0 group-hover:opacity-100 absolute left-[calc(100%+16px)] top-1/2 -translate-y-1/2 bg-popover/90 backdrop-blur-md text-popover-foreground text-xs font-medium px-3 py-1.5 rounded-lg shadow-xl border border-white/10 whitespace-nowrap z-50 pointer-events-none transition-all duration-200 translate-x-2 group-hover:translate-x-0">
                                        {item.name}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer / User Profile */}
                {currentUser && (
                    <div className="p-4 border-t border-white/5 shrink-0 bg-black/20">
                        <div
                            className={`
                                flex items-center rounded-2xl 
                                bg-white/5 hover:bg-white/10 border border-white/5 
                                transition-all duration-300 cursor-pointer group
                                backdrop-blur-md
                                ${isOpen ? 'gap-4 p-3' : 'justify-center p-2 aspect-square'}
                            `}
                        >
                            <div className="relative shrink-0">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-violet-500 p-[2px]">
                                    <div className="w-full h-full rounded-full bg-black/50 backdrop-blur-sm overflow-hidden flex items-center justify-center text-white font-bold">
                                        {(currentUser.name || 'U').charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-black rounded-full shadow-sm"></div>
                            </div>

                            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'}`}>
                                <p className="text-sm font-semibold truncate text-white group-hover:text-emerald-400 transition-colors">
                                    {currentUser.name || 'Usuário'}
                                </p>
                                <p className="text-xs text-muted-foreground truncate opacity-80">
                                    {currentUser.email || 'sem@email.com'}
                                </p>
                            </div>

                            {isOpen && (
                                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </aside>
        </>
    );
};
