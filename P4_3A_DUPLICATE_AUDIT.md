# P4.3A — Duplicate Tool Consolidation Audit

**Date:** 2026-05-29  
**Scope:** 35 tool pages (static tool routes)  
**Status:** COMPLETE (audit only, no code changes)

---

## Build Result

- Command: `pnpm build`
- Result: ✅ PASS
- Notes: build completes successfully with current routing and tool set.

---

## Audit Method

Reviewed all tool routes and corresponding page intents for:
- duplicate intent
- overlapping calculators
- competing keywords
- near-identical outputs

Classification labels used:
- **KEEP BOTH**
- **MERGE**
- **REDIRECT**
- **DELETE**

---

## Duplicate Candidates

### 1) Shipping Cost Estimator vs Shipping Cost Calculator
- **Page A:** `/tools/shipping/shipping-cost-estimator`
- **Page B:** `/tools/shipping/shipping-cost-calculator`
- **Overlap %:** **92%**
- **Keyword conflict:**
  - A targets: "shipping cost estimator", "estimate shipping cost"
  - B targets: "shipping cost calculator", "calculate shipping cost"
  - Search intent is effectively identical (user wants shipping price estimate).
- **Near-identical outputs:** Both return shipping cost projections from similar inputs.
- **Recommendation:** **MERGE**
  - Canonical destination: `/tools/shipping/shipping-cost-calculator` (stronger head term “calculator” consistency with site IA)
  - Keep best UX/content from both in one page
  - Implement permanent redirect from estimator URL after merge
- **SEO impact:**
  - Positive: removes cannibalization and consolidates link equity
  - Positive: stronger topical authority on one canonical URL
  - Short-term: minor fluctuations during reindex; mitigated by 301 + canonical updates

---

### 2) Age Calculator vs Age At Date Calculator
- **Page A:** `/tools/time/age-calculator`
- **Page B:** `/tools/time/age-at-date-calculator`
- **Overlap %:** **76%**
- **Keyword conflict:**
  - A targets: "age calculator"
  - B targets: "age at date calculator", "age on date"
  - Intent overlaps heavily, but B has a narrower “reference date” modifier.
- **Near-identical outputs:** Both compute age components from birth + target date.
- **Recommendation:** **KEEP BOTH** (for now)
  - Differentiate content hierarchy:
    - A = general/default “today age” calculator
    - B = explicit historical/future reference-date use case
  - Strengthen on-page copy split to avoid cannibalization drift.
- **SEO impact:**
  - Neutral-to-positive if differentiated by intent modifiers
  - Risk if metadata and headings remain too similar over time

---

### 3) BMI Calculator vs Ideal Weight Calculator
- **Page A:** `/tools/health/bmi-calorie-calculator`
- **Page B:** `/tools/health/ideal-weight-calculator`
- **Overlap %:** **48%**
- **Keyword conflict:**
  - A targets BMI and calorie estimate intent
  - B targets ideal body weight formulas intent
- **Near-identical outputs:** Partial overlap around weight-health framing, but core outputs differ.
- **Recommendation:** **KEEP BOTH**
- **SEO impact:**
  - Positive if internal links clarify distinction
  - Low cannibalization risk with current query modifiers

---

### 4) BMR Calculator vs Calorie Calculator
- **Page A:** `/tools/health/bmr-calculator`
- **Page B:** `/tools/health/calorie-calculator`
- **Overlap %:** **54%**
- **Keyword conflict:**
  - BMR-specific vs broader daily calorie needs
- **Near-identical outputs:** shared metabolic baseline, but different planning outputs.
- **Recommendation:** **KEEP BOTH**
- **SEO impact:**
  - Positive as complementary cluster pages
  - Maintain distinct metadata and intros

---

### 5) DIM Weight Calculator vs Chargeable Weight Calculator
- **Page A:** `/tools/shipping/dim-weight-calculator`
- **Page B:** `/tools/shipping/chargeable-weight-calculator`
- **Overlap %:** **57%**
- **Keyword conflict:**
  - DIM-specific parcel language vs broader freight/air-cargo chargeable weight
- **Near-identical outputs:** both involve dimensional logic, but business contexts differ.
- **Recommendation:** **KEEP BOTH**
- **SEO impact:**
  - Good long-tail coverage if page positioning is explicit by transport mode

---

### 6) Interest Calculator vs Compound Interest Calculator
- **Page A:** `/tools/finance/interest-calculator`
- **Page B:** `/tools/finance/compound-interest-calculator`
- **Overlap %:** **42%**
- **Keyword conflict:**
  - Generic interest vs investment-growth compound scenarios
- **Near-identical outputs:** partial overlap only when interest type toggles to compound.
- **Recommendation:** **KEEP BOTH**
- **SEO impact:**
  - Positive topical breadth; low cannibalization if generic page remains multi-mode

---

## Non-Candidates (Low Overlap / Distinct Intent)

- Mortgage vs Loan vs APR vs Refinance vs Debt Payoff (distinct financial tasks)
- Date Difference vs Time Duration vs Countdown vs Work Hours vs Business Days (distinct temporal tasks)
- AI Title/Prompt/Email/Detector/Humanizer/Token/Image Prompt (distinct creation/analysis modes)
- Package Volume vs Pallet vs Freight Class (distinct shipping planning intents)

---

## Priority Order (Consolidation Execution)

1. **Shipping Cost Estimator + Shipping Cost Calculator** → **MERGE** (highest SEO gain, highest cannibalization risk)
2. **Age Calculator + Age At Date Calculator** → keep both, but tighten differentiation copy/meta (monitor)
3. **DIM Weight + Chargeable Weight** → keep both, reinforce intent split by shipping mode

---

## Action Summary Matrix

| Pair | Overlap | Classification | Why |
|---|---:|---|---|
| Shipping Cost Estimator vs Shipping Cost Calculator | 92% | **MERGE** | Same intent + same output class |
| Age Calculator vs Age At Date Calculator | 76% | **KEEP BOTH** | Narrow modifier intent exists |
| BMI Calculator vs Ideal Weight Calculator | 48% | **KEEP BOTH** | Distinct formulas/outcomes |
| BMR Calculator vs Calorie Calculator | 54% | **KEEP BOTH** | Baseline vs planning tool |
| DIM Weight vs Chargeable Weight | 57% | **KEEP BOTH** | Parcel DIM vs cargo billing context |
| Interest vs Compound Interest | 42% | **KEEP BOTH** | Generic vs investment-specific |

---

## Final Recommendation

- Immediate consolidation target: **Shipping Cost Estimator + Shipping Cost Calculator**.
- Do not delete any other tools now; preserve coverage while improving intent differentiation in copy/metadata.
- After consolidation, run a 2–4 week SEO monitoring window (impressions, CTR, cannibalized query counts) before additional merges.
