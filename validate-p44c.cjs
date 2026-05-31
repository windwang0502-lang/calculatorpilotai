const http = require('http');
const https = require('https');

const BASE_URL = 'http://localhost:4173';
const URLS_TO_TEST = [
  '/tools/shipping/package-volume-calculator',
  '/tools/shipping/freight-class-calculator',
  '/tools/finance/mortgage-calculator',
  '/tools/health/bmi-calculator',
  '/tools/shipping/dim-weight-calculator'
];

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { timeout: 10000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.on('timeout', () => reject(new Error('Request timeout')));
  });
}

function analyzeHtml(html, url) {
  const results = {
    url,
    jsonLdBlocks: 0,
    faqPageCount: 0,
    webApplicationCount: 0,
    softwareApplicationCount: 0,
    breadcrumbListCount: 0,
    hasCanonical: false,
    hasRobotsIndexFollow: false,
    issues: []
  };

  // Count JSON-LD blocks
  const ldJsonMatches = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>/gi) || [];
  results.jsonLdBlocks = ldJsonMatches.length;

  // Count schema types
  const faqMatches = html.match(/"@type":\s*"FAQPage"/g) || [];
  results.faqPageCount = faqMatches.length;

  const webAppMatches = html.match(/"@type":\s*"WebApplication"/g) || [];
  results.webApplicationCount = webAppMatches.length;

  const softwareMatches = html.match(/"@type":\s*"SoftwareApplication"/g) || [];
  results.softwareApplicationCount = softwareMatches.length;

  const breadcrumbMatches = html.match(/"@type":\s*"BreadcrumbList"/g) || [];
  results.breadcrumbListCount = breadcrumbMatches.length;

  // Check canonical
  const canonicalMatch = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"[^>]*>/i) ||
                        html.match(/<link[^>]*href="([^"]*)"[^>]*rel="canonical"[^>]*>/i);
  results.hasCanonical = !!canonicalMatch;
  results.canonicalUrl = canonicalMatch ? canonicalMatch[1] : null;

  // Check robots
  results.hasRobotsIndexFollow = /<meta[^>]*name="robots"[^>]*content="[^"]*index[^"]*follow[^"]*"[^>]*>/i.test(html) ||
                                  /<meta[^>]*content="[^"]*index[^"]*follow[^"]*"[^>]*name="robots"[^>]*>/i.test(html);

  // Check for issues
  if (results.jsonLdBlocks > 5) {
    results.issues.push(`WARN: ${results.jsonLdBlocks} JSON-LD blocks (expected < 5)`);
  }

  if (results.faqPageCount === 0) {
    results.issues.push('WARN: No FAQPage schema found');
  } else if (results.faqPageCount > 1) {
    results.issues.push(`FAIL: ${results.faqPageCount} FAQPage schemas (expected 1)`);
  }

  if (results.webApplicationCount === 0 && results.softwareApplicationCount === 0) {
    results.issues.push('WARN: No WebApplication/SoftwareApplication schema found');
  } else if (results.webApplicationCount > 1) {
    results.issues.push(`FAIL: ${results.webApplicationCount} WebApplication schemas (expected 1)`);
  } else if (results.softwareApplicationCount > 1) {
    results.issues.push(`FAIL: ${results.softwareApplicationCount} SoftwareApplication schemas (expected 1)`);
  }

  if (results.breadcrumbListCount === 0) {
    results.issues.push('WARN: No BreadcrumbList schema found');
  } else if (results.breadcrumbListCount > 1) {
    results.issues.push(`FAIL: ${results.breadcrumbListCount} BreadcrumbList schemas (expected 1)`);
  }

  if (!results.hasCanonical) {
    results.issues.push('FAIL: No canonical URL found');
  }

  if (!results.hasRobotsIndexFollow) {
    results.issues.push('WARN: No robots index,follow found');
  }

  return results;
}

async function validate() {
  console.log('=== P4.4C Validation Audit ===\n');
  console.log('Waiting for preview server to be ready...\n');

  let allPassed = true;
  const allResults = [];

  for (const path of URLS_TO_TEST) {
    try {
      const url = BASE_URL + path;
      console.log(`Checking: ${path}`);
      const html = await fetchPage(url);
      const results = analyzeHtml(html, path);
      allResults.push(results);

      console.log(`  JSON-LD blocks: ${results.jsonLdBlocks}`);
      console.log(`  FAQPage: ${results.faqPageCount}`);
      console.log(`  WebApplication: ${results.webApplicationCount}`);
      console.log(`  SoftwareApplication: ${results.softwareApplicationCount}`);
      console.log(`  BreadcrumbList: ${results.breadcrumbListCount}`);
      console.log(`  Canonical: ${results.hasCanonical ? 'YES' : 'NO'}`);
      console.log(`  Robots index,follow: ${results.hasRobotsIndexFollow ? 'YES' : 'NO'}`);

      if (results.issues.length > 0) {
        console.log(`  ISSUES:`);
        results.issues.forEach(issue => console.log(`    - ${issue}`));
        if (results.issues.some(i => i.startsWith('FAIL'))) {
          allPassed = false;
        }
      }
      console.log('');
    } catch (error) {
      console.log(`  ERROR: ${error.message}`);
      allPassed = false;
    }
  }

  console.log('=== FINAL RESULT ===');
  console.log(allPassed ? 'PASS' : 'FAIL');

  return allPassed;
}

validate().then(passed => {
  process.exit(passed ? 0 : 1);
}).catch(err => {
  console.error('Validation error:', err);
  process.exit(1);
});
