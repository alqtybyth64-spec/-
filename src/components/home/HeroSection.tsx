import React from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Sparkles, Layers, ShieldCheck, ArrowDown } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { settings, navigate, searchQuery, setSearchQuery } = useApp();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('apps');
    }
  };

  return (
    <section className="relative w-full py-10 sm:py-16 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-sky-600/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        {/* Top badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-inner">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>المنصة الرسمية والمصدر الموثوق لتطبيقات طه القطيبي</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight sm:leading-snug">
          {settings.heroTitle || 'منصة TAHA للبرمجيات والتطبيقات'}
        </h1>

        {/* Hero Subtitle */}
        <p className="max-w-2xl mx-auto text-sm sm:text-lg text-slate-300 font-normal leading-relaxed">
          {settings.heroSubtitle || 'تصفح وحمّل تطبيقات أندرويد وبرامج الكمبيوتر المصممة بأحدث التقنيات وأعلى معايير الأمان.'}
        </p>

        {/* Big Search Bar */}
        <div className="max-w-xl mx-auto pt-2">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center shadow-2xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن اسم البرنامج أو التطبيق الذي تريده..."
              className="w-full pl-28 pr-12 py-3.5 sm:py-4 rounded-2xl bg-slate-900/95 border border-sky-500/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition"
            />
            <Search className="w-5 h-5 text-cyan-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <button
              type="submit"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm transition cursor-pointer shadow-md"
            >
              بحث
            </button>
          </form>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate('apps')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-cyan-950/50 transition cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            <span>استعراض جميع التطبيقات</span>
          </button>
          <button
            onClick={() => navigate('web-design')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/40 text-slate-200 text-xs sm:text-sm font-bold transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>طلب تصميم موقع أو تطبيق خاص</span>
          </button>
        </div>
      </div>
    </section>
  );
};
