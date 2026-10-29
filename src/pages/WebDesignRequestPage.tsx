import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PlatformIcon } from '../components/common/PlatformIcon';
import { Sparkles, Send, CheckCircle2, MessageSquare, Smartphone, Globe, Layers, AlertCircle } from 'lucide-react';

export const WebDesignRequestPage: React.FC = () => {
  const { settings, submitServiceRequest } = useApp();

  const [clientName, setClientName] = useState('');
  const [contactMethod, setContactMethod] = useState<'whatsapp' | 'phone' | 'email' | 'telegram'>('whatsapp');
  const [contactValue, setContactValue] = useState('');
  const [projectType, setProjectType] = useState<'website' | 'web_app' | 'android_app' | 'redesign' | 'other'>('website');
  const [projectDetails, setProjectDetails] = useState('');
  const [budget, setBudget] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const hasWhatsapp = settings.whatsappNumber && settings.whatsappNumber.trim().length > 0;
  const cleanNumber = hasWhatsapp ? settings.whatsappNumber.replace(/[^0-9]/g, '') : '';
  const prefilled = encodeURIComponent(
    settings.whatsappMessage || 'مرحبًا طه القطيبي، أود الاستفسار حول تصميم وتطوير مشروع تقني.'
  );
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${prefilled}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!clientName.trim()) {
      setErrorMessage('يرجى كتابة اسمك أو اسم المؤسسة');
      return;
    }
    if (!contactValue.trim()) {
      setErrorMessage('يرجى إدخال وسيلة التواصل (رقم الهاتف، واتساب أو البريد الإلكتروني)');
      return;
    }
    if (!projectDetails.trim()) {
      setErrorMessage('يرجى تزويدنا بتفاصيل وشرح ما تريده في موقعك أو تطبيقك');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitServiceRequest({
        clientName: clientName.trim(),
        contactMethod,
        contactValue: contactValue.trim(),
        projectType,
        projectDetails: projectDetails.trim(),
        budget: budget.trim(),
      });
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'حدث خطأ أثناء إرسال طلبكم. يرجى المحاولة لاحقًا.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>خدمات طه القطيبي البرمجية</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white">
          طلب تصميم وتطوير موقع أو تطبيق خاص
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          شاركنا فكرة مشروعك وسنقوم بدراستها وتقديم أفضل خطة لتنفيذها بجودة فائقة وأمان عالٍ.
        </p>
      </div>

      {isSuccess ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/90 border border-teal-500/30 text-center space-y-4 shadow-2xl animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/20 border border-teal-400/40 text-teal-300 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">تم استلام طلبكم بنجاح!</h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            شكرًا لتواصلك معنا يا {clientName}. سنراجع تفاصيل المشروع ونتواصل معك عبر ({contactValue}) في أقرب وقت.
          </p>

          {hasWhatsapp && (
            <div className="pt-4">
              <p className="text-xs text-slate-400 mb-2">أو يمكنك التحدث معنا مباشرة الآن:</p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg transition"
              >
                <PlatformIcon platform="whatsapp" size={18} />
                <span>متابعة الطلب عبر واتساب</span>
              </a>
            </div>
          )}

          <div className="pt-4">
            <button
              onClick={() => {
                setIsSuccess(false);
                setClientName('');
                setContactValue('');
                setProjectDetails('');
                setBudget('');
              }}
              className="text-xs text-cyan-400 hover:underline cursor-pointer"
            >
              إرسال طلب آخر
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/80 border border-sky-500/25 shadow-2xl space-y-8">
          {errorMessage && (
            <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 text-cyan-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                الاسم الكريم أو اسم الشركة / المؤسسة <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="مثال: محمد السعدي"
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition"
              />
            </div>

            {/* Project Type */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                نوع المشروع المطلوب <span className="text-cyan-400">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'website', label: 'موقع إلكتروني (تعريفي/شخصي)' },
                  { id: 'web_app', label: 'منصة ويب متكاملة (SaaS)' },
                  { id: 'android_app', label: 'تطبيق أندرويد (Android)' },
                  { id: 'redesign', label: 'تطوير وتحديث موقع قائم' },
                  { id: 'other', label: 'أخرى / فكرة خاصة' },
                ].map((type) => (
                  <button
                    type="button"
                    key={type.id}
                    onClick={() => setProjectType(type.id as any)}
                    className={`p-3 rounded-xl text-xs font-semibold text-right transition cursor-pointer border ${
                      projectType === type.id
                        ? 'bg-cyan-600/25 border-cyan-400 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Method & Value */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-4">
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  وسيلة التواصل المفضلة
                </label>
                <select
                  value={contactMethod}
                  onChange={(e) => setContactMethod(e.target.value as any)}
                  className="w-full px-3 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400 transition cursor-pointer"
                >
                  <option value="whatsapp">واتساب (WhatsApp)</option>
                  <option value="phone">اتصال هاتفي</option>
                  <option value="telegram">تيليجرام (Telegram)</option>
                  <option value="email">البريد الإلكتروني</option>
                </select>
              </div>

              <div className="sm:col-span-8">
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  رقم الهاتف أو المعرّف / البريد <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  value={contactValue}
                  onChange={(e) => setContactValue(e.target.value)}
                  placeholder="مثال: +967 77xxxxxxx أو yourname@email.com"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
            </div>

            {/* Project Details */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                تفاصيل ووصف المطلوب <span className="text-cyan-400">*</span>
              </label>
              <textarea
                value={projectDetails}
                onChange={(e) => setProjectDetails(e.target.value)}
                rows={4}
                placeholder="اشرح لنا أهداف المشروع، الأقسام والميزات المطلوبة، أو روابط لأمثلة تعجبك..."
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition resize-none"
              />
            </div>

            {/* Budget (Optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                الميزانية المقترحة (اختياري)
              </label>
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="مثال: 500$ - 1500$ أو قابلة للتفاوض"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs sm:text-sm transition cursor-pointer shadow-lg disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'جاري الإرسال...' : 'إرسال طلب المشروع'}</span>
              </button>

              {/* Direct WhatsApp button (only if configured) */}
              {hasWhatsapp && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-950 border border-teal-500/40 hover:border-teal-400 text-teal-300 text-xs sm:text-sm font-semibold transition"
                >
                  <PlatformIcon platform="whatsapp" size={18} />
                  <span>أو تواصل فورًا عبر واتساب</span>
                </a>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
