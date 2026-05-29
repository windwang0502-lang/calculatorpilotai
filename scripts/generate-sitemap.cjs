#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.calculatorpilotai.com';

const staticRoutes = [
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/tools', priority: 0.9, changefreq: 'weekly' },
  { path: '/tools/finance', priority: 0.9, changefreq: 'weekly' },
  { path: '/tools/health', priority: 0.9, changefreq: 'weekly' },
  { path: '/tools/shipping', priority: 0.9, changefreq: 'weekly' },
  { path: '/tools/ai', priority: 0.9, changefreq: 'weekly' },
  { path: '/tools/time', priority: 0.9, changefreq: 'weekly' },
  { path: '/guides', priority: 0.8, changefreq: 'weekly' },
  { path: '/compare', priority: 0.8, changefreq: 'weekly' },
  { path: '/finance-guides', priority: 0.8, changefreq: 'weekly' },
  { path: '/finance-guides/mortgage-by-state', priority: 0.8, changefreq: 'weekly' },
  { path: '/health-guides', priority: 0.8, changefreq: 'weekly' },
  { path: '/about', priority: 0.6, changefreq: 'monthly' },
  { path: '/privacy-policy', priority: 0.5, changefreq: 'monthly' },
  { path: '/terms', priority: 0.5, changefreq: 'monthly' },
  { path: '/contact', priority: 0.5, changefreq: 'monthly' },
  { path: '/ai-disclosure', priority: 0.4, changefreq: 'monthly' },
  { path: '/editorial-policy', priority: 0.4, changefreq: 'monthly' },
];

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getCurrentDateISO() {
  return new Date().toISOString().split('T')[0];
}

function getProgrammaticPriority(page) {
  if (page.pageType === 'calculator') return 0.8;
  if (page.pageType === 'guide') return 0.7;
  if (page.pageType === 'compare') return 0.7;
  return 0.6;
}

async function loadSEOData() {
  const seoModulePath = path.resolve(__dirname, '../src/data/seo/index.ts');

  // Use tsx's ESM register for TypeScript support
  await import('tsx/esm');
  const { pathToFileURL } = await import('url');

  try {
    const mod = await import(pathToFileURL(seoModulePath).href);
    if (!mod.getAllSEOProgrammaticPages) {
      throw new Error('getAllSEOProgrammaticPages not found in src/data/seo/index.ts');
    }
    return mod.getAllSEOProgrammaticPages();
  } finally {
    // tsx auto-registers on import, no explicit unregister needed for CJS script
  }
}

function generateSitemapFromPages(seoPages) {
  const seenUrls = new Set();
  const entries = [];

  for (const route of staticRoutes) {
    const url = `${BASE_URL}${route.path}`;
    if (!seenUrls.has(url)) {
      seenUrls.add(url);
      entries.push({
        loc: url,
        lastmod: getCurrentDateISO(),
        changefreq: route.changefreq,
        priority: route.priority,
      });
    }
  }

  for (const page of seoPages) {
    const url = `${BASE_URL}/tools/${page.category}/${page.slug}`;
    if (!seenUrls.has(url)) {
      seenUrls.add(url);
      entries.push({
        loc: url,
        lastmod: getCurrentDateISO(),
        changefreq: 'weekly',
        priority: getProgrammaticPriority(page),
      });
    }
  }

  entries.sort((a, b) => {
    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }
    return a.loc.localeCompare(b.loc);
  });

  const urlElements = entries
    .map(
      (entry) => `\n  <url>\n    <loc>${escapeXml(entry.loc)}</loc>\n    <lastmod>${entry.lastmod}</lastmod>\n    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority.toFixed(1)}</priority>\n  </url>`
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlElements}\n</urlset>`;

  return { xml, entries };
}

async function main() {
  const seoPages = await loadSEOData();
  const { xml, entries } = generateSitemapFromPages(seoPages);

  const sitemapDir = path.join(__dirname, '..', 'public');
  const sitemapPath = path.join(sitemapDir, 'sitemap.xml');

  if (!fs.existsSync(sitemapDir)) {
    fs.mkdirSync(sitemapDir, { recursive: true });
  }

  fs.writeFileSync(sitemapPath, xml, 'utf-8');

  const duplicateCount = entries.length - new Set(entries.map((e) => e.loc)).size;

  console.log(`Sitemap generated: ${sitemapPath}`);
  console.log(`Total URLs: ${entries.length}`);
  console.log(`Static routes: ${staticRoutes.length}`);
  console.log(`Programmatic SEO pages: ${seoPages.length}`);
  console.log(`Duplicate URLs: ${duplicateCount}`);
}

main().catch((error) => {
  console.error('Failed to generate sitemap:', error.message);
  process.exit(1);
});
