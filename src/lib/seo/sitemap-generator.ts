import { getAllSEOProgrammaticPages, type SEOPageConfig } from '@/data/seo';

const BASE_URL = 'https://www.calculatorpilotai.com';

interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: 'daily' | 'weekly' | 'monthly';
  priority: number;
}

interface StaticRoute {
  path: string;
  priority: number;
  changefreq: 'daily' | 'weekly' | 'monthly';
}

const staticRoutes: StaticRoute[] = [
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
  { path: '/html-sitemap', priority: 0.7, changefreq: 'weekly' },
  { path: '/about', priority: 0.6, changefreq: 'monthly' },
  { path: '/privacy-policy', priority: 0.5, changefreq: 'monthly' },
  { path: '/terms', priority: 0.5, changefreq: 'monthly' },
  { path: '/contact', priority: 0.5, changefreq: 'monthly' },
  { path: '/ai-disclosure', priority: 0.4, changefreq: 'monthly' },
  { path: '/editorial-policy', priority: 0.4, changefreq: 'monthly' },
];

function getPriorityByPageType(pageType: string, category: string): number {
  if (category === 'static') return 0.8;
  switch (pageType) {
    case 'calculator':
      return 0.8;
    case 'guide':
      return 0.7;
    case 'compare':
      return 0.7;
    default:
      return 0.6;
  }
}

function getChangeFreqByPageType(pageType: string): 'daily' | 'weekly' | 'monthly' {
  switch (pageType) {
    case 'calculator':
      return 'weekly';
    case 'guide':
      return 'weekly';
    case 'compare':
      return 'weekly';
    default:
      return 'weekly';
  }
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getCurrentDateISO(): string {
  return new Date().toISOString().split('T')[0];
}

function generateStaticEntries(): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  const seenUrls = new Set<string>();

  for (const route of staticRoutes) {
    const url = `${BASE_URL}${route.path}`;
    if (seenUrls.has(url)) continue;
    seenUrls.add(url);

    entries.push({
      loc: url,
      lastmod: getCurrentDateISO(),
      changefreq: route.changefreq,
      priority: route.priority,
    });
  }

  return entries;
}

function generateProgrammaticEntries(): SitemapEntry[] {
  const pages = getAllSEOProgrammaticPages();
  const entries: SitemapEntry[] = [];
  const seenUrls = new Set<string>();

  for (const page of pages) {
    const url = `${BASE_URL}/tools/${page.category}/${page.slug}`;
    if (seenUrls.has(url)) continue;
    seenUrls.add(url);

    entries.push({
      loc: url,
      lastmod: getCurrentDateISO(),
      changefreq: getChangeFreqByPageType(page.pageType),
      priority: getPriorityByPageType(page.pageType, page.category),
    });
  }

  return entries;
}

export function generateAllSitemapEntries(): SitemapEntry[] {
  const staticEntries = generateStaticEntries();
  const programmaticEntries = generateProgrammaticEntries();

  const allEntries = [...staticEntries, ...programmaticEntries];
  const seenUrls = new Set<string>();
  const uniqueEntries: SitemapEntry[] = [];

  for (const entry of allEntries) {
    if (!seenUrls.has(entry.loc)) {
      seenUrls.add(entry.loc);
      uniqueEntries.push(entry);
    }
  }

  uniqueEntries.sort((a, b) => {
    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }
    return a.loc.localeCompare(b.loc);
  });

  return uniqueEntries;
}

export function generateSitemapXML(): string {
  const entries = generateAllSitemapEntries();

  const urlElements = entries.map((entry) => `
  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}

export function getSitemapStats() {
  const entries = generateAllSitemapEntries();
  const programmaticEntries = generateProgrammaticEntries();
  const staticEntries = generateStaticEntries();

  return {
    totalUrls: entries.length,
    programmaticUrls: programmaticEntries.length,
    staticUrls: staticEntries.length,
    duplicateCheck: entries.length === new Set(entries.map(e => e.loc)).size,
    categories: {
      finance: programmaticEntries.filter(e => e.loc.includes('/finance/')).length,
      health: programmaticEntries.filter(e => e.loc.includes('/health/')).length,
      shipping: programmaticEntries.filter(e => e.loc.includes('/shipping/')).length,
      ai: programmaticEntries.filter(e => e.loc.includes('/ai/')).length,
      time: programmaticEntries.filter(e => e.loc.includes('/time/')).length,
    },
    byPriority: {
      '1.0': entries.filter(e => e.priority === 1.0).length,
      '0.9': entries.filter(e => e.priority === 0.9).length,
      '0.8': entries.filter(e => e.priority === 0.8).length,
      '0.7': entries.filter(e => e.priority === 0.7).length,
      '0.6': entries.filter(e => e.priority === 0.6).length,
      '0.5': entries.filter(e => e.priority === 0.5).length,
    },
  };
}
