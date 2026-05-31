# TOOL COUNT AUDIT

Date: 2026-05-31
Source files audited:
- `src/data/tools.ts`
- `public/sitemap.xml`
- `src/data/seo/ai-pages.ts`
- `src/data/seo/finance-pages.ts`
- `src/data/seo/health-pages.ts`
- `src/data/seo/shipping-pages.ts`
- `src/data/seo/time-pages.ts`

## Results

| Metric | Count |
|---|---:|
| Total registered tools (`src/data/tools.ts`) | 87 |
| Total calculator pages (sitemap calculator URLs) | 130 |
| Total programmatic pages (`src/data/seo/*-pages.ts`) | 314 |
| Total guide pages (sitemap guide hubs + detail pages) | 25 |
| Total sitemap URLs (`public/sitemap.xml`) | 352 |

## Duplicate Route Audit

- Duplicate routes in `src/data/tools.ts`: **None**
- Duplicate URLs in `public/sitemap.xml`: **None**

## Notes

- Registered tools (87) are lower than sitemap calculator URLs (130), which indicates some calculator pages are programmatic/sitemap-driven and not fully represented in the static tool registry.
- Programmatic page count (314) comes from slug entries in the SEO data files and represents the expansion inventory, not necessarily currently indexed URLs.
