export type SEOCategory = "finance" | "health" | "shipping" | "ai" | "time";
export type SEOIntent = "calculator" | "guide" | "compare";
export type SEOCompetition = "low" | "medium" | "high";
export type SEOPriority = "P0" | "P1" | "P2";
export type SEOPageType = "calculator" | "guide" | "compare";

export interface SEOPageConfig {
  slug: string;
  keyword: string;
  title: string;
  description: string;
  category: SEOCategory;
  intent: SEOIntent;
  competition: SEOCompetition;
  priority: SEOPriority;
  pageType: SEOPageType;
  relatedTools?: string[];
  relatedGuides?: string[];
  relatedCompare?: string[];
  notes?: string;
}
