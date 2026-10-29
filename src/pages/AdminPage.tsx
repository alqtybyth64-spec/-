import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { PlatformIcon } from '../components/common/PlatformIcon';
import {
  Shield,
  KeyRound,
  Settings,
  Layers,
  Image as ImageIcon,
  Share2,
  Inbox,
  LayoutGrid,
  Plus,
  Trash2,
  Edit,
  Save,
  Upload,
  CheckCircle,
  Eye,
  EyeOff,
  Star,
  ExternalLink,
  MessageCircle,
  AlertCircle,
  LogOut,
  ArrowUpDown,
  Smartphone,
  HardDrive,
  FileCode,
  Loader2,
  X,
} from 'lucide-react';
import { AppItem, Advertisement, SocialLink, SocialPlatform, ServiceRequest } from '../types';

export const AdminPage: React.FC = () => {
  const {
    isAdmin,
    loginAdmin,
    logoutAdmin,
    settings,
    updateSettings,
    apps,
    saveApp,
    deleteApp,
    ads,
    saveAd,
    deleteAd,
    socialLinks,
    saveSocialLink,
    deleteSocialLink,
    serviceRequests,
    updateRequestStatus,
    deleteRequest,
    refreshState,
  } = useApp();

  // Login form state
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'settings' | 'sections' | 'apps' | 'ads' | 'social' | 'requests'>('settings');

  // Operation status feedback
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');

  // Local state for site settings
  const [settingsForm, setSettingsForm] = useState(settings);

  // Modals / Editors State
  const [editingApp, setEditingApp] = useState<Partial<AppItem> | null>(null);
  const [editingAd, setEditingAd] = useState<Partial<Advertisement> | null>(null);
  const [editingLink, setEditingLink] = useState<Partial<SocialLink> | null>(null);

  // Form saving states
  const [isSavingApp, setIsSavingApp] = useState(false);
  const [appFormErrors, setAppFormErrors] = useState<{ name?: string; shortDescription?: string; general?: string }>({});

  const [isSavingAd, setIsSavingAd] = useState(false);
  const [adFormErrors, setAdFormErrors] = useState<{ title?: string; imageUrl?: string; general?: string }>({});

  const [isSavingLink, setIsSavingLink] = useState(false);
  const [linkFormErrors, setLinkFormErrors] = useState<{ url?: string; general?: string }>({});

  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'app' | 'ad' | 'link' | 'request'; id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Upload status indicator
  const [uploadProgress, setUploadProgress] = useState<{ active: boolean; label: string }>({ active: false, label: '' });

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      await loginAdmin(passwordInput);
      setSettingsForm(settings);
    } catch (err: any) {
      setLoginError(err.message || 'كلمة المرور غير صحيحة');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const showNotification = (msg: string) => {
    setSaveSuccess(msg);
    setTimeout(() => setSaveSuccess(''), 4000);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    setIsDeleting(true);
    try {
      if (deleteConfirm.type === 'app') {
        await deleteApp(deleteConfirm.id);
        showNotification('تم حذف التطبيق بنجاح');
      } else if (deleteConfirm.type === 'ad') {
        await deleteAd(deleteConfirm.id);
        showNotification('تم حذف الإعلان بنجاح');
      } else if (deleteConfirm.type === 'link') {
        await deleteSocialLink(deleteConfirm.id);
        showNotification('تم حذف رابط المنصة بنجاح');
      } else if (deleteConfirm.type === 'request') {
        await deleteRequest(deleteConfirm.id);
        showNotification('تم حذف الطلب بنجاح');
      }
      setDeleteConfirm(null);
    } catch (err: any) {
      setSaveError(err.message || 'حدث خطأ أثناء محاولة الحذف');
      setTimeout(() => setSaveError(''), 4000);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSaveError('');
    try {
      await updateSettings(settingsForm);
      showNotification('تم حفظ الإعدادات بنجاح وتحديث كافة أقسام الموقع');
    } catch (err: any) {
      setSaveError(err.message || 'فشل حفظ الإعدادات');
      setTimeout(() => setSaveError(''), 5000);
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleSaveApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp) return;

    const errors: { name?: string; shortDescription?: string; general?: string } = {};
    if (!editingApp.name?.trim()) {
      errors.name = 'اسم التطبيق مطلوب';
    }
    if (!editingApp.shortDescription?.trim()) {
      errors.shortDescription = 'الوصف المختصر للتطبيق مطلوب';
    }

    if (Object.keys(errors).length > 0) {
      setAppFormErrors(errors);
      return;
    }

    setAppFormErrors({});
    setIsSavingApp(true);
    try {
      await saveApp(editingApp);
      setEditingApp(null);
      showNotification('تم حفظ التطبيق بنجاح وتحديث القائمة');
    } catch (err: any) {
      console.error('Save app error:', err);
      setAppFormErrors({ general: err.message || 'حدث خطأ أثناء حفظ التطبيق، يرجى المحاولة مجددًا' });
    } finally {
      setIsSavingApp(false);
    }
  };

  const handleSaveAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAd) return;

    const errors: { title?: string; imageUrl?: string; general?: string } = {};
    if (!editingAd.title?.trim()) {
      errors.title = 'عنوان الإعلان مطلوب';
    }
    if (!editingAd.imageUrl?.trim()) {
      errors.imageUrl = 'صورة الإعلان مطلوبة (أدخل رابطاً أو ارفع صورة)';
    }

    if (Object.keys(errors).length > 0) {
      setAdFormErrors(errors);
      return;
    }

    setAdFormErrors({});
    setIsSavingAd(true);
    try {
      await saveAd(editingAd);
      setEditingAd(null);
      showNotification('تم حفظ الإعلان بنجاح وتحديث الشريط الإعلاني');
    } catch (err: any) {
      console.error('Save ad error:', err);
      setAdFormErrors({ general: err.message || 'حدث خطأ أثناء حفظ الإعلان' });
    } finally {
      setIsSavingAd(false);
    }
  };

  const handleSaveSocialLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink) return;

    const errors: { url?: string; general?: string } = {};
    if (!editingLink.url?.trim()) {
      errors.url = 'رابط الحساب أو القناة مطلوب';
    }

    if (Object.keys(errors).length > 0) {
      setLinkFormErrors(errors);
      return;
    }

    setLinkFormErrors({});
    setIsSavingLink(true);
    try {
      await saveSocialLink(editingLink);
      setEditingLink(null);
      showNotification('تم حفظ رابط المنصة بنجاح');
    } catch (err: any) {
      console.error('Save link error:', err);
      setLinkFormErrors({ general: err.message || 'حدث خطأ أثناء حفظ رابط المنصة' });
    } finally {
      setIsSavingLink(false);
    }
  };

  // Helper file upload for Logo, Icons, APK, Screenshots, Background
  const handleFileUpload = async (file: File, target: 'logo' | 'icon' | 'appIcon' | 'apk' | 'adImage' | 'screenshot' | 'background') => {
    setUploadProgress({ active: true, label: `جاري رفع ${file.name}...` });
    try {
      const res = await api.uploadFile(file);
      if (target === 'logo') {
        setSettingsForm((prev) => ({ ...prev, logoUrl: res.url }));
      } else if (target === 'icon') {
        setSettingsForm((prev) => ({ ...prev, iconUrl: res.url }));
      } else if (target === 'background') {
        setSettingsForm((prev) => ({ ...prev, backgroundUrl: res.url }));
      } else if (target === 'appIcon' && editingApp) {
        setEditingApp((prev) => ({ ...prev!, iconUrl: res.url }));
      } else if (target === 'apk' && editingApp) {
        setEditingApp((prev) => ({
          ...prev!,
          downloadUrl: res.url,
          fileSize: res.sizeFormatted,
          isExternalDownload: false,
        }));
      } else if (target === 'adImage' && editingAd) {
        setEditingAd((prev) => ({ ...prev!, imageUrl: res.url }));
      } else if (target === 'screenshot' && editingApp) {
        setEditingApp((prev) => ({
          ...prev!,
          screenshots: [...(prev?.screenshots || []), res.url],
        }));
      }
      showNotification(`تم رفع الملف بنجاح (${res.sizeFormatted})`);
    } catch (err: any) {
      setSaveError(err.message || 'فشل رفع الملف');
      setTimeout(() => setSaveError(''), 4000);
    } finally {
      setUploadProgress({ active: false, label: '' });
    }
  };

  // ==========================================
  // VIEW: Password-Only Login Form
  // ==========================================
  if (!isAdmin) {
    return (
      <div className="w-full min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900/90 border border-sky-500/25 shadow-2xl relative">
          <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto mb-6 shadow-inner">
            <KeyRound className="w-8 h-8" />
          </div>

          <div className="text-center space-y-2 mb-6">
            <h1 className="text-xl sm:text-2xl font-black text-white">دخول لوحة إدارة الموقع</h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              يرجى إدخال كلمة مرور المسؤول للوصول إلى لوحة التحكم الكاملة بموقع TAHA.
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3.5 rounded-xl bg-slate-950 border border-slate-700 text-cyan-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                كلمة مرور المدير <span className="text-cyan-400">*</span>
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="أدخل كلمة المرور..."
                required
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-950/60 transition cursor-pointer disabled:opacity-50"
            >
              {isLoggingIn ? 'جاري التحقق...' : 'دخول لوحة الإدارة'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <span className="text-[11px] text-slate-500">
              جلسة إدارية مشفرة ومحمية من جهة الخادم
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: Authenticated Admin Dashboard
  // ==========================================
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-sky-500/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0 border border-cyan-500/30">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              لوحة إدارة موقع {settings.siteName || 'TAHA'}
            </h1>
            <p className="text-xs text-slate-400">
              تحكم كامل في كافة عناصر وتطبيقات وإعلانات وإعدادات المنصة دون لمس الأكواد.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => refreshState()}
            className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition cursor-pointer"
          >
            تحديث البيانات
          </button>
          <button
            onClick={logoutAdmin}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 hover:border-slate-600 text-slate-400 hover:text-white text-xs font-semibold transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-teal-950/80 border border-teal-500/40 text-teal-200 text-xs flex items-center gap-2 shadow animate-fade-in">
          <CheckCircle className="w-4 h-4 text-teal-400 shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}
      {saveError && (
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 text-xs flex items-center gap-2 shadow animate-fade-in">
          <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}
      {uploadProgress.active && (
        <div className="p-3 rounded-xl bg-sky-950/80 border border-cyan-500/40 text-cyan-300 text-xs flex items-center gap-2 animate-pulse">
          <Upload className="w-4 h-4 text-cyan-400 animate-spin" />
          <span>{uploadProgress.label}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        {[
          { id: 'settings', label: 'الإعدادات العامة والهوية', icon: <Settings className="w-4 h-4" /> },
          { id: 'sections', label: 'ترتيب وإظهار الأقسام', icon: <LayoutGrid className="w-4 h-4" /> },
          { id: 'apps', label: `التطبيقات والبرامج (${apps.length})`, icon: <Layers className="w-4 h-4" /> },
          { id: 'ads', label: `الإعلانات والشرائح (${ads.length})`, icon: <ImageIcon className="w-4 h-4" /> },
          { id: 'social', label: `حسابات التواصل (${socialLinks.length})`, icon: <Share2 className="w-4 h-4" /> },
          { id: 'requests', label: `طلبات العملاء (${serviceRequests.length})`, icon: <Inbox className="w-4 h-4" /> },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer border ${
                isActive
                  ? 'bg-cyan-600 text-white border-cyan-500 shadow-md'
                  : 'bg-slate-900/70 text-slate-400 hover:text-white border-slate-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* TAB 1: Site General Settings & Identity                  */}
      {/* ======================================================== */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-base sm:text-lg font-black text-white">إعدادات الهوية والبيانات المركزية</h2>
            <p className="text-xs text-slate-400">
              تغيير اسم الموقع والشعار والألوان هنا يُحدث كافة الصفحات والرأس والتذييل تلقائيًا.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Site Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">اسم الموقع الافتراضي</label>
              <input
                type="text"
                value={settingsForm.siteName}
                onChange={(e) => setSettingsForm({ ...settingsForm, siteName: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-cyan-400 focus:outline-none"
              />
            </div>

            {/* Site Description */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">الوصف التعريفي العام</label>
              <input
                type="text"
                value={settingsForm.siteDescription}
                onChange={(e) => setSettingsForm({ ...settingsForm, siteDescription: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-cyan-400 focus:outline-none"
              />
            </div>

            {/* Logo Upload / URL */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">شعار الموقع (Logo)</label>
              <div className="flex items-center gap-3">
                {settingsForm.logoUrl ? (
                  <img src={settingsForm.logoUrl} alt="Logo" className="w-10 h-10 object-contain rounded-xl border border-slate-700 bg-slate-950" />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-xs text-slate-500">
                    لا شعار
                  </div>
                )}
                <input
                  type="text"
                  value={settingsForm.logoUrl}
                  onChange={(e) => setSettingsForm({ ...settingsForm, logoUrl: e.target.value })}
                  placeholder="رابط الشعار أو ارفعه..."
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
                />
                <label className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold cursor-pointer border border-slate-700 flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5" />
                  <span>رفع</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileUpload(e.target.files[0], 'logo');
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Favicon / App Icon Upload & URL */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">أيقونة الموقع (Favicon / Icon)</label>
              <div className="flex items-center gap-3">
                {settingsForm.iconUrl ? (
                  <img src={settingsForm.iconUrl} alt="Icon" className="w-10 h-10 object-contain rounded-xl border border-slate-700 bg-slate-950 p-1" />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-xs text-slate-500">
                    لا أيقونة
                  </div>
                )}
                <input
                  type="text"
                  value={settingsForm.iconUrl}
                  onChange={(e) => setSettingsForm({ ...settingsForm, iconUrl: e.target.value })}
                  placeholder="/icon.svg أو رابط صورة..."
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
                />
                <label className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold cursor-pointer border border-slate-700 flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5" />
                  <span>رفع</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileUpload(e.target.files[0], 'icon');
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Background Image Upload / URL & Remove */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-2">صورة خلفية الصفحة الرئيسية (اختيارية)</label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                {settingsForm.backgroundUrl ? (
                  <div className="w-20 h-12 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 shrink-0 relative">
                    <img src={settingsForm.backgroundUrl} alt="Background" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-20 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-[10px] text-slate-500 shrink-0">
                    الافتراضية
                  </div>
                )}
                <input
                  type="text"
                  value={settingsForm.backgroundUrl || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, backgroundUrl: e.target.value })}
                  placeholder="رابط صورة الخلفية أو اضغط رفع..."
                  className="flex-1 w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
                />
                <div className="flex items-center gap-2">
                  <label className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold cursor-pointer border border-slate-700 flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>رفع خلفية</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) handleFileUpload(e.target.files[0], 'background');
                      }}
                    />
                  </label>
                  {settingsForm.backgroundUrl && (
                    <button
                      type="button"
                      onClick={() => setSettingsForm({ ...settingsForm, backgroundUrl: '' })}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 cursor-pointer"
                      title="إزالة الخلفية والعودة للافتراضي"
                    >
                      إزالة الخلفية
                    </button>
                  )}
                </div>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                تظهر الصورة بشكل هادئ ومتناسق في خلفية الموقع خلف العناصر، أو يمكنك إزالتها في أي وقت.
              </span>
            </div>

            {/* WhatsApp Number (Configurable & Clearable) */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                رقم واتساب المعتمد (اتركه فارغًا لإخفاء أزرار واتساب تلقائيًا)
              </label>
              <input
                type="text"
                value={settingsForm.whatsappNumber}
                onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                placeholder="مثال: +96777xxxxxxx"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-cyan-400 focus:outline-none font-mono"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                ملاحظة: إذا كان هذا الحقل فارغًا فلن يظهر أي زر أو أيقونة لواتساب في الموقع العام.
              </span>
            </div>

            {/* WhatsApp Pre-filled message */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">نص الرسالة الافتراضية في واتساب</label>
              <input
                type="text"
                value={settingsForm.whatsappMessage}
                onChange={(e) => setSettingsForm({ ...settingsForm, whatsappMessage: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-cyan-400 focus:outline-none"
              />
            </div>

            {/* Developer Bio */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-2">نبذة المطور طه القطيبي</label>
              <textarea
                value={settingsForm.developerBio}
                onChange={(e) => setSettingsForm({ ...settingsForm, developerBio: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-cyan-400 focus:outline-none resize-none"
              />
            </div>

            {/* Footer Text & Copyright */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">نص التذييل</label>
              <input
                type="text"
                value={settingsForm.footerText}
                onChange={(e) => setSettingsForm({ ...settingsForm, footerText: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">حقوق النشر في التذييل</label>
              <input
                type="text"
                value={settingsForm.copyrightText}
                onChange={(e) => setSettingsForm({ ...settingsForm, copyrightText: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-cyan-400 focus:outline-none"
              />
            </div>

            {/* Privacy Policy */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-2">نص سياسة الخصوصية</label>
              <textarea
                value={settingsForm.privacyPolicyText}
                onChange={(e) => setSettingsForm({ ...settingsForm, privacyPolicyText: e.target.value })}
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-cyan-400 focus:outline-none resize-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={isSavingSettings}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-60 text-white font-bold text-xs sm:text-sm transition cursor-pointer shadow-lg"
            >
              {isSavingSettings ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جارٍ حفظ التعديلات...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>حفظ التعديلات</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* ======================================================== */}
      {/* TAB 2: Section Visibility & Ordering                     */}
      {/* ======================================================== */}
      {activeTab === 'sections' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-base sm:text-lg font-black text-white">إظهار وترتيب أقسام الصفحة الرئيسية</h2>
            <p className="text-xs text-slate-400">
              قم بتمكين أو تعطيل أي قسم، أو إعادة ترتيب ظهوره بحسب رغبتك.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'ads', label: 'شريط الإعلانات المتحرك (يُخفى تلقائيًا إذا لم توجد إعلانات)' },
              { key: 'hero', label: 'القسم الترحيبي والبحث السريع' },
              { key: 'categories', label: 'تصنيفات التطبيقات والبرامج' },
              { key: 'featured', label: 'قسم التطبيقات المميزة' },
              { key: 'latest', label: 'قسم أحدث التطبيقات المضافة' },
              { key: 'webDesignRequest', label: 'قسم طلب تصميم موقع أو تطبيق خاص' },
              { key: 'developer', label: 'قسم نبذة عن المطور طه القطيبي' },
            ].map((sec) => {
              const isVisible = (settingsForm.sectionVisibility as any)[sec.key] !== false;
              return (
                <div
                  key={sec.key}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800"
                >
                  <span className="text-xs sm:text-sm font-semibold text-slate-200">{sec.label}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const updatedVis = {
                        ...settingsForm.sectionVisibility,
                        [sec.key]: !isVisible,
                      };
                      setSettingsForm({ ...settingsForm, sectionVisibility: updatedVis });
                      updateSettings({ sectionVisibility: updatedVis });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      isVisible
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{isVisible ? 'ظاهر' : 'مخفي'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: Apps Management                                   */}
      {/* ======================================================== */}
      {activeTab === 'apps' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-white">إدارة التطبيقات والبرامج</h2>
              <p className="text-xs text-slate-400">إضافة وتعديل وحذف التطبيقات وملفات APK والتفاصيل.</p>
            </div>
            <button
              onClick={() =>
                setEditingApp({
                  name: '',
                  shortDescription: '',
                  fullDescription: '',
                  version: '1.0.0',
                  fileSize: '',
                  operatingSystem: 'أندرويد (Android)',
                  category: settings.categories?.[0] || 'عام',
                  screenshots: [],
                  downloadUrl: '',
                  isExternalDownload: false,
                  isFeatured: false,
                  isPublished: true,
                  downloadCount: 0,
                })
              }
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition cursor-pointer shadow"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة تطبيق جديد</span>
            </button>
          </div>

          {/* Apps Table/List */}
          {apps.length === 0 ? (
            <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
              <Layers className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="text-sm font-bold text-slate-300">لا توجد تطبيقات مضافة حالياً</h3>
              <p className="text-xs text-slate-500">
                الموقع فارغ تمامًا كما طلبت. اضغط زر «إضافة تطبيق جديد» للبدء بنشر أول تطبيق لك.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {apps.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-center p-1 shrink-0">
                        {item.iconUrl ? (
                          <img src={item.iconUrl} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <span className="font-bold text-cyan-400">{item.name.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white line-clamp-1">{item.name}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                          <span>{item.category}</span>
                          <span>•</span>
                          <span>v{item.version}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.isPublished
                          ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.isPublished ? 'منشور' : 'مسودة'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2">{item.shortDescription}</p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                    <span>{item.downloadCount || 0} تنزيل</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingApp(item)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 transition cursor-pointer"
                        title="تعديل"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ type: 'app', id: item.id, title: item.name })}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                        title="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal / Edit App Drawer */}
          {editingApp && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
              <div className="w-full max-w-2xl bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 space-y-4 my-8 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-cyan-400" />
                    <span>{editingApp.id ? 'تعديل التطبيق' : 'إضافة تطبيق جديد'}</span>
                  </h3>
                  <button
                    type="button"
                    disabled={isSavingApp}
                    onClick={() => {
                      setEditingApp(null);
                      setAppFormErrors({});
                    }}
                    className="text-xs text-slate-400 hover:text-white disabled:opacity-50 cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>

                {/* General Error Banner */}
                {appFormErrors.general && (
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/40 text-cyan-200 text-xs flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="flex-1 leading-relaxed">{appFormErrors.general}</span>
                  </div>
                )}

                <form onSubmit={handleSaveApp} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {/* Name */}
                    <div className="sm:col-span-2">
                      <label className="block text-slate-300 font-bold mb-1">اسم التطبيق *</label>
                      <input
                        type="text"
                        value={editingApp.name || ''}
                        onChange={(e) => {
                          setEditingApp({ ...editingApp, name: e.target.value });
                          if (appFormErrors.name) setAppFormErrors((prev) => ({ ...prev, name: undefined }));
                        }}
                        placeholder="أدخل اسم التطبيق أو البرنامج..."
                        className={`w-full px-3 py-2 rounded-xl bg-slate-950 border text-white transition ${
                          appFormErrors.name ? 'border-cyan-400 ring-1 ring-cyan-400' : 'border-slate-700'
                        }`}
                      />
                      {appFormErrors.name && (
                        <p className="text-[11px] text-cyan-300 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{appFormErrors.name}</span>
                        </p>
                      )}
                    </div>

                    {/* Icon Upload & URL */}
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">أيقونة التطبيق</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editingApp.iconUrl || ''}
                          onChange={(e) => setEditingApp({ ...editingApp, iconUrl: e.target.value })}
                          placeholder="رابط الأيقونة أو ارفعها..."
                          className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                        />
                        <label className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 cursor-pointer flex items-center gap-1 font-semibold">
                          <Upload className="w-3.5 h-3.5" />
                          <span>رفع</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files?.[0]) handleFileUpload(e.target.files[0], 'appIcon');
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">التصنيف</label>
                      <select
                        value={editingApp.category || 'عام'}
                        onChange={(e) => setEditingApp({ ...editingApp, category: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white cursor-pointer"
                      >
                        {(settings.categories || ['عام']).map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Version & File Size */}
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">رقم الإصدار</label>
                      <input
                        type="text"
                        value={editingApp.version || '1.0.0'}
                        onChange={(e) => setEditingApp({ ...editingApp, version: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">حجم الملف</label>
                      <input
                        type="text"
                        value={editingApp.fileSize || ''}
                        onChange={(e) => setEditingApp({ ...editingApp, fileSize: e.target.value })}
                        placeholder="مثال: 18.5 ميجابايت"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                      />
                    </div>

                    {/* OS */}
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">نظام التشغيل</label>
                      <input
                        type="text"
                        value={editingApp.operatingSystem || 'أندرويد (Android)'}
                        onChange={(e) => setEditingApp({ ...editingApp, operatingSystem: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                      />
                    </div>

                    {/* APK / Download URL */}
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">ملف APK أو رابط التنزيل</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editingApp.downloadUrl || ''}
                          onChange={(e) => setEditingApp({ ...editingApp, downloadUrl: e.target.value })}
                          placeholder="رابط التحميل أو ارفع ملف APK..."
                          className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                        />
                        <label className="px-3 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white cursor-pointer flex items-center gap-1 font-bold">
                          <Upload className="w-3.5 h-3.5" />
                          <span>رفع APK</span>
                          <input
                            type="file"
                            accept=".apk,application/vnd.android.package-archive"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files?.[0]) handleFileUpload(e.target.files[0], 'apk');
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Short Description */}
                    <div className="sm:col-span-2">
                      <label className="block text-slate-300 font-bold mb-1">وصف مختصر *</label>
                      <input
                        type="text"
                        value={editingApp.shortDescription || ''}
                        onChange={(e) => {
                          setEditingApp({ ...editingApp, shortDescription: e.target.value });
                          if (appFormErrors.shortDescription) setAppFormErrors((prev) => ({ ...prev, shortDescription: undefined }));
                        }}
                        placeholder="نبذة سريعة عن التطبيق في سطر أو سطرين..."
                        className={`w-full px-3 py-2 rounded-xl bg-slate-950 border text-white transition ${
                          appFormErrors.shortDescription ? 'border-cyan-400 ring-1 ring-cyan-400' : 'border-slate-700'
                        }`}
                      />
                      {appFormErrors.shortDescription && (
                        <p className="text-[11px] text-cyan-300 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{appFormErrors.shortDescription}</span>
                        </p>
                      )}
                    </div>

                    {/* Full Description */}
                    <div className="sm:col-span-2">
                      <label className="block text-slate-300 font-bold mb-1">الوصف التفصيلي والميزات</label>
                      <textarea
                        value={editingApp.fullDescription || ''}
                        onChange={(e) => setEditingApp({ ...editingApp, fullDescription: e.target.value })}
                        rows={3}
                        placeholder="شرح كامل لمميزات وخصائص التطبيق وطريقة استخدامه..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white resize-none"
                      />
                    </div>

                    {/* Screenshots Gallery Management */}
                    <div className="sm:col-span-2 space-y-2 pt-1 border-t border-slate-800/80">
                      <div className="flex items-center justify-between">
                        <label className="block text-slate-300 font-bold">
                          لقطات شاشة توضيحية للتطبيق ({editingApp.screenshots?.length || 0})
                        </label>
                        <label className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold cursor-pointer border border-slate-700 flex items-center gap-1.5 transition">
                          <Upload className="w-3.5 h-3.5" />
                          <span>رفع لقطة شاشة</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files?.[0]) handleFileUpload(e.target.files[0], 'screenshot');
                            }}
                          />
                        </label>
                      </div>

                      {editingApp.screenshots && editingApp.screenshots.length > 0 ? (
                        <div className="flex flex-wrap gap-2.5 pt-1">
                          {editingApp.screenshots.map((shot, sIdx) => (
                            <div
                              key={sIdx}
                              className="relative w-20 h-28 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 group shadow"
                            >
                              <img src={shot} alt={`لقطة ${sIdx + 1}`} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedShots = (editingApp.screenshots || []).filter((_, i) => i !== sIdx);
                                  setEditingApp({ ...editingApp, screenshots: updatedShots });
                                }}
                                className="absolute top-1 right-1 p-1 rounded-md bg-slate-900/90 text-cyan-300 hover:text-white border border-slate-700 opacity-90 hover:opacity-100 transition cursor-pointer"
                                title="حذف هذه اللقطة"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-500">
                          لم يتم رفع لقطات شاشة بعد. يمكنك رفع صور توضيحية لواجهة التطبيق لتظهر في صفحة التفاصيل.
                        </p>
                      )}
                    </div>

                    {/* Flags */}
                    <div className="sm:col-span-2 flex items-center gap-6 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-semibold">
                        <input
                          type="checkbox"
                          checked={editingApp.isPublished !== false}
                          onChange={(e) => setEditingApp({ ...editingApp, isPublished: e.target.checked })}
                          className="rounded"
                        />
                        <span>نشر التطبيق وجعله متاحًا للزوار</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-semibold">
                        <input
                          type="checkbox"
                          checked={editingApp.isFeatured === true}
                          onChange={(e) => setEditingApp({ ...editingApp, isFeatured: e.target.checked })}
                          className="rounded"
                        />
                        <span>تطبيق مميز في الصفحة الرئيسية</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      disabled={isSavingApp}
                      onClick={() => {
                        setEditingApp(null);
                        setAppFormErrors({});
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition disabled:opacity-50 cursor-pointer"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingApp}
                      className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-60 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-lg"
                    >
                      {isSavingApp ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>جارٍ حفظ التطبيق...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>حفظ التطبيق</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: Advertisements Slider Management                 */}
      {/* ======================================================== */}
      {activeTab === 'ads' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-white">إدارة شريط الإعلانات واللافتات</h2>
              <p className="text-xs text-slate-400">
                إضافة إعلانات صورية متحركة مع تحديد مدة ظهور كل إعلان ورابط النقر وحالة النشر.
              </p>
            </div>
            <button
              onClick={() =>
                setEditingAd({
                  title: '',
                  imageUrl: '',
                  text: '',
                  targetUrl: '',
                  durationSeconds: 5,
                  order: ads.length + 1,
                  isPublished: true,
                })
              }
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition cursor-pointer shadow"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة إعلان جديد</span>
            </button>
          </div>

          {ads.length === 0 ? (
            <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
              <ImageIcon className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="text-sm font-bold text-slate-300">لا توجد إعلانات منشورة</h3>
              <p className="text-xs text-slate-500">
                شريط الإعلانات مخفي تلقائيًا في الصفحة الرئيسية حاليًا كما طلبت حتى تقوم بإضافة أول إعلان.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ads.map((ad) => (
                <div
                  key={ad.id}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-3"
                >
                  <div className="h-36 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 relative">
                    <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" />
                    <span
                      className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold ${
                        ad.isPublished ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {ad.isPublished ? 'نشط' : 'معطل'}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white line-clamp-1">{ad.title}</h4>
                    {ad.text && <p className="text-xs text-slate-400 mt-1 line-clamp-1">{ad.text}</p>}
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2">
                      <span>المدة: {ad.durationSeconds || 5} ثوانٍ</span>
                      <span>•</span>
                      <span>الترتيب: {ad.order || 1}</span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => setEditingAd(ad)}
                      className="p-1.5 rounded-lg bg-slate-800 text-cyan-300 hover:bg-slate-700 cursor-pointer"
                      title="تعديل"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ type: 'ad', id: ad.id, title: ad.title })}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
                      title="حذف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Ad Editor Modal */}
          {editingAd && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="w-full max-w-lg bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-cyan-400" />
                    <span>{editingAd.id ? 'تعديل الإعلان' : 'إضافة إعلان جديد'}</span>
                  </h3>
                  <button
                    type="button"
                    disabled={isSavingAd}
                    onClick={() => {
                      setEditingAd(null);
                      setAdFormErrors({});
                    }}
                    className="text-xs text-slate-400 hover:text-white disabled:opacity-50 cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>

                {adFormErrors.general && (
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/40 text-cyan-200 text-xs flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="flex-1 leading-relaxed">{adFormErrors.general}</span>
                  </div>
                )}

                <form onSubmit={handleSaveAd} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">عنوان الإعلان *</label>
                    <input
                      type="text"
                      value={editingAd.title || ''}
                      onChange={(e) => {
                        setEditingAd({ ...editingAd, title: e.target.value });
                        if (adFormErrors.title) setAdFormErrors((prev) => ({ ...prev, title: undefined }));
                      }}
                      placeholder="عنوان تعريفي للإعلان..."
                      className={`w-full px-3 py-2 rounded-xl bg-slate-950 border text-white transition ${
                        adFormErrors.title ? 'border-cyan-400 ring-1 ring-cyan-400' : 'border-slate-700'
                      }`}
                    />
                    {adFormErrors.title && (
                      <p className="text-[11px] text-cyan-300 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{adFormErrors.title}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">صورة الإعلان *</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editingAd.imageUrl || ''}
                        onChange={(e) => {
                          setEditingAd({ ...editingAd, imageUrl: e.target.value });
                          if (adFormErrors.imageUrl) setAdFormErrors((prev) => ({ ...prev, imageUrl: undefined }));
                        }}
                        placeholder="رابط الصورة أو اضغط زر الرفع..."
                        className={`flex-1 px-3 py-2 rounded-xl bg-slate-950 border text-white transition ${
                          adFormErrors.imageUrl ? 'border-cyan-400 ring-1 ring-cyan-400' : 'border-slate-700'
                        }`}
                      />
                      <label className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 cursor-pointer flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) handleFileUpload(e.target.files[0], 'adImage');
                          }}
                        />
                      </label>
                    </div>
                    {adFormErrors.imageUrl && (
                      <p className="text-[11px] text-cyan-300 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{adFormErrors.imageUrl}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">نص فرعي اختياري</label>
                    <input
                      type="text"
                      value={editingAd.text || ''}
                      onChange={(e) => setEditingAd({ ...editingAd, text: e.target.value })}
                      placeholder="نص ترويجي قصير يظهر أسفل العنوان..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">رابط النقر (موقع خارجي أو رابط تطبيق)</label>
                    <input
                      type="text"
                      value={editingAd.targetUrl || ''}
                      onChange={(e) => setEditingAd({ ...editingAd, targetUrl: e.target.value })}
                      placeholder="https://... أو app:id_تطبيق"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">مدة الظهور (ثوانٍ)</label>
                      <input
                        type="number"
                        min="2"
                        max="30"
                        value={editingAd.durationSeconds || 5}
                        onChange={(e) => setEditingAd({ ...editingAd, durationSeconds: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">الترتيب</label>
                      <input
                        type="number"
                        value={editingAd.order || 1}
                        onChange={(e) => setEditingAd({ ...editingAd, order: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-semibold">
                      <input
                        type="checkbox"
                        checked={editingAd.isPublished !== false}
                        onChange={(e) => setEditingAd({ ...editingAd, isPublished: e.target.checked })}
                      />
                      <span>تفعيل ونشر الإعلان في الصفحة الرئيسية</span>
                    </label>
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      disabled={isSavingAd}
                      onClick={() => {
                        setEditingAd(null);
                        setAdFormErrors({});
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition disabled:opacity-50 cursor-pointer"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingAd}
                      className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-60 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-lg"
                    >
                      {isSavingAd ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>جارٍ حفظ الإعلان...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>حفظ الإعلان</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: Dynamic Social Links Management                  */}
      {/* ======================================================== */}
      {activeTab === 'social' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-white">إدارة حسابات التواصل الاجتماعي</h2>
              <p className="text-xs text-slate-400">
                إضافة روابط منصاتك بأيقوناتها الرسمية الأصلية (تختفي فورًا عند التعطيل أو الحذف).
              </p>
            </div>
            <button
              onClick={() =>
                setEditingLink({
                  platform: 'youtube',
                  title: 'قناتنا على يوتيوب',
                  url: '',
                  order: socialLinks.length + 1,
                  isEnabled: true,
                })
              }
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition cursor-pointer shadow"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة حساب منصة</span>
            </button>
          </div>

          {socialLinks.length === 0 ? (
            <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
              <Share2 className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="text-sm font-bold text-slate-300">لا توجد حسابات تواصل مضافة</h3>
              <p className="text-xs text-slate-500">
                قسم حسابات التواصل مخفي تمامًا في الموقع العام حتى تقوم بإضافة وتفعيل أول منصة لك.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {socialLinks.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400">
                      <PlatformIcon platform={item.platform} size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{item.title}</h4>
                      <span className="text-[10px] text-slate-500 block truncate max-w-[150px] font-mono">
                        {item.url}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={async () => {
                        await saveSocialLink({ ...item, isEnabled: !item.isEnabled });
                        showNotification('تم تحديث حالة المنصة');
                      }}
                      className={`p-1.5 rounded-lg text-xs cursor-pointer ${
                        item.isEnabled
                          ? 'bg-teal-500/20 text-teal-300'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                      title={item.isEnabled ? 'مفعل' : 'معطل'}
                    >
                      {item.isEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => setEditingLink(item)}
                      className="p-1.5 rounded-lg bg-slate-800 text-cyan-300 hover:bg-slate-700 cursor-pointer"
                      title="تعديل"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ type: 'link', id: item.id, title: item.title })}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
                      title="حذف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Social Editor Modal */}
          {editingLink && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="w-full max-w-md bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-cyan-400" />
                    <span>{editingLink.id ? 'تعديل حساب تواصل' : 'إضافة حساب تواصل جديد'}</span>
                  </h3>
                  <button
                    type="button"
                    disabled={isSavingLink}
                    onClick={() => {
                      setEditingLink(null);
                      setLinkFormErrors({});
                    }}
                    className="text-xs text-slate-400 hover:text-white disabled:opacity-50 cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>

                {linkFormErrors.general && (
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/40 text-cyan-200 text-xs flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="flex-1 leading-relaxed">{linkFormErrors.general}</span>
                  </div>
                )}

                <form onSubmit={handleSaveSocialLink} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">المنصة</label>
                    <select
                      value={editingLink.platform || 'youtube'}
                      onChange={(e) => setEditingLink({ ...editingLink, platform: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white cursor-pointer"
                    >
                      <option value="youtube">يوتيوب (YouTube)</option>
                      <option value="tiktok">تيك توك (TikTok)</option>
                      <option value="instagram">إنستغرام (Instagram)</option>
                      <option value="facebook">فيسبوك (Facebook)</option>
                      <option value="telegram">تيليجرام (Telegram)</option>
                      <option value="whatsapp">واتساب (WhatsApp)</option>
                      <option value="x">إكس / تويتر (X)</option>
                      <option value="linkedin">لينكد إن (LinkedIn)</option>
                      <option value="github">جيت هاب (GitHub)</option>
                      <option value="other">رابط آخر</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">عنوان العرض</label>
                    <input
                      type="text"
                      value={editingLink.title || ''}
                      onChange={(e) => setEditingLink({ ...editingLink, title: e.target.value })}
                      placeholder="مثال: قناتنا الرسمية على يوتيوب"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">الرابط الكامل *</label>
                    <input
                      type="url"
                      value={editingLink.url || ''}
                      onChange={(e) => {
                        setEditingLink({ ...editingLink, url: e.target.value });
                        if (linkFormErrors.url) setLinkFormErrors((prev) => ({ ...prev, url: undefined }));
                      }}
                      placeholder="https://..."
                      className={`w-full px-3 py-2 rounded-xl bg-slate-950 border text-white transition ${
                        linkFormErrors.url ? 'border-cyan-400 ring-1 ring-cyan-400' : 'border-slate-700'
                      }`}
                    />
                    {linkFormErrors.url && (
                      <p className="text-[11px] text-cyan-300 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{linkFormErrors.url}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">الترتيب</label>
                    <input
                      type="number"
                      value={editingLink.order || 1}
                      onChange={(e) => setEditingLink({ ...editingLink, order: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-semibold">
                      <input
                        type="checkbox"
                        checked={editingLink.isEnabled !== false}
                        onChange={(e) => setEditingLink({ ...editingLink, isEnabled: e.target.checked })}
                      />
                      <span>تفعيل وإظهار الحساب في الموقع</span>
                    </label>
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      disabled={isSavingLink}
                      onClick={() => {
                        setEditingLink(null);
                        setLinkFormErrors({});
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition disabled:opacity-50 cursor-pointer"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingLink}
                      className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-60 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-lg"
                    >
                      {isSavingLink ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>جارٍ حفظ الحساب...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>حفظ الحساب</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: Service Requests from Clients                     */}
      {/* ======================================================== */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-black text-white">إدارة طلبات تصميم وتطوير المواقع والتطبيقات</h2>
            <p className="text-xs text-slate-400">
              بيانات العملاء محفوظة بسرية تامة ولا تظهر في أي صفحة عامة.
            </p>
          </div>

          {serviceRequests.length === 0 ? (
            <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
              <Inbox className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="text-sm font-bold text-slate-300">لا توجد طلبات واردة حتى الآن</h3>
              <p className="text-xs text-slate-500">
                عند قيام أي زائر بإرسال طلب من صفحة «طلب تصميم موقع»، سيظهر تفاصيله هنا مباشرة.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {serviceRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-white">{req.clientName}</h4>
                        <span className="px-2 py-0.5 rounded-full bg-slate-950 border border-slate-700 text-cyan-300 text-[10px] font-bold">
                          {req.projectType}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        تاريخ الطلب: {new Date(req.createdAt).toLocaleString('ar-EG')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={req.status || 'new'}
                        onChange={async (e) => {
                          try {
                            await updateRequestStatus(req.id, e.target.value);
                            showNotification('تم تحديث حالة الطلب');
                          } catch (err: any) {
                            setSaveError(err.message || 'فشل تحديث حالة الطلب');
                            setTimeout(() => setSaveError(''), 4000);
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-semibold text-cyan-300 focus:outline-none cursor-pointer"
                      >
                        <option value="new">جديد</option>
                        <option value="reviewing">قيد المراجعة</option>
                        <option value="contacted">تم التواصل</option>
                        <option value="completed">مكتمل</option>
                        <option value="cancelled">ملغي</option>
                      </select>

                      <button
                        onClick={() => setDeleteConfirm({ type: 'request', id: req.id, title: `طلب ${req.clientName}` })}
                        className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white cursor-pointer transition"
                        title="حذف الطلب"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Contact Info Strip */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="text-slate-500">وسيلة التواصل:</span>
                      <span className="font-bold text-white">{req.contactMethod}</span>
                      <span className="font-mono text-cyan-400 font-bold">{req.contactValue}</span>
                    </div>

                    {req.contactMethod === 'whatsapp' && (
                      <a
                        href={`https://wa.me/${req.contactValue.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs"
                      >
                        <PlatformIcon platform="whatsapp" size={14} />
                        <span>فتح محادثة واتساب للعميل</span>
                      </a>
                    )}
                  </div>

                  {/* Project Details */}
                  <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/40">
                    <span className="block font-bold text-slate-400 mb-1">تفاصيل المشروع:</span>
                    {req.projectDetails}
                  </div>

                  {req.budget && (
                    <div className="text-xs text-slate-400">
                      <span>الميزانية المقترحة من العميل: </span>
                      <span className="text-cyan-300 font-bold">{req.budget}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* IN-UI DELETE CONFIRMATION MODAL (Zero browser prompt/alert) */}
      {/* ======================================================== */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center mx-auto border border-cyan-500/30">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-base font-bold text-white">تأكيد عملية الحذف</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                هل أنت متأكد من رغبتك في حذف <span className="font-bold text-cyan-300">«{deleteConfirm.title}»</span> نهائيًا؟
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition disabled:opacity-50 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-lg"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>جارٍ الحذف...</span>
                  </>
                ) : (
                  <span>نعم، حذف</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
