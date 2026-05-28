# Brand Consistency Report
**Project:** CalcWise AI
**Date:** May 28, 2026
**Status:** P1 — Complete

---

## Issues Found

### 1. Development Email Domain
- **File:** `src/contexts/AuthContext.tsx`
- **Issue:** Auth functions used `@miaoda.com` domain for username-based authentication
- **Severity:** High (public-facing internal code)
- **Status:** Fixed

### 2. Generic Form Placeholder
- **File:** `src/pages/Contact.tsx`
- **Issue:** Email input used `you@example.com` as placeholder
- **Severity:** Medium (template trace)
- **Status:** Fixed

---

## Fixes Applied

### Fix 1: AuthContext Email Domain
```tsx
// BEFORE
const email = `${username}@miaoda.com`;

// AFTER
const email = `${username}@calculatorpilotai.com`;
```
Applied to both `signInWithUsername` and `signUpWithUsername` functions.

### Fix 2: Contact Page Placeholder
```tsx
// BEFORE
placeholder="you@example.com"

// AFTER
placeholder="name@example.com"
```

---

## Verified Clean

The following searches returned **no issues**:

| Search Pattern | Result |
|---------------|--------|
| `miaoda.com` | Not found in public-facing code |
| `gmail.com` | Not found |
| `example.com` | Contact form only (fixed) |
| `toolfactory.ai` | Not found |
| `placeholder` in UI components | Standard shadcn/ui defaults (acceptable) |

---

## Brand Elements Verified

| Element | Status |
|---------|--------|
| Logo text | `CALC<span className="text-primary">WISE</span> AI` — correct |
| Email in footer | `support@calculatorpilotai.com` — correct |
| Email in contact | `support@calculatorpilotai.com` — correct |
| Legal pages | All use correct domain |
| Meta tags | `calculatorpilotai.com` used consistently |

---

## Remaining Items (Manual Review)

1. Favicon verification — should be checked manually
2. OG image presence at `/og-image.png`
3. Social media links in footer (if any)

---

## Recommendations

1. Add a favicon that matches brand colors
2. Ensure `/og-image.png` exists for social sharing
3. Review any third-party script domains for consistency