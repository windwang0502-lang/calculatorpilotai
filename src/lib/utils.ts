import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Params = Partial<
  Record<keyof URLSearchParams, string | number | null | undefined>
>;

export function createQueryString(
  params: Params,
  searchParams: URLSearchParams
) {
  const newSearchParams = new URLSearchParams(searchParams?.toString());

  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) {
      newSearchParams.delete(key);
    } else {
      newSearchParams.set(key, String(value));
    }
  }

  return newSearchParams.toString();
}

export function formatDate(
  date: Date | string | number,
  opts: Intl.DateTimeFormatOptions = {}
) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: opts.month ?? "long",
    day: opts.day ?? "numeric",
    year: opts.year ?? "numeric",
    ...opts,
  }).format(new Date(date));
}

// ==========================================
// GLOBAL NUMBER FORMATTING SYSTEM
// ==========================================

// Currency formatting: $1,264.14 / $455,888.98 / $1,250,000.00
export function formatCurrency(value: number, options?: { compact?: boolean }): string {
  if (!Number.isFinite(value)) return "$0.00";

  if (options?.compact) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(value);
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// Percent formatting: 6.25% / -0.25% / +0.25%
export function formatPercent(value: number, options?: {
  decimals?: number;
  showSign?: boolean;
}): string {
  if (!Number.isFinite(value)) return "0%";

  const decimals = options?.decimals ?? 2;
  const showSign = options?.showSign ?? false;

  const formatted = Math.abs(value).toFixed(decimals);
  const sign = value < 0 ? "-" : (showSign && value > 0 ? "+" : "");

  return `${sign}${formatted}%`;
}

// Number formatting: 1,000 / 10,000 / 1,000,000
export function formatNumber(value: number, options?: {
  decimals?: number;
  compact?: boolean;
}): string {
  if (!Number.isFinite(value)) return "0";

  if (options?.compact) {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: options?.decimals ?? 0,
    maximumFractionDigits: options?.decimals ?? 0,
  }).format(value);
}

// Compact number formatting: 1.2M / 850K / 2.4B
export function formatCompactNumber(value: number): string {
  if (!Number.isFinite(value)) return "0";

  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

// Format duration in months/years
export function formatDuration(months: number): string {
  if (!Number.isFinite(months) || months < 0) return "0 months";

  const years = Math.floor(months / 12);
  const remainingMonths = Math.round(months % 12);

  if (years === 0) {
    return `${remainingMonths} month${remainingMonths !== 1 ? "s" : ""}`;
  }

  if (remainingMonths === 0) {
    return `${years} year${years !== 1 ? "s" : ""}`;
  }

  return `${years} year${years !== 1 ? "s" : ""} ${remainingMonths} month${remainingMonths !== 1 ? "s" : ""}`;
}

// Responsive text size for large values with overflow protection
export function getResultTextSize(value: string | number): string {
  const str = String(value);
  if (str.length <= 8) return "text-2xl md:text-3xl lg:text-4xl";
  if (str.length <= 12) return "text-xl md:text-2xl lg:text-3xl";
  if (str.length <= 16) return "text-lg md:text-xl lg:text-2xl";
  return "text-base md:text-lg lg:text-xl";
}

// Result value styling classes - ensures numbers never overflow
export function getResultValueClasses(): string {
  return "font-mono font-bold tabular-nums leading-none overflow-wrap-anywhere break-normal";
}

// Compact result value for grids
export function getCompactResultValueClasses(): string {
  return "font-mono font-bold tabular-nums text-sm md:text-base lg:text-lg overflow-wrap-anywhere break-normal";
}

// Validate safe number input
export function validateNumberInput(value: number | string, options?: {
  min?: number;
  max?: number;
  defaultValue?: number;
}): number {
  const num = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(num) || !Number.isFinite(num)) {
    return options?.defaultValue ?? 0;
  }

  if (options?.min !== undefined && num < options.min) {
    return options.min;
  }

  if (options?.max !== undefined && num > options.max) {
    return options.max;
  }

  return num;
}
