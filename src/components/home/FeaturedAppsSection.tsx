import React from 'react';
import { useApp } from '../../context/AppContext';
import { AppCard } from '../apps/AppCard';
import { EmptyState } from '../common/EmptyState';
import { Star, ArrowLeft } from 'lucide-react';

export const FeaturedAppsSection: React.FC = () => {
  const { apps, navigate } = useApp();

  const featuredApps = apps.filter((a) => a.isPublished && a.isFeatured);

  // If no published apps at all, show empty state if featured section is active, or if published apps exist but none marked featured, take top published apps
  const publishedApps = apps.filter((a) => a.isPublished);

  if (publishedApps.length === 0) {
    return (
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-slate-800/40">
        <EmptyState />
      </section>
    );
  }

  const displayList = featuredApps.length > 0 ? featuredApps : publishedApps.slice(0, 4);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-cyan-400 text-xs font-bold mb-1">
            <Star className="w-4 h-4 fill-cyan-400" />
            <span>مختارة بعناية</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">التطبيقات والبرامج المميزة</h2>
        </div>
        <button
          onClick={() => navigate('apps')}
          className="flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition cursor-pointer"
        >
          <span>مشاهدة الكل</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {displayList.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>
    </section>
  );
};
