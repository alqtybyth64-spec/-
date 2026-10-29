import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Lock, ArrowRight } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  const { settings, navigate } = useApp();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => navigate('home')}
        className="flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition mb-6 cursor-pointer"
      >
        <ArrowRight className="w-4 h-4" />
        <span>العودة للرئيسية</span>
      </button>

      <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">سياسة الخصوصية والأمان</h1>
            <p className="text-xs text-slate-400">منصة {settings.siteName || 'TAHA'} لتطبيقات وبرامج طه القطيبي</p>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-slate-300 leading-loose whitespace-pre-line">
          {settings.privacyPolicyText ||
            `سياسة الخصوصية لمنصة TAHA:
نحن في منصة TAHA نولي خصوصية الزوار والمستخدمين أهمية بالغة.
1. جمع البيانات: لا نقوم بجمع أي بيانات شخصية إلا ما يقدمه المستخدم برغبته الكاملة عند إرسال طلب تصميم موقع أو التواصل المباشر.
2. ملفات التطبيقات: جميع ملفات التطبيقات والبرامج يتم فحصها بدقة لضمان سلامتها وخلوها من أي برمجيات ضارة.
3. الأطراف الثالثة: لا نقوم ببيع أو مشاركة بيانات المستخدمين مع أي جهات خارجية.
4. التحديثات: نحتفظ بالحق في تعديل هذه السياسة عند الحاجة بما يخدم حماية خصوصية المستخدمين.`}
        </div>
      </div>
    </div>
  );
};
