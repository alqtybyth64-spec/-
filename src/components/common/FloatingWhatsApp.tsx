import React from 'react';
import { useApp } from '../../context/AppContext';
import { PlatformIcon } from './PlatformIcon';

export const FloatingWhatsApp: React.FC = () => {
  const { settings } = useApp();

  // If no WhatsApp number configured by the admin, or feature disabled, hide completely!
  if (!settings.whatsappNumber || !settings.whatsappNumber.trim() || !settings.showFloatingWhatsapp) {
    return null;
  }

  const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
  if (!cleanNumber) return null;

  const prefilled = encodeURIComponent(settings.whatsappMessage || 'مرحبًا بك، أود التواصل بشأن الموقع والتطبيقات');
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${prefilled}`;

  return (
    <aside aria-label="تواصل عبر واتساب" className="fixed bottom-6 right-6 z-40">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل مباشر عبر واتساب"
        className="group relative flex items-center gap-3 p-3.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white rounded-full shadow-2xl shadow-cyan-900/40 border border-cyan-400/30 transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <span className="sr-only">تواصل مباشر عبر واتساب</span>
        {/* Subtle ripple wave */}
        <span className="absolute -inset-1 rounded-full bg-cyan-400 opacity-25 animate-ping pointer-events-none" />

        {/* Authentic WhatsApp Icon */}
        <PlatformIcon platform="whatsapp" size={26} className="text-white drop-shadow" />

        {/* Expandable Label */}
        <span className="hidden group-hover:inline-block max-w-0 group-hover:max-w-xs overflow-hidden transition-all duration-300 text-xs font-bold whitespace-nowrap pl-1">
          محادثة واتساب مباشرة
        </span>
      </a>
    </aside>
  );
};
