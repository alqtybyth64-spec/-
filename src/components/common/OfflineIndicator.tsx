import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-xl bg-slate-900/95 border border-cyan-500/40 px-3.5 py-2 text-xs font-semibold text-cyan-200 shadow-2xl backdrop-blur-md animate-fade-in">
      <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
      <WifiOff className="w-4 h-4 text-cyan-400" />
      <span>أنت غير متصل بالإنترنت - يتم عرض البيانات المخزنة محلياً</span>
    </div>
  );
};
