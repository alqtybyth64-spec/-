import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Smartphone, X } from 'lucide-react';

export const PWAInstallButton: React.FC<{ variant?: 'navbar' | 'banner' | 'footer' }> = ({
  variant = 'navbar',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    if (variant === 'banner') {
      return (
        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-sky-950/60 to-slate-900 border border-sky-500/20 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm">تثبيت تطبيق TAHA</h4>
              <p className="text-xs text-slate-400">ثبت التطبيق على هاتفك لتصفح أسرع وتجربة سلسة</p>
            </div>
          </div>
          <button
            onClick={install}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition duration-200 cursor-pointer shadow-md"
          >
            <Download className="w-4 h-4" />
            تثبيت الآن
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={install}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-950 border border-cyan-500/30 hover:border-cyan-400 text-cyan-400 hover:text-white text-xs font-semibold transition cursor-pointer shadow-sm"
        title="تثبيت التطبيق على جهازك"
      >
        <Smartphone className="w-3.5 h-3.5" />
        <span>تثبيت التطبيق</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-slate-300 text-xs font-semibold transition cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
          <span>تثبيت على آيفون</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-100 relative">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 left-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-base font-bold text-white mb-2">طريقة التثبيت على نظام iOS</h3>
              <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                1. اضغط على أيقونة <strong>المشاركة (Share)</strong> أسفل متصفح Safari.<br />
                2. مرر للأسفل واضغط على <strong>إضافة إلى الصفحة الرئيسية (Add to Home Screen)</strong>.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm transition"
              >
                فهمت ذلك
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
