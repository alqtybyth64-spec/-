import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AppCard } from '../components/apps/AppCard';
import {
  Download,
  ArrowRight,
  HardDrive,
  Calendar,
  Smartphone,
  CheckCircle,
  ExternalLink,
  Shield,
  Layers,
} from 'lucide-react';

export const AppDetailPage: React.FC = () => {
  const { apps, selectedAppId, navigate, registerDownload } = useApp();
  const [downloading, setDownloading] = useState(false);

  const app = apps.find((a) => a.id === selectedAppId);

  if (!app) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-white mb-4">التطبيق غير موجود أو تم حذفه</h2>
        <button
          onClick={() => navigate('apps')}
          className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition"
        >
          العودة لقائمة التطبيقات
        </button>
      </div>
    );
  }

  const relatedApps = apps
    .filter((a) => a.id !== app.id && a.isPublished && a.category === app.category)
    .slice(0, 3);

  const handleDownload = async () => {
    if (!app.downloadUrl) return;
    setDownloading(true);
    try {
      await registerDownload(app.id);
      const a = document.createElement('a');
      a.href = app.downloadUrl;
      if (app.downloadUrl.startsWith('http://') || app.downloadUrl.startsWith('https://')) {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      } else {
        a.download = `${app.name}-v${app.version || '1.0'}`;
      }
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setTimeout(() => setDownloading(false), 1200);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back Button */}
      <button
        onClick={() => navigate('apps')}
        className="flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition mb-6 cursor-pointer"
      >
        <ArrowRight className="w-4 h-4" />
        <span>العودة لجميع التطبيقات</span>
      </button>

      {/* Hero Header Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-sky-500/20 shadow-2xl mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            {/* App Icon */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-slate-950 border border-sky-500/30 p-2 shrink-0 flex items-center justify-center shadow-lg">
              {app.iconUrl ? (
                <img
                  src={app.iconUrl}
                  alt={app.name}
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-sky-600 to-cyan-600 flex items-center justify-center text-white font-black text-3xl">
                  {app.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Title & Metadata */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
                  {app.category || 'عام'}
                </span>
                {app.isFeatured && (
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 text-[10px] font-semibold">
                    تطبيق مميز
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">{app.name}</h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl">{app.shortDescription}</p>
            </div>
          </div>

          {/* Download CTA Button */}
          <div className="w-full md:w-auto shrink-0 flex flex-col items-center gap-2">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full md:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-black text-sm shadow-xl shadow-cyan-950/70 transition cursor-pointer disabled:opacity-50"
            >
              <Download className="w-5 h-5" />
              <span>{downloading ? 'جاري بدء التنزيل...' : 'تنزيل التطبيق الآن'}</span>
            </button>
            <span className="text-[11px] text-slate-400">
              {app.isExternalDownload ? 'رابط تنزيل خارجي موثوق' : 'تنزيل مباشر للملف'}
            </span>
          </div>
        </div>

        {/* Specs Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 mt-6 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <div>
              <span className="block text-[10px] text-slate-500">نظام التشغيل:</span>
              <span className="font-semibold">{app.operatingSystem || 'أندرويد'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <HardDrive className="w-4 h-4 text-cyan-400" />
            <div>
              <span className="block text-[10px] text-slate-500">حجم الملف:</span>
              <span className="font-semibold">{app.fileSize || 'غير محدد'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <Shield className="w-4 h-4 text-cyan-400" />
            <div>
              <span className="block text-[10px] text-slate-500">رقم الإصدار:</span>
              <span className="font-semibold font-mono">v{app.version || '1.0.0'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <div>
              <span className="block text-[10px] text-slate-500">تاريخ التحديث:</span>
              <span className="font-semibold">
                {app.updatedAt ? new Date(app.updatedAt).toLocaleDateString('ar-EG') : 'حديث'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Screenshots Gallery (if available) */}
      {app.screenshots && app.screenshots.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-black text-white mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>لقطات من واجهة التطبيق</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-x-auto pb-2">
            {app.screenshots.map((shot, idx) => (
              <div
                key={idx}
                className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-[9/16] shadow-md group"
              >
                <img
                  src={shot}
                  alt={`لقطة شاشة ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Description & Features */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 mb-10 space-y-4">
        <h2 className="text-lg font-black text-white">تفاصيل ومميزات التطبيق</h2>
        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
          {app.fullDescription || app.shortDescription}
        </div>
      </div>

      {/* Related Apps */}
      {relatedApps.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-black text-white">تطبيقات أخرى في نفس التصنيف</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedApps.map((rel) => (
              <AppCard key={rel.id} app={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
