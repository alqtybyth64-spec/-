import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserCheck, Code, Award, CheckCircle } from 'lucide-react';

export const DeveloperSection: React.FC = () => {
  const { settings, navigate } = useApp();

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-center gap-8">
        {/* Developer Badge / Monogram */}
        <div className="shrink-0 relative">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-sky-600 via-cyan-600 to-slate-900 p-1 shadow-xl">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex flex-col items-center justify-center text-center p-2">
              <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider">المطور</span>
              <span className="text-2xl font-black text-white mt-0.5">طه</span>
              <span className="text-[10px] text-slate-400">القطيبي</span>
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-cyan-500 text-slate-950 shadow-md">
            <UserCheck className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>

        {/* Bio Content */}
        <div className="flex-1 space-y-3 text-center md:text-right">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-cyan-400 text-xs font-semibold">
            <Code className="w-3.5 h-3.5" />
            <span>نبذة عن المطور</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white">
            {settings.developerName || 'طه القطيبي'}
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
            {settings.developerBio ||
              'مهندس برمجيات ومطور تطبيقات، أركز على بناء حلول برمجية وتطبيقات عملية متطورة تتميز بالسرعة والموثوقية وسهولة الاستخدام مع الالتزام بأرقى معايير أمان البيانات.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-cyan-400" />
              <span>تطوير تطبيقات أندرويد الحديثة</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-cyan-400" />
              <span>بناء مواقع وأنظمة ويب متكاملة</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-cyan-400" />
              <span>أمان وحماية الملفات البرمجية</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
