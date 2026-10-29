import React from 'react';
import { useApp } from '../../context/AppContext';
import { AppCard } from '../apps/AppCard';
import { Sparkles, ArrowLeft } from 'lucide-react';

export const LatestAppsSection: React.FC = () => {
  const { apps, navigate } = useApp();

  const publishedApps = apps.filter((a) => a.isPublished);

  // If no published apps, skip duplicating the empty state if Featured already showed it
  if (publishedApps.length === 0) {
    return null;
  }

  const latestApps = [...publishedApps]
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 8);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-cyan-400 text-xs font-bold mb-1">
            <Sparkles className="w-4 h-4" />
            <span>إصدارات جديدة</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">أحدث التطبيقات المضافة</h2>
        </div>
        <button
          onClick={() => navigate('apps')}
          className="flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition cursor-pointer"
        >
          <span>تصفح الكل</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {latestApps.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>
    </section>
  );
};
