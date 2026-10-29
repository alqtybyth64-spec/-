import React, { useState } from 'react';
import { AppItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { Download, ExternalLink, HardDrive, Smartphone, Monitor, Globe } from 'lucide-react';

interface AppCardProps {
  app: AppItem;
}

export const AppCard: React.FC<AppCardProps> = ({ app }) => {
  const { navigate, registerDownload } = useApp();
  const [downloading, setDownloading] = useState(false);

  const handleDownloadClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const getOsIcon = (os: string = '') => {
    const norm = os.toLowerCase();
    if (norm.includes('android')) return <Smartphone className="w-3.5 h-3.5" />;
    if (norm.includes('windows') || norm.includes('pc') || norm.includes('mac')) return <Monitor className="w-3.5 h-3.5" />;
    return <Globe className="w-3.5 h-3.5" />;
  };

  return (
    <div
      onClick={() => navigate('app-detail', { appId: app.id })}
      className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900 transition-all duration-300 shadow-md flex flex-col justify-between group cursor-pointer"
    >
      <div>
        {/* Top Header: Icon & Category/OS */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-sky-500/25 p-1.5 flex items-center justify-center shrink-0 group-hover:border-cyan-400 group-hover:scale-105 transition duration-300 shadow-md">
            {app.iconUrl ? (
              <img
                src={app.iconUrl}
                alt={app.name}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <div className="w-full h-full rounded-xl bg-gradient-to-br from-cyan-600 to-sky-700 flex items-center justify-center text-white font-black text-xl">
                {app.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-cyan-400 text-[10px] font-bold">
              {app.category || 'عام'}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              {getOsIcon(app.operatingSystem)}
              <span>{app.operatingSystem || 'أندرويد'}</span>
            </div>
          </div>
        </div>

        {/* Title & Version */}
        <div className="mb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition line-clamp-1">
              {app.name}
            </h3>
            {app.version && (
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono">
                v{app.version}
              </span>
            )}
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-4">
          {app.shortDescription}
        </p>
      </div>

      {/* Footer Info & Actions */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          {app.fileSize && (
            <span className="flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5 text-cyan-500" />
              <span>{app.fileSize}</span>
            </span>
          )}
          {typeof app.downloadCount === 'number' && app.downloadCount > 0 && (
            <span className="text-slate-500 font-medium">
              {app.downloadCount} تنزيل
            </span>
          )}
        </div>

        <button
          onClick={handleDownloadClick}
          disabled={downloading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-50"
          title="تحميل مباشر"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{downloading ? 'جاري التحميل...' : 'تنزيل'}</span>
        </button>
      </div>
    </div>
  );
};
