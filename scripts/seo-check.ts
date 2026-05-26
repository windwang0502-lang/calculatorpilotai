import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const root = resolve(process.cwd());
let errors = 0;

function fail(msg: string) {
  console.error(`❌ ${msg}`);
  errors++;
}

function pass(msg: string) {
  console.log(`✅ ${msg}`);
}

// 1. Check public/sitemap.xml
const sitemapPath = resolve(root, 'public/sitemap.xml');
if (!existsSync(sitemapPath)) {
  fail('public/sitemap.xml does not exist');
} else {
  pass('public/sitemap.xml exists');
}

// 2. Check public/robots.txt
const robotsPath = resolve(root, 'public/robots.txt');
if (!existsSync(robotsPath)) {
  fail('public/robots.txt does not exist');
} else {
  pass('public/robots.txt exists');
  const robotsContent = readFileSync(robotsPath, 'utf-8');
  if (!robotsContent.includes('sitemap')) {
    fail('robots.txt does not reference sitemap');
  } else {
    pass('robots.txt references sitemap');
  }
}

// 3. Check sitemap URLs
if (existsSync(sitemapPath)) {
  const sitemap = readFileSync(sitemapPath, 'utf-8');
  const requiredUrls = [
    'https://www.calculatorpilotai.com/',
    '/tools/finance/mortgage-calculator',
    '/tools/health/bmi-calorie-calculator',
    '/tools/time/age-calculator',
    '/tools/ai/ai-detector',
    '/tools/shipping/dim-weight-calculator',
    '/guides',
    '/compare',
    '/about',
    '/privacy-policy',
    '/terms',
    '/contact',
  ];
  for (const url of requiredUrls) {
    if (!sitemap.includes(url)) {
      fail(`sitemap.xml missing: ${url}`);
    } else {
      pass(`sitemap.xml contains: ${url}`);
    }
  }
}

// 4. Check lib/seo/index.ts for tool metadata
const seoPath = resolve(root, 'src/lib/seo/index.ts');
if (existsSync(seoPath)) {
  const seoContent = readFileSync(seoPath, 'utf-8');
  const tools = ['mortgage', 'bmi', 'age', 'ai', 'shipping'];
  for (const tool of tools) {
    const titleMatch = new RegExp(`${tool}:[\\s\\S]{0,200}title:`).test(seoContent);
    const descMatch = new RegExp(`${tool}:[\\s\\S]{0,400}description:`).test(seoContent);
    const faqMatch = new RegExp(`${tool}:[\\s\\S]{0,600}faqs?:`).test(seoContent);
    if (!titleMatch) fail(`lib/seo: ${tool} missing title`);
    else pass(`lib/seo: ${tool} has title`);
    if (!descMatch) fail(`lib/seo: ${tool} missing description`);
    else pass(`lib/seo: ${tool} has description`);
    if (!faqMatch) fail(`lib/seo: ${tool} missing faqs`);
    else pass(`lib/seo: ${tool} has faqs`);
  }

  // Check for empty title/description
  const emptyTitle = /title:\s*['"]\s*['"]/.test(seoContent);
  const emptyDesc = /description:\s*['"]\s*['"]/.test(seoContent);
  if (emptyTitle) fail('lib/seo contains empty title');
  else pass('lib/seo: no empty titles');
  if (emptyDesc) fail('lib/seo contains empty description');
  else pass('lib/seo: no empty descriptions');
}

if (errors > 0) {
  console.error(`\n❌ SEO Check Failed: ${errors} error(s) found`);
  process.exit(1);
} else {
  console.log('\n✅ SEO Check Passed');
  process.exit(0);
}
