import React from 'react';
import { useApp } from '../../context/AppContext';
import { PlatformIcon } from '../common/PlatformIcon';
import { Shield, Lock, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, socialLinks, navigate } = useApp();

  const enabledSocialLinks = socialLinks
    .filter((l) => l.isEnabled)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <footer className="w-full bg-slate-950 border-t border-sky-500/15 pt-12 pb-8 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800/80">
          {/* Column 1: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={settings.siteName}
                  className="w-9 h-9 object-contain rounded-xl border border-sky-500/30"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-600 to-cyan-600 flex items-center justify-center font-black text-white text-base">
                  T
                </div>
              )}
              <span className="font-black text-lg text-white tracking-wider">
                {settings.siteName || 'TAHA'}
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md">
              {settings.footerText || settings.siteDescription || 'الموقع الرسمي لتطبيقات وبرامج طه القطيبي'}
            </p>

            {/* Social Accounts (Rendered ONLY if at least one active link exists!) */}
            {enabledSocialLinks.length > 0 && (
              <div className="pt-2">
                <span className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                  حسابات التواصل الاجتماعي الرسمية:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {enabledSocialLinks.map((item) => (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 transition"
                      title={item.title}
                    >
                      <PlatformIcon platform={item.platform} size={15} />
                      <span className="text-xs font-medium">{item.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">روابط سريعة</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate('home')}
                  className="hover:text-cyan-400 transition cursor-pointer"
                >
                  الرئيسية
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('apps')}
                  className="hover:text-cyan-400 transition cursor-pointer"
                >
                  جميع التطبيقات والبرامج
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('categories')}
                  className="hover:text-cyan-400 transition cursor-pointer"
                >
                  تصنيفات البرامج
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('web-design')}
                  className="hover:text-cyan-400 transition cursor-pointer"
                >
                  طلب تصميم وبرمجة موقع
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('contact')}
                  className="hover:text-cyan-400 transition cursor-pointer"
                >
                  تواصل مع المطور
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Admin */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">الأمان والإدارة</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate('privacy')}
                  className="hover:text-cyan-400 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-cyan-500" />
                  <span>سياسة الخصوصية والأمان</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('admin')}
                  className="hover:text-cyan-400 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-cyan-500" />
                  <span>دخول لوحة إدارة الموقع</span>
                </button>
              </li>
              {settings.whatsappNumber && (
                <li>
                  <a
                    href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      settings.whatsappMessage || ''
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-cyan-400 transition flex items-center gap-1.5"
                  >
                    <PlatformIcon platform="whatsapp" size={14} className="text-cyan-400" />
                    <span>محادثة واتساب مباشرة</span>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>{settings.copyrightText || `جميع الحقوق محفوظة © ${new Date().getFullYear()} - طه القطيبي`}</div>
          <div className="flex items-center gap-2">
            <span>منصة رقمية موثوقة</span>
            <span>•</span>
            <button
              onClick={() => navigate('admin')}
              className="text-slate-600 hover:text-slate-400 transition cursor-pointer"
            >
              بوابة المسؤول
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
