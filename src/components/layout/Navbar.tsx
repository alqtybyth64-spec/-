import React, { useState } from 'react';
import { useApp, AppPage } from '../../context/AppContext';
import { PWAInstallButton } from '../common/PWAInstallButton';
import {
  Menu,
  X,
  Search,
  SlidersHorizontal,
  Layers,
  Sparkles,
  PhoneCall,
  Home,
  Shield,
  ExternalLink,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { settings, currentPage, navigate, searchQuery, setSearchQuery, isAdmin, logoutAdmin } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const navLinks: { label: string; page: AppPage; icon: React.ReactNode }[] = [
    { label: 'الرئيسية', page: 'home', icon: <Home className="w-4 h-4" /> },
    { label: 'التطبيقات والبرامج', page: 'apps', icon: <Layers className="w-4 h-4" /> },
    { label: 'التصنيفات', page: 'categories', icon: <SlidersHorizontal className="w-4 h-4" /> },
    { label: 'طلب تصميم موقع', page: 'web-design', icon: <Sparkles className="w-4 h-4" /> },
    { label: 'تواصل معنا', page: 'contact', icon: <PhoneCall className="w-4 h-4" /> },
  ];

  const handleNav = (page: AppPage) => {
    navigate(page);
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('apps');
      setShowSearchModal(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-xl border-b border-sky-500/15 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div
          onClick={() => handleNav('home')}
          className="flex items-center gap-3.5 cursor-pointer group shrink-0"
        >
          {settings.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={settings.siteName}
              className="w-10 h-10 object-contain rounded-xl border border-sky-500/30 group-hover:border-cyan-400 transition"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-600 via-cyan-600 to-slate-900 p-0.5 shadow-md shadow-cyan-900/20 group-hover:shadow-cyan-500/30 transition">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="font-black text-cyan-400 text-lg tracking-wider">T</span>
              </div>
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-extrabold text-xl text-white tracking-wide group-hover:text-cyan-400 transition flex items-center gap-1.5">
              {settings.siteName || 'TAHA'}
            </span>
            <span className="text-[10px] text-slate-400 font-medium hidden sm:block truncate max-w-[200px]">
              {settings.siteDescription || 'تطبيقات وبرامج'}
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => handleNav(item.page)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs lg:text-sm font-semibold transition cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Actions & Utilities */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Trigger */}
          <button
            onClick={() => setShowSearchModal(true)}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-cyan-400 text-xs font-medium flex items-center gap-2 transition cursor-pointer"
            title="بحث عن تطبيق"
          >
            <Search className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">بحث...</span>
          </button>

          {/* PWA Install Button */}
          <div className="hidden sm:block">
            <PWAInstallButton variant="navbar" />
          </div>

          {/* Admin Panel Button */}
          {isAdmin ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleNav('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  currentPage === 'admin'
                    ? 'bg-cyan-600 text-white border-cyan-500'
                    : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>إدارة الموقع</span>
              </button>
              <button
                onClick={logoutAdmin}
                className="px-2.5 py-1.5 rounded-xl text-xs bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                title="تسجيل الخروج"
              >
                خروج
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleNav('admin')}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl text-xs bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/30 transition cursor-pointer"
              title="دخول المدير"
            >
              <Shield className="w-4 h-4" />
            </button>
          )}

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            aria-label="القائمة"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 border-b border-sky-500/20 px-4 py-4 space-y-2 backdrop-blur-xl animate-fade-in">
          {navLinks.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => handleNav(item.page)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
            <PWAInstallButton variant="banner" />
            <button
              onClick={() => handleNav('admin')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300 hover:text-cyan-400"
            >
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>لوحة تحكم الموقع</span>
            </button>
          </div>
        </div>
      )}

      {/* Quick Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-slate-900 border border-cyan-500/30 rounded-2xl p-5 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-cyan-400" />
                البحث السريع في التطبيقات والبرامج
              </h3>
              <button
                onClick={() => setShowSearchModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="اكتب اسم التطبيق، التصنيف، أو الكلمة المفتاحية..."
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition"
              />
              <button
                type="submit"
                className="absolute left-2.5 top-2.5 px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition cursor-pointer"
              >
                بحث
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
