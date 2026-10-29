import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronRight, ChevronLeft, ExternalLink, Sparkles } from 'lucide-react';

export const AdSlider: React.FC = () => {
  const { ads, navigate } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Filter valid published ads considering dates
  const now = new Date();
  const validAds = ads.filter((ad) => {
    if (!ad.isPublished) return false;
    if (ad.startDate && new Date(ad.startDate) > now) return false;
    if (ad.endDate && new Date(ad.endDate) < now) return false;
    return true;
  }).sort((a, b) => (a.order || 0) - (b.order || 0));

  // If no published ads, completely hide the slider section as instructed!
  if (validAds.length === 0) {
    return null;
  }

  const currentAd = validAds[currentIndex % validAds.length];
  const duration = (currentAd?.durationSeconds || 5) * 1000;

  useEffect(() => {
    if (isPaused || validAds.length <= 1) return;

    timerRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % validAds.length);
    }, duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, isPaused, duration, validAds.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + validAds.length) % validAds.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % validAds.length);
  };

  const handleAdClick = () => {
    if (!currentAd.targetUrl) return;
    if (currentAd.targetUrl.startsWith('http://') || currentAd.targetUrl.startsWith('https://')) {
      const a = document.createElement('a');
      a.href = currentAd.targetUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else if (currentAd.targetUrl.startsWith('app:')) {
      const appId = currentAd.targetUrl.replace('app:', '');
      navigate('app-detail', { appId });
    } else {
      navigate(currentAd.targetUrl as any);
    }
  };

  return (
    <section
      aria-label="شريط الإعلانات الترويجية"
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div
        onClick={handleAdClick}
        className={`relative w-full h-44 sm:h-64 md:h-80 lg:h-96 rounded-2xl md:rounded-3xl overflow-hidden border border-sky-500/25 bg-slate-900 shadow-xl group transition-all duration-300 ${
          currentAd.targetUrl ? 'cursor-pointer hover:border-cyan-400' : ''
        }`}
      >
        {/* Ad Image with Cover/Contain Fit */}
        <img
          src={currentAd.imageUrl}
          alt={currentAd.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
        />

        {/* Ambient Overlay Gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

        {/* Ad Title & Callout Overlay */}
        <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 md:p-8 flex items-end justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 text-[10px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3 h-3" />
              <span>إعلان مميز</span>
            </div>
            <h3 className="text-base sm:text-2xl md:text-3xl font-black text-white drop-shadow-md">
              {currentAd.title}
            </h3>
            {currentAd.text && (
              <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 drop-shadow">
                {currentAd.text}
              </p>
            )}
          </div>

          {currentAd.targetUrl && (
            <div className="shrink-0 hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition shadow-lg">
              <span>عرض التفاصيل</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        {/* Navigation Arrows (if more than 1 ad) */}
        {validAds.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-950/70 hover:bg-slate-900 border border-slate-700/60 text-white flex items-center justify-center transition opacity-80 hover:opacity-100 cursor-pointer backdrop-blur-sm"
              aria-label="السابق"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-950/70 hover:bg-slate-900 border border-slate-700/60 text-white flex items-center justify-center transition opacity-80 hover:opacity-100 cursor-pointer backdrop-blur-sm"
              aria-label="التالي"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Indicator Dots */}
        {validAds.length > 1 && (
          <div className="absolute top-4 left-4 flex items-center gap-1.5 p-1.5 rounded-full bg-slate-950/60 backdrop-blur-md border border-slate-800">
            {validAds.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`transition-all rounded-full cursor-pointer ${
                  idx === currentIndex % validAds.length
                    ? 'w-6 h-2 bg-cyan-400'
                    : 'w-2 h-2 bg-slate-600 hover:bg-slate-400'
                }`}
                aria-label={`شريحة رقم ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
