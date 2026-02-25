import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'

import OverviewPage from './pages/OverviewPage';
import CardsPage from './pages/CardsPage';
import RecurringExpensesPage from './pages/RecurringExpensesPage';
import IncomesPage from './pages/IncomesPage';
import DesignSystemPage from './pages/DesignSystem';

import { MainLayout } from './components/templates/MainLayout'
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUsuarios } from './hooks/api/useUsuarios';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
    },
  },
});

const AppRoot = () => {
  const { data: usuarios = [] } = useUsuarios();
  const currentUser = usuarios.length > 0 ? usuarios[0] : null;

  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route element={<MainLayout currentUser={currentUser} />}>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/entradas" element={<IncomesPage />} />
          <Route path="/cartoes" element={<CardsPage />} />
          <Route path="/gastos-recorrentes" element={<RecurringExpensesPage />} />
          <Route path="/design-system" element={<DesignSystemPage />} />
          <Route path="/relatorios" element={
            <div className="flex-1 p-6 md:p-8 overflow-y-auto w-full flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-foreground mb-2">Relatórios</h1>
                <p className="text-muted-foreground">Em breve...</p>
              </div>
            </div>
          } />
          <Route path="/configuracoes" element={
            <div className="flex-1 p-6 md:p-8 overflow-y-auto w-full flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-foreground mb-2">Configurações</h1>
                <p className="text-muted-foreground">Em breve...</p>
              </div>
            </div>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppRoot />
    </QueryClientProvider>
  </StrictMode>,
)