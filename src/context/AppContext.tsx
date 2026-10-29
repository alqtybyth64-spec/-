import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  SiteSettings,
  AppItem,
  Advertisement,
  SocialLink,
  ServiceRequest,
} from '../types';
import { DEFAULT_SETTINGS } from '../constants/defaults';
import { api, authStorage } from '../services/api';

export type AppPage =
  | 'home'
  | 'apps'
  | 'app-detail'
  | 'categories'
  | 'web-design'
  | 'contact'
  | 'privacy'
  | 'admin'
  | 'not-found';

interface AppContextType {
  settings: SiteSettings;
  apps: AppItem[];
  ads: Advertisement[];
  socialLinks: SocialLink[];
  serviceRequests: ServiceRequest[];
  isAdmin: boolean;
  isLoading: boolean;
  currentPage: AppPage;
  selectedAppId: string | null;
  selectedCategory: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  navigate: (page: AppPage, params?: { appId?: string; category?: string }) => void;
  loginAdmin: (password: string) => Promise<boolean>;
  logoutAdmin: () => void;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  saveApp: (app: Partial<AppItem>) => Promise<void>;
  deleteApp: (id: string) => Promise<void>;
  saveAd: (ad: Partial<Advertisement>) => Promise<void>;
  deleteAd: (id: string) => Promise<void>;
  saveSocialLink: (link: Partial<SocialLink>) => Promise<void>;
  deleteSocialLink: (id: string) => Promise<void>;
  updateRequestStatus: (id: string, status: string, notes?: string) => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;
  submitServiceRequest: (data: any) => Promise<any>;
  registerDownload: (appId: string) => Promise<string | undefined>;
  refreshState: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [apps, setApps] = useState<AppItem[]>([]);
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Navigation state
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sync document title and meta with settings.siteName
  useEffect(() => {
    if (settings.siteName) {
      document.title = `${settings.siteName} - ${settings.siteDescription || 'الموقع الرسمي'}`;

      // Update og:title and twitter title
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', settings.siteName);

      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && settings.siteDescription) {
        metaDesc.setAttribute('content', settings.siteDescription);
      }
    }
  }, [settings.siteName, settings.siteDescription]);

  // Load initial data
  const refreshState = useCallback(async () => {
    setIsLoading(true);
    try {
      const adminToken = authStorage.getToken();
      if (adminToken) {
        const verified = await api.verifyAdmin();
        if (verified) {
          setIsAdmin(true);
          const adminState = await api.getAdminState();
          setSettings(adminState.settings || DEFAULT_SETTINGS);
          setApps(adminState.apps || []);
          setAds(adminState.ads || []);
          setSocialLinks(adminState.socialLinks || []);
          setServiceRequests(adminState.serviceRequests || []);
          setIsLoading(false);
          return;
        } else {
          authStorage.clearToken();
          setIsAdmin(false);
        }
      }

      // Public state
      const publicState = await api.getPublicState();
      setSettings(publicState.settings || DEFAULT_SETTINGS);
      setApps(publicState.apps || []);
      setAds(publicState.ads || []);
      setSocialLinks(publicState.socialLinks || []);
    } catch (err) {
      console.warn('Failed to load application state, applying defaults:', err);
      setSettings(DEFAULT_SETTINGS);
      setApps([]);
      setAds([]);
      setSocialLinks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshState();
  }, [refreshState]);

  // Navigation handler
  const navigate = useCallback((page: AppPage, params?: { appId?: string; category?: string }) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (params?.appId) setSelectedAppId(params.appId);
    if (params?.category) setSelectedCategory(params.category);
    setCurrentPage(page);
  }, []);

  // Admin Auth
  const loginAdmin = async (password: string): Promise<boolean> => {
    try {
      await api.loginAdmin(password);
      setIsAdmin(true);
      await refreshState();
      return true;
    } catch (err: any) {
      throw err;
    }
  };

  const logoutAdmin = () => {
    api.logoutAdmin();
    setIsAdmin(false);
    refreshState();
    navigate('home');
  };

  // Mutators
  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    const updated = await api.updateSettings(newSettings);
    setSettings(updated);
  };

  const saveApp = async (appData: Partial<AppItem>) => {
    const updatedApps = await api.saveApp(appData);
    setApps(updatedApps);
  };

  const deleteApp = async (id: string) => {
    const updatedApps = await api.deleteApp(id);
    setApps(updatedApps);
  };

  const saveAd = async (adData: Partial<Advertisement>) => {
    const updatedAds = await api.saveAd(adData);
    setAds(updatedAds);
  };

  const deleteAd = async (id: string) => {
    const updatedAds = await api.deleteAd(id);
    setAds(updatedAds);
  };

  const saveSocialLink = async (linkData: Partial<SocialLink>) => {
    const updatedLinks = await api.saveSocialLink(linkData);
    setSocialLinks(updatedLinks);
  };

  const deleteSocialLink = async (id: string) => {
    const updatedLinks = await api.deleteSocialLink(id);
    setSocialLinks(updatedLinks);
  };

  const updateRequestStatus = async (id: string, status: string, notes?: string) => {
    const updated = await api.updateRequestStatus(id, status, notes);
    setServiceRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
  };

  const deleteRequest = async (id: string) => {
    const updated = await api.deleteRequest(id);
    setServiceRequests(updated);
  };

  const submitServiceRequest = async (data: any) => {
    return api.submitServiceRequest(data);
  };

  const registerDownload = async (appId: string): Promise<string | undefined> => {
    try {
      const res = await api.registerDownload(appId);
      setApps((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, downloadCount: res.downloadCount } : a))
      );
      return res.downloadUrl;
    } catch (err) {
      console.error(err);
      return undefined;
    }
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        apps,
        ads,
        socialLinks,
        serviceRequests,
        isAdmin,
        isLoading,
        currentPage,
        selectedAppId,
        selectedCategory,
        searchQuery,
        setSearchQuery,
        navigate,
        loginAdmin,
        logoutAdmin,
        updateSettings,
        saveApp,
        deleteApp,
        saveAd,
        deleteAd,
        saveSocialLink,
        deleteSocialLink,
        updateRequestStatus,
        deleteRequest,
        submitServiceRequest,
        registerDownload,
        refreshState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
