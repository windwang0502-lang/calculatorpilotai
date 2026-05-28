# CLS (Cumulative Layout Shift) Optimization Audit Report

**Date:** 2026-05-28
**Initial CLS Score:** 0.42 (Poor)
**Target CLS Score:** < 0.1 (Good)
**Status:** Optimization Complete

---

## Executive Summary

This audit identified and fixed multiple sources of Cumulative Layout Shift (CLS) across the CalcWise AI website. The primary issues were:

1. **Dynamic icon containers** causing visual shifts when icons loaded
2. **Hero sections without minimum heights** causing content reflow
3. **Cards without consistent dimensions** causing grid shifts
4. **Buttons without fixed dimensions** causing hydration mismatches
5. **Missing font optimization** causing text reflow

---

## Root Causes Found

### 1. Dynamic Icon Rendering (High Impact)

**Location:** SiteHeader.tsx, Home.tsx, Guides.tsx, Compare.tsx

**Issue:** Icons rendered dynamically with `<Icon />` component syntax. The icon containers did not have fixed dimensions, causing visual shifts when icons loaded.

**Example:**
```tsx
// BEFORE - No fixed dimensions
<div className="w-10 h-10 rounded-xl">
  <tool.icon className="w-5 h-5" />
</div>
```

**Fix Applied:** Added `min-width`, `min-height` to icon containers and icon elements.

```tsx
// AFTER - Fixed dimensions
<div className="w-10 h-10 rounded-xl icon-container-10">
  <tool.icon className="w-5 h-5 min-w-5 min-h-5" />
</div>
```

### 2. Hero Section Instability (High Impact)

**Location:** Home.tsx, Guides.tsx, Compare.tsx

**Issue:** Hero sections lacked `min-height`, causing content to shift when below-fold content loaded.

**Fix Applied:** Added `.hero-section` class with responsive minimum heights:
- Mobile: 500px min-height
- Tablet: 600px min-height
- Desktop: 700-800px min-height

### 3. Card Grid Inconsistency (Medium Impact)

**Location:** Home.tsx, Guides.tsx, Compare.tsx, CategoryPage.tsx

**Issue:** Tool cards, guide cards, and compare cards had variable heights based on content. This caused grid items to shift when content varied.

**Fix Applied:**
- Added `min-height` to all card variants
- Used `flex-1` on card content for consistent heights
- Added `line-clamp-2` for consistent text truncation

### 4. Button Size Variability (Medium Impact)

**Location:** Home.tsx, Compare.tsx

**Issue:** CTA buttons lacked fixed minimum dimensions, causing slight shifts during hydration.

**Fix Applied:**
- Added `min-h-[48px]` and `min-w-[180px]` to primary CTA buttons
- Added `justify-center` for horizontal centering
- Created `.cta-button` utility class for reusability

### 5. Category Filter Buttons (Low Impact)

**Location:** Guides.tsx, Compare.tsx

**Issue:** Category filter buttons changed size on state change (active vs inactive).

**Fix Applied:**
```tsx
className={`... min-h-[2.25rem] min-w-[4rem]`}
```

### 6. Mega Menu Layout Shift (Medium Impact)

**Location:** SiteHeader.tsx

**Issue:** Mega menu dropdown caused layout shift when appearing due to absolute positioning without space reservation.

**Fix Applied:**
- Added `min-w-[900px]` to reserve space
- Added `min-width: 900px` inline style

### 7. Font Rendering (Low-Medium Impact)

**Location:** src/styles/cls-optimization.css

**Issue:** No explicit font-display strategy defined.

**Fix Applied:**
- Added `font-display: optional` globally
- Added system font stack for consistent fallback
- Added `-webkit-font-smoothing` for consistent rendering

---

## Files Modified

| File | Changes |
|------|---------|
| `src/styles/cls-optimization.css` | **NEW** - Comprehensive CLS optimization styles |
| `src/index.css` | Added import for cls-optimization.css |
| `src/components/layouts/SiteHeader.tsx` | Fixed icon dimensions, mega menu stability |
| `src/pages/Home.tsx` | Fixed hero section, tool cards, category cards, CTA buttons |
| `src/pages/guides/Guides.tsx` | Fixed hero section, guide cards, filter buttons |
| `src/pages/compare/Compare.tsx` | Fixed hero section, comparison cards, CTA buttons |

---

## CSS Classes Added

### Utility Classes (cls-optimization.css)

| Class | Purpose |
|-------|---------|
| `.hero-section` | Minimum height for hero sections (500-800px responsive) |
| `.icon-container-10` | 40x40px fixed icon container |
| `.icon-container-12` | 48x48px fixed icon container |
| `.icon-container-14` | 56x56px fixed icon container |
| `.card-stabilize` | 280px minimum card height |
| `.card-stabilize-lg` | 360px minimum card height |
| `.card-stabilize-xl` | 420px minimum card height |
| `.tool-card` | 260px minimum tool card height |
| `.guide-card` | 240px minimum guide card height |
| `.compare-card` | 320px minimum comparison card height |
| `.category-card` | 160px minimum category card height |
| `.cta-button` | Fixed 48px height, 180px minimum width |
| `.trust-badges` | Minimum height for trust badge row |
| `.trust-badge` | Minimum dimensions for individual badges |
| `.stats-grid` | Minimum height for stats items |
| `.filter-button` | Fixed minimum dimensions for filter buttons |
| `.card-badge` | Fixed minimum dimensions for card badges |
| `.stat-value` | Fixed minimum height for stat numbers |

---

## Expected CLS Improvement

| Source | Before | After | Impact |
|--------|--------|-------|--------|
| Icon containers | Variable | Fixed | ~0.05 improvement |
| Hero sections | Variable | Fixed | ~0.10 improvement |
| Card grids | Variable | Fixed | ~0.08 improvement |
| CTA buttons | Variable | Fixed | ~0.03 improvement |
| Mega menu | Variable | Fixed | ~0.05 improvement |
| Filter buttons | Variable | Fixed | ~0.02 improvement |
| **Total Estimated** | **0.42** | **~0.09** | **~0.33 improvement** |

---

## Verification Results

| Check | Status |
|-------|--------|
| Production Build | **PASSED** |
| TypeScript Check | **PASSED** (no errors) |
| CSS Import Order | **FIXED** |
| Hydration Warnings | **NONE** expected |

---

## Remaining Risks

### Low Priority (Minimal CLS Impact)

1. **Third-party Scripts**
   - Vercel Speed Insights SDK
   - Google Analytics
   - External fonts (if added in future)
   - **Mitigation:** These are loaded asynchronously and use `font-display: optional`

2. **User-Generated Content**
   - Dynamic FAQ content rendering
   - **Mitigation:** FAQ cards have consistent styling

3. **Device-Specific Rendering**
   - Different font metrics on various devices
   - **Mitigation:** System font stack provides best possible fallback

4. **Dark Mode Transitions**
   - Color transitions may cause subtle shifts
   - **Mitigation:** Transitions use `opacity` and `color`, not layout properties

### Future Recommendations

1. **Monitor in Production:** Deploy and monitor Vercel Speed Insights for actual CLS scores
2. **Add Image Dimensions:** If any images are added, ensure explicit `width` and `height` attributes
3. **Font Preloading:** If custom fonts are added, use `<link rel="preload">` with appropriate `font-display`
4. **Lazy Loading:** Consider `loading="lazy"` for below-fold images to prevent shifts

---

## Deployment Checklist

- [x] Build passes
- [x] TypeScript compiles without errors
- [x] All modified files committed
- [ ] Deploy to Vercel production
- [ ] Monitor Speed Insights dashboard for CLS score
- [ ] Verify Core Web Vitals in Search Console (after deployment)

---

## Conclusion

The CLS optimization fixes address the primary sources of layout shift identified in the audit. The expected improvement from **0.42 to ~0.09** should bring the site into the "Good" range for Core Web Vitals.

**Note:** Actual CLS may vary based on:
- Device type and screen size
- Network conditions
- Browser font rendering
- Third-party script loading order

After deployment, monitor the Vercel Speed Insights dashboard to confirm the actual improvement.
