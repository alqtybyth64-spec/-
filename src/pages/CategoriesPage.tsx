import React from 'react';
import { useApp } from '../context/AppContext';
import { Folder, Layers, ArrowLeft } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const { settings, apps, navigate } = useApp();

  const categories = settings.categories || ['عام', 'أدوات ونظام', 'إنتاجية وأعمال', 'تعليم ومعرفة', 'إسلاميات', 'وسائط وترفيه'];

  const getCategoryCount = (cat: string) => {
    return apps.filter((a) => a.isPublished && a.category === cat).length;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-4xl font-black text-white flex items-center gap-3">
          <Layers className="w-7 h-7 text-cyan-400" />
          <span>تصنيفات التطبيقات والبرامج</span>
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          اختر التصنيف لعرض كافة البرامج والتطبيقات التابعة له.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {categories.map((cat, idx) => {
          const count = getCategoryCount(cat);
          return (
            <div
              key={idx}
              onClick={() => navigate('apps', { category: cat })}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900 transition-all duration-300 cursor-pointer flex flex-col justify-between group shadow-md"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 flex items-center justify-center group-hover:scale-105 group-hover:bg-cyan-500/20 transition duration-300">
                  <Folder className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs text-slate-400 font-semibold">
                  {count} تطبيق
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                  {cat}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  استعراض جميع برامج {cat}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-cyan-400 group-hover:text-cyan-300">
                <span>تصفح القسم</span>
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
