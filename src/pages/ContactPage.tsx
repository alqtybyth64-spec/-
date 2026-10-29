import React from 'react';
import { useApp } from '../context/AppContext';
import { PlatformIcon } from '../components/common/PlatformIcon';
import { PhoneCall, ExternalLink, Mail, MessageCircle, ShieldCheck } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings, socialLinks, navigate } = useApp();

  const enabledLinks = socialLinks
    .filter((l) => l.isEnabled)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const hasWhatsapp = settings.whatsappNumber && settings.whatsappNumber.trim().length > 0;
  const cleanNumber = hasWhatsapp ? settings.whatsappNumber.replace(/[^0-9]/g, '') : '';
  const prefilled = encodeURIComponent(
    settings.whatsappMessage || 'مرحبًا بك، أود التواصل المباشر مع طه القطيبي.'
  );
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${prefilled}`;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-bold">
          <PhoneCall className="w-3.5 h-3.5" />
          <span>تواصل مباشر</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white">
          قنوات التواصل الرسمية
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          يسعدنا تواصلكم واستفساراتكم حول التطبيقات والبرمجيات والمشاريع التقنية عبر القنوات الرسمية المفعلة.
        </p>
      </div>

      <div className="space-y-6">
        {/* Direct WhatsApp Box (Shown ONLY if WhatsApp number is configured by admin!) */}
        {hasWhatsapp && (
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-950/70 to-slate-900 border border-teal-500/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center gap-4 text-center sm:text-right">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/30">
                <PlatformIcon platform="whatsapp" size={28} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">المحادثة السريعة عبر واتساب</h3>
                <p className="text-xs text-slate-300 mt-1">تواصل مباشرة مع المطور طه القطيبي للمناقشة السريعة والمباشرة</p>
              </div>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm transition shadow-lg cursor-pointer"
            >
              <PlatformIcon platform="whatsapp" size={18} />
              <span>بدء المحادثة</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Dynamic Social Accounts (Shown ONLY if at least one link exists and is enabled!) */}
        {enabledLinks.length > 0 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white mb-2">الحسابات والمنصات الرقمية الرسمية:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {enabledLinks.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-cyan-400 border border-slate-800 group-hover:border-cyan-500/40 group-hover:scale-105 transition">
                      <PlatformIcon platform={item.platform} size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-slate-500 capitalize">{item.platform}</span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* If neither WhatsApp nor social links exist */}
        {!hasWhatsapp && enabledLinks.length === 0 && (
          <div className="p-10 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
            <ShieldCheck className="w-10 h-10 text-cyan-400 mx-auto" />
            <h3 className="text-base font-bold text-white">قنوات التواصل قيد التحديث</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              سيقوم المسؤول بإضافة وتفعيل قنوات التواصل وحسابات المنصات قريبًا.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('web-design')}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition"
              >
                إرسال استفسار عبر نموذج طلب موقع
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
