import React, { useState, useEffect } from 'react';
import { Sidebar } from '../organisms/Sidebar';
import { Outlet } from 'react-router-dom';
import type { Usuario } from '../../api/services/usuario/@types/Usuario';

interface MainLayoutProps {
    currentUser: Usuario | null;
}

export const MainLayout = ({ currentUser }: MainLayoutProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    // Detectar Mobile para estado inicial
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) setIsSidebarOpen(false);
            else setIsSidebarOpen(true);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleMenuClick = () => {
        if (isMobile) setIsSidebarOpen(false);
    };

    return (
        <div className="flex min-h-screen bg-background font-sans text-foreground overflow-x-hidden relative">

            <Sidebar
                isOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                onMenuClick={handleMenuClick}
                currentUser={currentUser}
            />

            <main
                className={`
                    flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out min-w-0 relative
                    ${isSidebarOpen ? 'md:ml-72' : 'md:ml-20'}
                `}
            >
                {/* Botão Trigger Flutuante (Mobile) */}
                <div className={`md:hidden fixed top-6 left-4 z-40 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <button
                        onClick={toggleSidebar}
                        className="p-2 bg-card/80 backdrop-blur-sm border border-border rounded-md shadow-sm text-foreground"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
                    </button>
                </div>

                <Outlet />
            </main>
        </div>
    );
};
