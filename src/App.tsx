import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { AppsPage } from './pages/AppsPage';
import { AppDetailPage } from './pages/AppDetailPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { WebDesignRequestPage } from './pages/WebDesignRequestPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { AdminPage } from './pages/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { FloatingWhatsApp } from './components/common/FloatingWhatsApp';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Loader2 } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentPage, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-9 h-9 text-cyan-400 animate-spin" />
        <span className="text-sm font-medium text-slate-400">جاري تحميل المنصة...</span>
      </div>
    );
  }

  switch (currentPage) {
    case 'home':
      return <HomePage />;
    case 'apps':
      return <AppsPage />;
    case 'app-detail':
      return <AppDetailPage />;
    case 'categories':
      return <CategoriesPage />;
    case 'web-design':
      return <WebDesignRequestPage />;
    case 'contact':
      return <ContactPage />;
    case 'privacy':
      return <PrivacyPolicyPage />;
    case 'admin':
      return <AdminPage />;
    case 'not-found':
    default:
      return <NotFoundPage />;
  }
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <div
          dir="rtl"
          className="min-h-screen bg-[#070d1e] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200"
        >
          <Navbar />
          <main className="flex-1 w-full">
            <MainContent />
          </main>
          <Footer />
          <FloatingWhatsApp />
          <OfflineIndicator />
        </div>
      </AppProvider>
    </ErrorBoundary>
  );
}
