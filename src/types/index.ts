export type SocialPlatform =
  | 'youtube'
  | 'tiktok'
  | 'instagram'
  | 'facebook'
  | 'telegram'
  | 'whatsapp'
  | 'x'
  | 'linkedin'
  | 'github'
  | 'other';

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  title: string;
  url: string;
  order: number;
  isEnabled: boolean;
  createdAt: string;
}

export interface Advertisement {
  id: string;
  title: string;
  imageUrl: string;
  text?: string;
  targetUrl?: string;
  durationSeconds: number;
  order: number;
  isPublished: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

export interface AppItem {
  id: string;
  name: string;
  iconUrl?: string;
  shortDescription: string;
  fullDescription: string;
  version: string;
  fileSize?: string;
  operatingSystem: string;
  category: string;
  screenshots: string[];
  downloadUrl: string;
  isExternalDownload: boolean;
  isFeatured: boolean;
  isPublished: boolean;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceRequest {
  id: string;
  clientName: string;
  contactMethod: 'whatsapp' | 'phone' | 'email' | 'telegram';
  contactValue: string;
  projectType: 'website' | 'web_app' | 'android_app' | 'redesign' | 'other';
  projectDetails: string;
  budget?: string;
  status: 'new' | 'reviewing' | 'contacted' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SectionVisibility {
  hero: boolean;
  ads: boolean;
  search: boolean;
  categories: boolean;
  featured: boolean;
  latest: boolean;
  developer: boolean;
  webDesignRequest: boolean;
  contact: boolean;
  footer: boolean;
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  logoUrl: string;
  iconUrl: string;
  backgroundUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  whatsappNumber: string;
  whatsappMessage: string;
  showFloatingWhatsapp: boolean;
  developerName: string;
  developerBio: string;
  heroTitle: string;
  heroSubtitle: string;
  footerText: string;
  copyrightText: string;
  seoTitle: string;
  seoDescription: string;
  privacyPolicyText: string;
  sectionVisibility: SectionVisibility;
  sectionOrder: string[];
  categories: string[];
  updatedAt: string;
}

export interface AppStateData {
  settings: SiteSettings;
  apps: AppItem[];
  ads: Advertisement[];
  socialLinks: SocialLink[];
  serviceRequests: ServiceRequest[];
}
