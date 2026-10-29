import React from 'react';
import { PackageOpen, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'سيتم إضافة التطبيقات والبرامج قريبًا',
  message = 'يجري العمل حاليًا على تجهيز ونشر باقة من البرامج والتطبيقات المبتكرة. تابعنا قريبًا لاكتشاف التحديثات.',
  actionText,
  onAction,
}) => {
  return (
    <div className="w-full py-16 px-4 flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 rounded-3xl bg-slate-900/90 border border-sky-500/20 text-cyan-400 flex items-center justify-center mb-5 shadow-xl relative">
        <PackageOpen className="w-10 h-10 stroke-[1.5]" />
        <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
          <Sparkles className="w-3.5 h-3.5" />
        </span>
      </div>

      <h3 className="text-lg sm:text-xl font-black text-white mb-2 max-w-md">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed mb-6">
        {message}
      </p>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-cyan-300 text-xs font-bold transition cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
