/**
 * Analytics Module - GA4 and Microsoft Clarity Integration
 *
 * Production-only analytics for CalculatorPilot AI
 */

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    clarity: ((...args: unknown[]) => void) | undefined;
    clarityConfig: { (): void } | undefined;
  }
}

// Analytics Configuration
const GA4_MEASUREMENT_ID = 'G-SWJB550ZLW';
const CLARITY_PROJECT_ID = 'wzqshn81wi';

// Track if analytics has been initialized
let isInitialized = false;

/**
 * Check if we're in production mode
 */
function isProduction(): boolean {
  return (
    import.meta.env.PROD &&
    !window.location.hostname.includes('localhost') &&
    !window.location.hostname.includes('127.0.0.1')
  );
}

/**
 * Initialize Google Analytics 4
 */
function initGA4(): void {
  if (!isProduction()) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA4_MEASUREMENT_ID, { send_page_view: false });
}

/**
 * Initialize Microsoft Clarity
 */
function initClarity(): void {
  if (!isProduction()) return;

  (function (c: (m: string, i: string, d: () => void) => void, l: string, a: string, r: string, i: string, ar: () => void, g: () => void) {
    if (c[a] && c[a][r]) return;
    g = function () {
      const x = new XMLHttpRequest();
      x.open('GET', 'https://rum.clarity.ms/rum/' + l, true);
      x.onload = function () {
        if (x.status === 404) ar();
      };
      x.send();
    };
    g();
    c[a] = c[a] || {};
    c[a][r] = g;
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.clarity.ms/tag/${i}`;
    const head = document.getElementsByTagName('head')[0];
    if (head) {
      head.appendChild(s);
    }
  })(window, CLARITY_PROJECT_ID, function () {}, 'clarity', 'q', function () {});
}

/**
 * Initialize all analytics (call once at app root)
 */
export function initAnalytics(): void {
  if (isInitialized) return;
  isInitialized = true;

  initGA4();
  initClarity();
}

/**
 * Track page view
 */
export function trackPageView(path: string): void {
  if (!isProduction()) return;
  if (typeof window.gtag !== 'function') return;

  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

/**
 * Track tool view event
 */
export function trackToolView(toolId: string, category: string): void {
  if (!isProduction()) return;
  if (typeof window.gtag !== 'function') return;

  window.gtag('event', 'tool_view', {
    toolId,
    category,
  });
}

/**
 * Track search used event
 */
export function trackSearch(query: string, resultsCount: number): void {
  if (!isProduction()) return;
  if (typeof window.gtag !== 'function') return;

  window.gtag('event', 'search_used', {
    query,
    resultsCount,
  });
}

/**
 * Track tool click event
 */
export function trackToolClick(toolId: string, source: 'search' | 'popular' | 'category'): void {
  if (!isProduction()) return;
  if (typeof window.gtag !== 'function') return;

  window.gtag('event', 'tool_click', {
    toolId,
    source,
  });
}

/**
 * Generic event tracking
 */
export function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean>
): void {
  if (!isProduction()) return;
  if (typeof window.gtag !== 'function') return;

  window.gtag('event', name, params);
}
