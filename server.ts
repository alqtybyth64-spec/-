import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import http from 'http';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.resolve(__dirname, 'data');
const UPLOADS_DIR = path.resolve(__dirname, 'uploads');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Middleware
app.use(express.json({ limit: '150mb' }));
app.use(express.urlencoded({ extended: true, limit: '150mb' }));
app.use('/uploads', express.static(UPLOADS_DIR));

// Security HTTP headers
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Helper for URL safety validation (blocks javascript: or malicious protocol injection)
function isSafeUrl(url: string | undefined): boolean {
  if (!url) return true;
  const trimmed = url.trim().toLowerCase();
  if (trimmed.startsWith('javascript:') || trimmed.startsWith('data:text/html') || trimmed.startsWith('vbscript:')) {
    return false;
  }
  return true;
}

// Sanitization helper
function sanitizeText(str: any, maxLength = 1000): string {
  if (!str) return '';
  return String(str)
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLength);
}

// Simple in-memory rate limiter for public inquiry submissions
const requestIpHistory = new Map<string, number[]>();
function checkRateLimit(ip: string, maxRequests = 10, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const timestamps = (requestIpHistory.get(ip) || []).filter((t) => now - t < windowMs);
  if (timestamps.length >= maxRequests) return false;
  timestamps.push(now);
  requestIpHistory.set(ip, timestamps);
  return true;
}


// Admin Secret and Password
// Default admin password is 'taha2026', can be overridden by ADMIN_PASSWORD env
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'taha2026';
const SERVER_SECRET = process.env.SERVER_SECRET || crypto.randomBytes(32).toString('hex');

// Load or initialize DB
function getInitialData() {
  return {
    settings: {
      siteName: 'TAHA',
      siteDescription: 'الموقع الرسمي لتطبيقات وبرامج طه القطيبي',
      logoUrl: '',
      iconUrl: '/icon.svg',
      primaryColor: '#0b1329',
      secondaryColor: '#0284c7',
      whatsappNumber: '', // STRICTLY EMPTY initially
      whatsappMessage: 'مرحبًا بك، أود الاستفسار حول خدمات وتطبيقات TAHA',
      showFloatingWhatsapp: true,
      developerName: 'طه القطيبي',
      developerBio: 'مهندس برمجيات ومطور تطبيقات، متخصص في بناء الحلول التقنية الحديثة وتطوير تطبيقات أندرويد وأنظمة الويب المتكاملة.',
      heroTitle: 'المنصة الرسمية لتطبيقات وبرامج TAHA',
      heroSubtitle: 'استكشف وحمّل أحدث البرامج والحلول الرقمية المصممة بعناية فائقة',
      footerText: 'منصة TAHA الرقمية - جميع التطبيقات والبرامج مطورة بأعلى معايير الأمان والجودة.',
      copyrightText: 'جميع الحقوق محفوظة © 2026 - طه القطيبي',
      seoTitle: 'TAHA - الموقع الرسمي لتطبيقات وبرامج طه القطيبي',
      seoDescription: 'الموقع الرسمي لتطبيقات وبرامج طه القطيبي - استكشف أحدث التطبيقات والبرامج وحلول تطوير الويب وتطبيقات الهاتف.',
      privacyPolicyText: `سياسة الخصوصية لمنصة TAHA:
نحن في منصة TAHA نولي خصوصية الزوار والمستخدمين أهمية بالغة.
1. جمع البيانات: لا نقوم بجمع أي بيانات شخصية إلا ما يقدمه المستخدم برغبته الكاملة عند إرسال طلب تصميم موقع أو التواصل المباشر.
2. ملفات التطبيقات: جميع ملفات التطبيقات والبرامج يتم فحصها بدقة لضمان سلامتها وخلوها من أي برمجيات ضارة.
3. الأطراف الثالثة: لا نقوم ببيع أو مشاركة بيانات المستخدمين مع أي جهات خارجية.
4. التحديثات: نحتفظ بالحق في تعديل هذه السياسة عند الحاجة بما يخدم حماية خصوصية المستخدمين.`,
      sectionVisibility: {
        hero: true,
        ads: true,
        search: true,
        categories: true,
        featured: true,
        latest: true,
        developer: true,
        webDesignRequest: true,
        contact: true,
        footer: true,
      },
      sectionOrder: [
        'ads',
        'hero',
        'search',
        'categories',
        'featured',
        'latest',
        'webDesignRequest',
        'developer',
        'contact',
      ],
      categories: ['عام', 'أدوات ونظام', 'إنتاجية وأعمال', 'تعليم ومعرفة', 'إسلاميات', 'وسائط وترفيه'],
      updatedAt: new Date().toISOString(),
    },
    apps: [], // STRICTLY EMPTY initially
    ads: [],  // STRICTLY EMPTY initially
    socialLinks: [], // STRICTLY EMPTY initially
    serviceRequests: [],
  };
}

interface ServerDb {
  settings: any;
  apps: any[];
  ads: any[];
  socialLinks: any[];
  serviceRequests: any[];
}

let dbData: ServerDb = getInitialData();

if (fs.existsSync(DB_FILE)) {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    dbData = JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db.json, using initial state', err);
  }
} else {
  fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), 'utf-8');
}

function saveDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save db.json', err);
  }
}

// Token Generation and Validation
function createToken(role = 'admin') {
  const payload = {
    role,
    iat: Date.now(),
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
    nonce: crypto.randomBytes(8).toString('hex'),
  };
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', SERVER_SECRET).update(body).digest('base64url');
  return `${body}.${signature}`;
}

function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return false;
    const [body, signature] = parts;
    const expectedSig = crypto.createHmac('sha256', SERVER_SECRET).update(body).digest('base64url');
    if (signature !== expectedSig) return false;
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'));
    if (payload.exp < Date.now()) return false;
    return payload.role === 'admin';
  } catch {
    return false;
  }
}

// Admin Auth Middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : (req.headers['x-admin-token'] as string);

  if (verifyToken(token)) {
    return next();
  }
  return res.status(401).json({ success: false, error: 'غير مصرح - صلاحيات المدير مطلوبة' });
}

// API Routes

// 1. Auth
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ success: false, error: 'يرجى إدخال كلمة المرور' });
  }

  if (password === ADMIN_PASSWORD) {
    const token = createToken('admin');
    return res.json({
      success: true,
      token,
      message: 'تم تسجيل الدخول بنجاح',
    });
  }

  return res.status(401).json({ success: false, error: 'كلمة المرور غير صحيحة' });
});

app.get('/api/admin/verify', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : (req.headers['x-admin-token'] as string);
  const isValid = verifyToken(token);
  return res.json({ isValid });
});

// 2. Public State (filters out drafts and private customer requests)
app.get('/api/state', (_req: Request, res: Response) => {
  const publishedApps = dbData.apps.filter((app: any) => app.isPublished);
  const now = new Date();
  const publishedAds = dbData.ads.filter((ad: any) => {
    if (!ad.isPublished) return false;
    if (ad.startDate && new Date(ad.startDate) > now) return false;
    if (ad.endDate && new Date(ad.endDate) < now) return false;
    return true;
  }).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

  const activeSocialLinks = dbData.socialLinks
    .filter((link: any) => link.isEnabled)
    .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

  return res.json({
    settings: dbData.settings,
    apps: publishedApps,
    ads: publishedAds,
    socialLinks: activeSocialLinks,
  });
});

// 3. Admin State (includes all items & private requests)
app.get('/api/admin/state', requireAdmin, (_req: Request, res: Response) => {
  return res.json({
    settings: dbData.settings,
    apps: dbData.apps,
    ads: dbData.ads,
    socialLinks: dbData.socialLinks,
    serviceRequests: dbData.serviceRequests,
  });
});

// 4. Update Settings
app.post('/api/admin/settings', requireAdmin, (req: Request, res: Response) => {
  const newSettings = req.body;
  dbData.settings = {
    ...dbData.settings,
    ...newSettings,
    updatedAt: new Date().toISOString(),
  };
  saveDb();
  return res.json({ success: true, settings: dbData.settings });
});

// 5. Apps Management
app.post('/api/admin/apps', requireAdmin, (req: Request, res: Response) => {
  const appItem = req.body;
  if (!appItem.name || !appItem.shortDescription) {
    return res.status(400).json({ success: false, error: 'اسم التطبيق والوصف المختصر مطلوبان' });
  }

  const existingIdx = dbData.apps.findIndex((a: any) => a.id === appItem.id);
  const now = new Date().toISOString();

  if (existingIdx >= 0) {
    dbData.apps[existingIdx] = {
      ...dbData.apps[existingIdx],
      ...appItem,
      updatedAt: now,
    };
  } else {
    const newApp = {
      ...appItem,
      id: appItem.id || `app_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      downloadCount: appItem.downloadCount || 0,
      createdAt: now,
      updatedAt: now,
    };
    dbData.apps.unshift(newApp);
  }

  saveDb();
  return res.json({ success: true, apps: dbData.apps });
});

app.delete('/api/admin/apps/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  dbData.apps = dbData.apps.filter((a: any) => a.id !== id);
  saveDb();
  return res.json({ success: true, apps: dbData.apps });
});

// Increment real download count
app.post('/api/apps/:id/download', (req: Request, res: Response) => {
  const { id } = req.params;
  const appItem = dbData.apps.find((a: any) => a.id === id);
  if (!appItem) {
    return res.status(404).json({ success: false, error: 'التطبيق غير موجود' });
  }

  appItem.downloadCount = (appItem.downloadCount || 0) + 1;
  saveDb();
  return res.json({ success: true, downloadCount: appItem.downloadCount, downloadUrl: appItem.downloadUrl });
});

// 6. Ads Management
app.post('/api/admin/ads', requireAdmin, (req: Request, res: Response) => {
  const ad = req.body;
  if (!ad.title || !ad.imageUrl) {
    return res.status(400).json({ success: false, error: 'عنوان الإعلان ورابط الصورة مطلوبان' });
  }

  const existingIdx = dbData.ads.findIndex((a: any) => a.id === ad.id);
  const now = new Date().toISOString();

  if (existingIdx >= 0) {
    dbData.ads[existingIdx] = {
      ...dbData.ads[existingIdx],
      ...ad,
    };
  } else {
    const newAd = {
      ...ad,
      id: ad.id || `ad_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      durationSeconds: Number(ad.durationSeconds) || 5,
      order: Number(ad.order) || dbData.ads.length + 1,
      isPublished: ad.isPublished !== false,
      createdAt: now,
    };
    dbData.ads.push(newAd);
  }

  saveDb();
  return res.json({ success: true, ads: dbData.ads });
});

app.delete('/api/admin/ads/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  dbData.ads = dbData.ads.filter((a: any) => a.id !== id);
  saveDb();
  return res.json({ success: true, ads: dbData.ads });
});

// 7. Social Links Management
app.post('/api/admin/social-links', requireAdmin, (req: Request, res: Response) => {
  const link = req.body;
  if (!link.platform || !link.url) {
    return res.status(400).json({ success: false, error: 'المنصة ورابط الحساب مطلوبان' });
  }

  const existingIdx = dbData.socialLinks.findIndex((l: any) => l.id === link.id);
  if (existingIdx >= 0) {
    dbData.socialLinks[existingIdx] = {
      ...dbData.socialLinks[existingIdx],
      ...link,
    };
  } else {
    const newLink = {
      ...link,
      id: link.id || `social_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      order: Number(link.order) || dbData.socialLinks.length + 1,
      isEnabled: link.isEnabled !== false,
      createdAt: new Date().toISOString(),
    };
    dbData.socialLinks.push(newLink);
  }

  saveDb();
  return res.json({ success: true, socialLinks: dbData.socialLinks });
});

app.delete('/api/admin/social-links/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  dbData.socialLinks = dbData.socialLinks.filter((l: any) => l.id !== id);
  saveDb();
  return res.json({ success: true, socialLinks: dbData.socialLinks });
});

// 8. Service Requests
// Public submission with rate limiting and text sanitization
app.post('/api/requests', (req: Request, res: Response) => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({
      success: false,
      error: 'تم تجاوز الحد الأقصى للمحاولات مؤقتًا. يرجى الانتظار بضع دقائق ثم المحاولة مجددًا.',
    });
  }

  const { clientName, contactMethod, contactValue, projectType, projectDetails, budget } = req.body;

  if (!clientName || !contactValue || !projectDetails) {
    return res.status(400).json({ success: false, error: 'يرجى ملء جميع الحقول الإلزامية' });
  }

  const safeClientName = sanitizeText(clientName, 100);
  const safeContactValue = sanitizeText(contactValue, 150);
  const safeProjectDetails = sanitizeText(projectDetails, 3000);
  const safeBudget = sanitizeText(budget, 100);

  if (!safeClientName || !safeContactValue || !safeProjectDetails) {
    return res.status(400).json({ success: false, error: 'البيانات المدخلة تحتوي على رموز غير مسموح بها' });
  }

  const newRequest = {
    id: `req_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
    clientName: safeClientName,
    contactMethod: sanitizeText(contactMethod || 'whatsapp', 50),
    contactValue: safeContactValue,
    projectType: sanitizeText(projectType || 'website', 50),
    projectDetails: safeProjectDetails,
    budget: safeBudget,
    status: 'new',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  dbData.serviceRequests.unshift(newRequest);
  saveDb();

  return res.json({
    success: true,
    message: 'تم إرسال طلبكم بنجاح! سنتواصل معكم في أقرب وقت.',
    id: newRequest.id,
  });
});

// Admin status update
app.post('/api/admin/requests/:id/status', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const reqItem = dbData.serviceRequests.find((r: any) => r.id === id);
  if (!reqItem) {
    return res.status(404).json({ success: false, error: 'الطلب غير موجود' });
  }

  if (status) reqItem.status = sanitizeText(status, 50);
  if (notes !== undefined) reqItem.notes = sanitizeText(notes, 2000);
  reqItem.updatedAt = new Date().toISOString();

  saveDb();
  return res.json({ success: true, request: reqItem });
});

app.delete('/api/admin/requests/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  dbData.serviceRequests = dbData.serviceRequests.filter((r: any) => r.id !== id);
  saveDb();
  return res.json({ success: true, serviceRequests: dbData.serviceRequests });
});

// 9. Hardened File & APK Upload Handler
const ALLOWED_EXTS = new Set([
  '.png', '.jpg', '.jpeg', '.webp', '.svg', '.ico', '.gif',
  '.apk', '.xapk', '.zip', '.pdf'
]);

app.post('/api/upload', requireAdmin, (req: Request, res: Response) => {
  try {
    const { filename, fileData } = req.body;
    if (!filename || !fileData) {
      return res.status(400).json({ success: false, error: 'الملف غير صالح أو فارغ' });
    }

    const ext = path.extname(filename).toLowerCase();
    if (!ALLOWED_EXTS.has(ext)) {
      return res.status(400).json({
        success: false,
        error: `نوع الملف (${ext}) غير مسموح به. الصيغ المسموحة: صور (png, jpg, webp, svg, ico, gif) وحزم أندرويد (apk, xapk, zip)`,
      });
    }

    // Clean base64 header if present
    const base64Data = fileData.replace(/^data:([A-Za-z-+/0-9]+);base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Max 100MB limit
    if (buffer.length > 100 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        error: 'حجم الملف يتجاوز الحد المسموح (100 ميجابايت)',
      });
    }

    const safeBase = path.basename(filename, ext).replace(/[^a-zA-Z0-9_\u0600-\u06FF-]/g, '_');
    const uniqueName = `${Date.now()}_${safeBase}${ext}`;
    const targetPath = path.resolve(UPLOADS_DIR, uniqueName);

    // Prevent path traversal
    if (!targetPath.startsWith(UPLOADS_DIR)) {
      return res.status(400).json({ success: false, error: 'مسار الملف غير آمن' });
    }

    fs.writeFileSync(targetPath, buffer);
    const fileUrl = `/uploads/${uniqueName}`;

    return res.json({
      success: true,
      url: fileUrl,
      filename: uniqueName,
      sizeBytes: buffer.length,
      sizeFormatted: `${(buffer.length / (1024 * 1024)).toFixed(1)} ميجابايت`,
    });
  } catch (err: any) {
    console.error('Upload error:', err);
    return res.status(500).json({ success: false, error: 'حدث خطأ أثناء معالجة الملف' });
  }
});

// Vite middleware integration for Development
async function startServer() {
  const httpServer = http.createServer(app);

  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        watch: null,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`[TAHA Platform] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
});
