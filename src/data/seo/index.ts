import { SEOPageConfig, SEOCategory, SEOIntent } from "./types";
import { financePages } from "./finance-pages";
import { healthPages } from "./health-pages";
import { shippingPages } from "./shipping-pages";
import { aiPages } from "./ai-pages";
import { timePages } from "./time-pages";

export * from "./types";
export * from "./finance-pages";
export * from "./health-pages";
export * from "./shipping-pages";
export * from "./ai-pages";
export * from "./time-pages";

const allPages: SEOPageConfig[] = [
  ...financePages,
  ...healthPages,
  ...shippingPages,
  ...aiPages,
  ...timePages,
];

export function getAllSEOProgrammaticPages(): SEOPageConfig[] {
  return [...allPages];
}

export function getSEOPageBySlug(category: SEOCategory, slug: string): SEOPageConfig | undefined {
  return allPages.find((page) => page.category === category && page.slug === slug);
}

export function getSEOPagesByCategory(category: SEOCategory): SEOPageConfig[] {
  return allPages.filter((page) => page.category === category);
}

export function getSEOPagesByIntent(intent: SEOIntent): SEOPageConfig[] {
  return allPages.filter((page) => page.intent === intent);
}

export function getDuplicateSlugs(): string[] {
  const slugCount: Record<string, number> = {};
  const duplicates: string[] = [];

  for (const page of allPages) {
    slugCount[page.slug] = (slugCount[page.slug] || 0) + 1;
  }

  for (const [slug, count] of Object.entries(slugCount)) {
    if (count > 1) {
      duplicates.push(slug);
    }
  }

  return duplicates;
}

export function getSEOStats() {
  const pages = getAllSEOProgrammaticPages();
  const duplicates = getDuplicateSlugs();

  return {
    totalPages: pages.length,
    byCategory: {
      finance: pages.filter((p) => p.category === "finance").length,
      health: pages.filter((p) => p.category === "health").length,
      shipping: pages.filter((p) => p.category === "shipping").length,
      ai: pages.filter((p) => p.category === "ai").length,
      time: pages.filter((p) => p.category === "time").length,
    },
    byIntent: {
      calculator: pages.filter((p) => p.intent === "calculator").length,
      guide: pages.filter((p) => p.intent === "guide").length,
      compare: pages.filter((p) => p.intent === "compare").length,
    },
    byPriority: {
      P0: pages.filter((p) => p.priority === "P0").length,
      P1: pages.filter((p) => p.priority === "P1").length,
      P2: pages.filter((p) => p.priority === "P2").length,
    },
    duplicateSlugs: duplicates,
    hasDuplicates: duplicates.length > 0,
  };
}
