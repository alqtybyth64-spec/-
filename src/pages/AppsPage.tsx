import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { AppCard } from '../components/apps/AppCard';
import { EmptyState } from '../components/common/EmptyState';
import { Search, Filter, Layers, ArrowUpDown, Smartphone, Monitor } from 'lucide-react';

export const AppsPage: React.FC = () => {
  const { apps, settings, selectedCategory, searchQuery, setSearchQuery } = useApp();
  const [filterCategory, setFilterCategory] = useState<string>(selectedCategory || 'all');
  const [filterOs, setFilterOs] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'downloads' | 'name'>('latest');

  const categories = ['all', ...(settings.categories || [])];

  const filteredApps = useMemo(() => {
    return apps
      .filter((app) => {
        if (!app.isPublished) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = app.name.toLowerCase().includes(q);
          const matchDesc = app.shortDescription?.toLowerCase().includes(q);
          const matchCat = app.category?.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchCat) return false;
        }

        // Category
        if (filterCategory !== 'all' && app.category !== filterCategory) {
          return false;
        }

        // Operating System
        if (filterOs !== 'all') {
          const appOs = (app.operatingSystem || '').toLowerCase();
          if (!appOs.includes(filterOs.toLowerCase())) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'downloads') {
          return (b.downloadCount || 0) - (a.downloadCount || 0);
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name, 'ar');
        }
        // Latest
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
  }, [apps, searchQuery, filterCategory, filterOs, sortBy]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-4xl font-black text-white flex items-center gap-3">
          <Layers className="w-7 h-7 text-cyan-400" />
          <span>التطبيقات والبرامج</span>
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          استكشف جميع التطبيقات والبرامج المتاحة، وابحث بحسب التصنيف أو نظام التشغيل.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 mb-8">
        {/* Search input & Sort */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-8 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم أو الوصف أو التصنيف..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <div className="md:col-span-4 flex items-center gap-2">
            <span className="text-xs text-slate-400 shrink-0 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>الترتيب:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-400 transition cursor-pointer"
            >
              <option value="latest">الأحدث إضافةً</option>
              <option value="downloads">الأكثر تنزيلًا</option>
              <option value="name">أبجديًا (أ-ي)</option>
            </select>
          </div>
        </div>

        {/* Categories Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          <span className="text-xs text-slate-400 shrink-0 flex items-center gap-1 ml-2">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>التصنيف:</span>
          </span>
          {categories.map((cat) => {
            const isSelected = filterCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat === 'all' ? 'الكل' : cat}
              </button>
            );
          })}
        </div>

        {/* OS Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          <span className="text-xs text-slate-400 shrink-0 ml-2">النظام:</span>
          {[
            { id: 'all', label: 'جميع الأنظمة' },
            { id: 'android', label: 'أندرويد (Android)' },
            { id: 'windows', label: 'ويندوز (Windows)' },
            { id: 'web', label: 'تطبيقات الويب' },
          ].map((os) => {
            const isSelected = filterOs === os.id;
            return (
              <button
                key={os.id}
                onClick={() => setFilterOs(os.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                  isSelected
                    ? 'bg-slate-700 text-cyan-300 border border-cyan-400/30'
                    : 'bg-slate-950/60 hover:bg-slate-800 text-slate-400 border border-slate-800/80'
                }`}
              >
                {os.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Apps Grid or Empty State */}
      {filteredApps.length === 0 ? (
        <EmptyState
          title={searchQuery || filterCategory !== 'all' ? 'لا توجد نتائج مطابقة لبحثك' : undefined}
          message={
            searchQuery || filterCategory !== 'all'
              ? 'جرّب تغيير كلمات البحث أو اختيار تصنيف آخر.'
              : undefined
          }
          actionText={searchQuery || filterCategory !== 'all' ? 'إعادة ضبط الفلاتر' : undefined}
          onAction={() => {
            setSearchQuery('');
            setFilterCategory('all');
            setFilterOs('all');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredApps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  );
};
