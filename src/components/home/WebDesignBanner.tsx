import React from 'react';
import { useApp } from '../../context/AppContext';
import { PlatformIcon } from '../common/PlatformIcon';
import { Sparkles, Code2, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const WebDesignBanner: React.FC = () => {
  const { settings, navigate } = useApp();

  const hasWhatsapp = settings.whatsappNumber && settings.whatsappNumber.trim().length > 0;
  const cleanNumber = hasWhatsapp ? settings.whatsappNumber.replace(/[^0-9]/g, '') : '';
  const prefilled = encodeURIComponent(
    settings.whatsappMessage || 'مرحبًا طه القطيبي، أود الاستفسار حول تصميم وتطوير موقع أو تطبيق خاص.'
  );
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${prefilled}`;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-10 md:p-12 bg-gradient-to-br from-slate-900 via-slate-900/90 to-sky-950 border border-cyan-500/30 shadow-2xl">
        {/* Glow behind */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>خدمات البرمجة والتطوير المخصصة</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
              هل تريد موقعًا أو تطبيقًا خاصًا بك؟
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              نقدم خدمات تصميم وتطوير المواقع الإلكترونية وتطبيقات الهواتف الذكية المخصصة بأحدث التقنيات وأعلى معايير الحماية وسرعة الأداء لتلبية احتياجات عملك ومشاريعك.
            </p>

            {/* Feature bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>تصميم متجاوب وسريع متوافق مع كافة الأجهزة</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>لوحات تحكم متكاملة وإدارة محتوى سهلة</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>برمجة تطبيقات أندرويد أصلية وعالية الأداء</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>دعم فني مستمر وأمان برمجي متين</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
            {/* Primary Request Button */}
            <button
              onClick={() => navigate('web-design')}
              className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-xl shadow-cyan-950/60 transition cursor-pointer"
            >
              <Code2 className="w-4 h-4" />
              <span>طلب تصميم موقع أو تطبيق</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            {/* Direct WhatsApp Button (STRICTLY HIDDEN if no whatsappNumber configured by admin!) */}
            {hasWhatsapp && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-slate-950/80 hover:bg-slate-950 border border-teal-500/40 hover:border-teal-400 text-teal-300 hover:text-teal-200 font-bold text-sm transition shadow-lg"
              >
                <PlatformIcon platform="whatsapp" size={20} className="text-teal-400" />
                <span>تواصل مباشر عبر واتساب</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
