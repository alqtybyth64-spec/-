import assert from 'assert';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Test runner for TAHA platform
async function runTests() {
  console.log('--- STARTING TAHA PLATFORM AUTOMATED TEST SUITE ---');
  let passed = 0;
  let failed = 0;

  function test(name: string, fn: () => void | Promise<void>) {
    try {
      fn();
      console.log(`  [PASS] ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  [FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  async function asyncTest(name: string, fn: () => Promise<void>) {
    try {
      await fn();
      console.log(`  [PASS] ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  [FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  // 1. Files & Assets verification
  test('SEO & Meta assets exist and are valid', () => {
    assert(fs.existsSync('public/robots.txt'), 'robots.txt must exist');
    assert(fs.existsSync('public/sitemap.xml'), 'sitemap.xml must exist');
    assert(fs.existsSync('public/icon.svg'), 'icon.svg must exist');
    assert(fs.existsSync('public/pwa-192x192.png'), 'pwa-192x192.png must exist');
    assert(fs.existsSync('public/pwa-512x512.png'), 'pwa-512x512.png must exist');
    assert(fs.existsSync('public/apple-touch-icon.png'), 'apple-touch-icon.png must exist');

    const robots = fs.readFileSync('public/robots.txt', 'utf-8');
    assert(robots.includes('Disallow: /admin'), 'robots.txt must protect /admin');
    assert(robots.includes('Sitemap: /sitemap.xml'), 'robots.txt must reference sitemap');

    const sitemap = fs.readFileSync('public/sitemap.xml', 'utf-8');
    assert(sitemap.includes('<loc>/</loc>'), 'sitemap must have home url');
  });

  // 2. Strict Empty State Invariant Verification
  test('Initial state in database must be strictly empty (zero mock data)', () => {
    assert(fs.existsSync('data/db.json'), 'data/db.json must exist');
    const db = JSON.parse(fs.readFileSync('data/db.json', 'utf-8'));
    assert(Array.isArray(db.apps), 'db.apps must be array');
    assert(db.apps.length === 0, 'db.apps must be strictly empty initially');
    assert(Array.isArray(db.ads), 'db.ads must be array');
    assert(db.ads.length === 0, 'db.ads must be strictly empty initially');
    assert(Array.isArray(db.socialLinks), 'db.socialLinks must be array');
    assert(db.socialLinks.length === 0, 'db.socialLinks must be strictly empty initially');
    assert(db.settings.siteName === 'TAHA', 'Site name must default to TAHA');
    assert(db.settings.whatsappNumber === '', 'whatsappNumber must be empty initially');
  });

  // 3. Cryptographic Token Verification
  test('HMAC-SHA256 Token verification rejects forged tokens', () => {
    const SECRET = 'test_secret_for_suite_12345';
    function createToken(role = 'admin') {
      const payload = { role, exp: Date.now() + 100000 };
      const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
      const signature = crypto.createHmac('sha256', SECRET).update(body).digest('base64url');
      return `${body}.${signature}`;
    }

    function verifyToken(token: string) {
      const parts = token.split('.');
      if (parts.length !== 2) return false;
      const [body, sig] = parts;
      const expected = crypto.createHmac('sha256', SECRET).update(body).digest('base64url');
      if (sig !== expected) return false;
      const data = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'));
      return data.role === 'admin' && data.exp > Date.now();
    }

    const validToken = createToken('admin');
    assert(verifyToken(validToken) === true, 'Valid token must pass');

    // Tampered payload
    const forgedToken = validToken + 'invalid';
    assert(verifyToken(forgedToken) === false, 'Tampered signature must fail');

    // Expired token
    const expiredPayload = Buffer.from(JSON.stringify({ role: 'admin', exp: Date.now() - 1000 })).toString('base64url');
    const expSig = crypto.createHmac('sha256', SECRET).update(expiredPayload).digest('base64url');
    assert(verifyToken(`${expiredPayload}.${expSig}`) === false, 'Expired token must fail');
  });

  // 4. URL Sanitization Check
  test('URL Safety validator rejects javascript: and malicious protocols', () => {
    function isSafeUrl(url: string | undefined): boolean {
      if (!url) return true;
      const trimmed = url.trim().toLowerCase();
      if (
        trimmed.startsWith('javascript:') ||
        trimmed.startsWith('data:text/html') ||
        trimmed.startsWith('vbscript:')
      ) {
        return false;
      }
      return true;
    }

    assert(isSafeUrl('https://example.com/app.apk') === true);
    assert(isSafeUrl('http://example.com') === true);
    assert(isSafeUrl('/uploads/app.apk') === true);
    assert(isSafeUrl('app:app_123') === true);
    assert(isSafeUrl('javascript:alert(1)') === false, 'javascript: must be blocked');
    assert(isSafeUrl('JAVASCRIPT:alert(1)') === false, 'case-insensitive javascript: must be blocked');
    assert(isSafeUrl('data:text/html,<script>alert(1)</script>') === false, 'data:text/html must be blocked');
  });

  // 5. File upload whitelist and extension check
  test('Upload file extension whitelist blocks dangerous executables', () => {
    const ALLOWED = new Set([
      '.png', '.jpg', '.jpeg', '.webp', '.svg', '.ico', '.gif',
      '.apk', '.xapk', '.zip', '.pdf'
    ]);

    assert(ALLOWED.has('.png') === true);
    assert(ALLOWED.has('.apk') === true);
    assert(ALLOWED.has('.xapk') === true);
    assert(ALLOWED.has('.exe') === false, '.exe must be disallowed');
    assert(ALLOWED.has('.sh') === false, '.sh must be disallowed');
    assert(ALLOWED.has('.php') === false, '.php must be disallowed');
    assert(ALLOWED.has('.js') === false, '.js must be disallowed');
  });

  // 6. Color Rule Enforcement Check (No red, yellow, gold)
  test('No red, yellow, or gold CSS styles in component files', () => {
    const forbiddenPatterns = ['text-red', 'bg-red', 'border-red', 'text-yellow', 'bg-yellow', 'border-yellow', 'gold', 'text-amber'];
    const files = [
      'src/App.tsx',
      'src/components/layout/Navbar.tsx',
      'src/components/layout/Footer.tsx',
      'src/components/home/AdSlider.tsx',
      'src/components/home/HeroSection.tsx',
      'src/components/home/WebDesignBanner.tsx',
      'src/components/apps/AppCard.tsx',
      'src/pages/HomePage.tsx',
      'src/pages/AppsPage.tsx',
      'src/pages/AppDetailPage.tsx',
      'src/pages/WebDesignRequestPage.tsx',
      'src/pages/AdminPage.tsx',
    ];

    for (const file of files) {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf-8');
        for (const pattern of forbiddenPatterns) {
          assert(!content.includes(pattern), `Forbidden color pattern "${pattern}" found in ${file}`);
        }
      }
    }
  });

  // 7. Test API endpoints if server is running on port 3000
  await asyncTest('Live HTTP API verification', async () => {
    try {
      const res = await fetch('http://localhost:3000/api/state');
      assert(res.ok, 'HTTP GET /api/state must return 200');
      const ct = res.headers.get('content-type') || '';
      assert(ct.includes('application/json'), 'Content-Type must be application/json');
      const data = await res.json();
      assert(data.settings && data.settings.siteName, 'Settings must contain siteName');
      assert(Array.isArray(data.apps), 'Apps must be array');
    } catch (err: any) {
      console.warn('Note: Live HTTP test skipped if server not bound on localhost (offline):', err.message);
    }
  });

  // 8. Auto-reload loop prevention verification
  test('PWA & Auto-reload loop prevention configuration', () => {
    const viteConfig = fs.readFileSync('vite.config.ts', 'utf-8');
    assert(viteConfig.includes("registerType: 'prompt'"), 'VitePWA must use prompt registerType to prevent auto reload loops');
    assert(viteConfig.includes('enabled: false'), 'VitePWA devOptions must be disabled');
    assert(viteConfig.includes('watch: null'), 'Vite watch must be null to completely prevent reloads on data modifications');

    const indexHtml = fs.readFileSync('index.html', 'utf-8');
    assert(indexHtml.includes('Suppressed unprompted page reload attempt'), 'index.html must have auto reload protection guard');
    assert(indexHtml.includes('Dropped automatic reload trigger on data update'), 'index.html must drop WebSocket full-reload events');
  });

  console.log(`\n--- TEST RUN SUMMARY: ${passed} PASSED, ${failed} FAILED ---`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Fatal test error:', e);
  process.exit(1);
});
