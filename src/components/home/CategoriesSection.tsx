import React from 'react';
import { useApp } from '../../context/AppContext';
import { Folder, Layers, Cpu, Sparkles, Wrench, Bookmark } from 'lucide-react';

export const CategoriesSection: React.FC = () => {
  const { settings, apps, navigate } = useApp();

  const categories = settings.categories || ['عام', 'أدوات ونظام', 'إنتاجية وأعمال', 'تعليم ومعرفة', 'إسلاميات', 'وسائط وترفيه'];

  const getCategoryCount = (cat: string) => {
    return apps.filter((a) => a.isPublished && a.category === cat).length;
  };

  const handleSelectCategory = (cat: string) => {
    navigate('apps', { category: cat });
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>تصنيفات البرامج والتطبيقات</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            اختر التصنيف لاستعراض التطبيقات والبرامج التابعة له
          </p>
        </div>
        <button
          onClick={() => navigate('categories')}
          className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition cursor-pointer"
        >
          عرض الكل ←
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
        {categories.map((cat, idx) => {
          const count = getCategoryCount(cat);
          return (
            <div
              key={idx}
              onClick={() => handleSelectCategory(cat)}
              className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-900 transition-all duration-200 cursor-pointer flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-cyan-500/20 transition duration-300">
                <Folder className="w-6 h-6" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-200 group-hover:text-cyan-300 transition line-clamp-1">
                {cat}
              </h3>
              <span className="text-[10px] text-slate-500 mt-1">
                {count > 0 ? `${count} تطبيق` : 'قريبًا'}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
