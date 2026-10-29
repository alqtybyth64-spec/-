import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Compass, ArrowRight } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900/80 border border-slate-800 text-center space-y-5 shadow-2xl">
        <div className="w-20 h-20 rounded-3xl bg-slate-950 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-inner">
          <Compass className="w-10 h-10 animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl sm:text-5xl font-black text-cyan-400 font-mono">404</span>
          <h1 className="text-xl sm:text-2xl font-black text-white">الصفحة غير موجودة</h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            عذرًا، الصفحة التي تحاول الوصول إليها قد تم نقلها أو أنها غير متوفرة حاليًا.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={() => navigate('home')}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs sm:text-sm transition cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>العودة إلى الصفحة الرئيسية</span>
          </button>
        </div>
      </div>
    </div>
  );
};
