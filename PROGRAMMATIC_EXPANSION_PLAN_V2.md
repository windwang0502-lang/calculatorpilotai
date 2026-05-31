# PROGRAMMATIC_EXPANSION_PLAN_V2

Date: 2026-05-31
Scope: US + Top 5 English-speaking markets (US, UK, CA, AU, IN, IE)
Planning mode: Research only (no code changes)

## 1) Updated Baseline Metrics

Authoritative baseline from `TOOL_COUNT_AUDIT.md`:

| Metric | Updated Count |
|---|---:|
| Registered Tools | 87 |
| Calculator URLs (sitemap) | 130 |
| Programmatic Pages (SEO inventory) | 314 |
| Guide Pages | 25 |
| Sitemap URLs | 352 |

Duplicate routes check:
- `src/data/tools.ts`: **None**
- `public/sitemap.xml`: **None**

---

## 2) Calculator Gap Analysis (Updated)

### What changed in V2 baseline
- Calculator footprint is now **130** (not 124).
- Programmatic inventory is already large (**314 slugs**) but not all are calculator-intent pages in the active calculator graph.
- Static registry (**87 tools**) is still smaller than calculator sitemap footprint, indicating discoverability and linking logic must remain registry + programmatic aware.

### Remaining strategic gaps by category
- **AI**: good cost tooling; weaker enterprise budgeting, throughput, and optimization variants.
- **Finance**: broad base, but opportunity remains in planning-depth calculators (retirement, affordability, debt, risk).
- **Health**: strongest gap area vs demand breadth (metabolic, training, pregnancy, composition variants).
- **Shipping**: strong DIM base, weaker ecommerce ops and carrier/service-level long-tail.
- **Time**: core date math covered; payroll/scheduling and operational planner intent still sparse.

---

## 3) Recalculated Expansion Targets

## Recommended calculator count
- **Target total calculator pages:** **380–430**
- **Net additions needed:** **250–300** over current 130

Why this target:
- Keeps a quality-first buffer above the 300+ goal.
- Matches current architecture maturity (P4.2A/B/C complete, orphan fix complete).
- Allows full 3-wave rollout while preserving uniqueness controls.

---

## 4) Recalculated Indexed Page Projections

Assumptions:
- New-page indexation rate: **70–80%**
- Current calculator URLs are indexed or indexable baseline in active internal graph

Projections:
- Additional indexed calculator pages from expansion: **175–240**
- Total indexed calculator pages after rollout: **305–370**

---

## 5) Recalculated Organic Traffic Opportunity

US + Top5EN, 12–18 month horizon, blended CTR for positions 3–15:

- **Conservative:** +210k sessions/year
- **Base case:** +390k sessions/year
- **Upside:** +680k sessions/year

Category-level base-case split:

| Category | Base Opportunity (sessions/year) |
|---|---:|
| Finance | 165,000 |
| Health | 85,000 |
| AI | 72,000 |
| Shipping | 40,000 |
| Time | 28,000 |
| **Total** | **390,000** |

---

## 6) Priority Buckets (Same P4.3 Structure)

## P4.3A High Priority (Wave 1)
Goal: fastest impact calculators with strongest transactional/problem-solving intent.

- **Volume target:** 70 pages
- **Primary focus:** Finance affordability/debt + Health metabolic/risk + AI cost/throughput + Shipping carrier-rate + Time payroll/overtime
- **Expected role:** immediate traffic + authority anchors for each category

Representative examples (unchanged intent model):
- Mortgage Affordability, DTI, PMI, Home Equity, Debt payoff variants
- TDEE, heart-rate zones, ovulation, sleep cycle, race predictors
- Token budget, prompt cost optimizer, model comparison, agent run cost
- USPS/FedEx/UPS calculators, zone and fulfillment economics
- Timesheet, overtime, PTO accrual, deadline/workday planners

## P4.3B Medium Priority (Wave 2)
Goal: topical depth and cluster completion around core P4.3A pages.

- **Volume target:** 90 pages
- **Primary focus:** comparison variants, scenario calculators, adjacent planning tools
- **Expected role:** rank support + internal-link reinforcement + broader SERP coverage

Representative direction:
- Finance: annuity/HELOC/dividend/yield/rent-vs-buy variants
- Health: deficit/surplus variants, body-composition method variants
- AI: provider-specific and latency/cost tradeoff variants
- Shipping: cartonization, service-level, pallet/container planning variants
- Time: shift rotation, sprint cadence, SLA/date utility variants

## P4.3C Long-tail Programmatic (Wave 3)
Goal: scale to 380–430 calculator pages with strict anti-duplication controls.

- **Volume target:** 90–140 pages
- **Primary focus:** geo, audience, scenario, and provider/currency variants
- **Expected role:** long-tail acquisition and compounding internal-link graph strength

Generation constraints:
- Unique intro + assumptions + FAQ per page
- Distinct worked examples per variant
- Canonical discipline and slug collision prevention
- Cross-linking to static + high-priority hubs by rule

---

## 7) Updated Category Targets

| Category | Current | Recommended Target | Net Add |
|---|---:|---:|---:|
| AI | 23 | 75 | +52 |
| Finance | 60 | 145 | +85 |
| Health | 20* | 80 | +60 |
| Shipping | 17 | 70 | +53 |
| Time | 10 | 50 | +40 |
| **Total** | **130** | **420** | **+290** |

\*Health has known route/label variation in current registry vs sitemap naming; target is set by opportunity, not current naming artifacts.

---

## 8) Delivery Shape

Recommended phased rollout with quality gates:

- **Wave 1 (P4.3A):** 70 pages
- **Wave 2 (P4.3B):** 90 pages
- **Wave 3 (P4.3C):** 90–140 pages

Total new pages: **250–300**
Projected total calculator pages: **380–430**

---

## 9) Recommended Next Execution Phase

**Execute P4.3A first** with a build target of **70 pages**, then re-audit indexation and internal-link flow before opening P4.3B.

Recommended immediate execution sequence:
1. Finalize the P4.3A 70-page slug list and category ownership.
2. Implement templates/content blocks with strict uniqueness rules.
3. Add sitemap entries and route wiring.
4. Run QA/SEO/internal-link/orphan audits.
5. Launch P4.3A and monitor indexation for 2–4 weeks.
6. Start P4.3B only after P4.3A indexing quality meets threshold.

Success checkpoint to move from P4.3A -> P4.3B:
- Orphan pages = 0
- Internal-link thresholds maintained
- Indexation of new wave >= 70%
- No duplicate-content clusters above acceptable risk threshold
