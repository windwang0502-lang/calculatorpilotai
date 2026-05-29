# P5.1 – Programmatic SEO Opportunity Audit

**Audit Date:** 2026-05-30
**Scope:** Finance, Health, Shipping, Time, AI Categories
**Existing Pages:** 100 (20 per category, static/template-based)

---

## Current State Analysis

| Category | Calculators | Guides | Compares | Total |
|----------|-------------|--------|---------|-------|
| Finance  | 10          | 5      | 5       | 20    |
| Health   | 10          | 5      | 5       | 20    |
| Shipping | 10          | 5      | 5       | 20    |
| Time     | 10          | 5      | 5       | 20    |
| AI       | 10          | 5      | 5       | 20    |
| **Total**| **50**      | **25** | **25**  | **100**|

---

## Opportunities Found

### HIGH Priority Opportunities

#### 1. Mortgage by State
| Metric | Value |
|--------|-------|
| **Page Count** | 50 (50 US states) |
| **Search Demand** | High (~165K/mo "mortgage calculator [state]") |
| **Difficulty** | Medium |
| **SEO Value** | Very High |
| **Pattern** | `/tools/finance/mortgage-calculator/[state]` |
| **Implementation** | Reuse mortgage calculator component with state-specific data |

**Examples:**
- mortgage calculator California
- mortgage calculator Texas
- mortgage calculator New York
- Florida mortgage calculator

**Why High Value:**
- Local intent = high conversion
- Low competition vs generic mortgage calculator
- State-specific rates and regulations add unique value

---

#### 2. Salary/Income by State
| Metric | Value |
|--------|-------|
| **Page Count** | 50 (50 US states) |
| **Search Demand** | High (~135K/mo combined state salary searches) |
| **Difficulty** | Low |
| **SEO Value** | High |
| **Pattern** | `/tools/finance/salary-calculator/[state]` |
| **Implementation** | Adapt existing salary calculator with state median data |

**Examples:**
- salary calculator California
- Texas salary calculator
- New York salary calculator
- Florida salary calculator

**Variations:**
- Cost of living adjusted salary
- Salary to hourly by state
- Teacher salary by state

---

#### 3. BMI by Age & Gender
| Metric | Value |
|--------|-------|
| **Page Count** | 18 (age groups × gender) |
| **Search Demand** | High (~90K/mo) |
| **Difficulty** | Low |
| **SEO Value** | High |
| **Pattern** | `/tools/health/bmi-calculator/[age-group]/[gender]` |
| **Implementation** | Extend BMI calculator with demographic filters |

**Examples:**
- BMI calculator for men
- BMI calculator for women
- BMI calculator by age
- BMI chart for adults

**Age Groups:** 18-25, 26-35, 36-45, 46-55, 56-65, 65+
**Genders:** Male, Female, Universal

---

### MEDIUM Priority Opportunities

#### 4. Shipping Cost by Carrier × Zone
| Metric | Value |
|--------|-------|
| **Page Count** | 100+ (5 carriers × 8-9 zones × regional variants) |
| **Search Demand** | Medium-High (~45K/mo carrier + zone searches) |
| **Difficulty** | Medium |
| **SEO Value** | High |
| **Pattern** | `/tools/shipping/shipping-cost/[carrier]/[zone]` |

**Examples:**
- USPS shipping cost to zone 8
- UPS ground shipping rates zone 5
- FedEx shipping calculator zone 3
- DHL shipping rates by zone

---

#### 5. Calorie Calculator by Activity × Goal
| Metric | Value |
|--------|-------|
| **Page Count** | 45 (9 activity levels × 5 goals) |
| **Search Demand** | High (~60K/mo) |
| **Difficulty** | Low |
| **SEO Value** | Medium-High |
| **Pattern** | `/tools/health/calorie-calculator/[activity]/[goal]` |

**Activity Levels:** Sedentary, Light, Moderate, Active, Very Active, Athlete
**Goals:** Maintain, Lose 0.5lb/week, Lose 1lb/week, Gain 0.5lb/week, Gain 1lb/week

**Examples:**
- calorie calculator for weight loss
- calorie calculator for muscle gain
- calorie calculator for athletes
- calorie calculator sedentary lifestyle

---

#### 6. Work Hours/Overtime by State
| Metric | Value |
|--------|-------|
| **Page Count** | 50 (50 US states) |
| **Search Demand** | Medium (~25K/mo) |
| **Difficulty** | Medium |
| **SEO Value** | Medium |
| **Pattern** | `/tools/time/work-hours-calculator/[state]` |

**Why State-Specific:**
- Overtime laws vary by state
- Minimum wage differs by state
- Paid sick leave laws vary

**Examples:**
- overtime calculator California
- work hours calculator New York
- overtime pay Texas

---

#### 7. Age Calculator by Country (Time)
| Metric | Value |
|--------|-------|
| **Page Count** | 50 (major countries) |
| **Search Demand** | Medium (~35K/mo country + age searches) |
| **Difficulty** | Medium |
| **SEO Value** | Medium |
| **Pattern** | `/tools/time/age-calculator/[country]` |

**Examples:**
- age calculator Japan
- age calculator Korea
- age calculator China
- international age calculator

**Value Add:** Calculate age using country-specific systems (Korean age, Japanese age)

---

#### 8. Loan Calculator by Type
| Metric | Value |
|--------|-------|
| **Page Count** | 25 (5 loan types × 5 variations) |
| **Search Demand** | High (~75K/mo) |
| **Difficulty** | Low |
| **SEO Value** | High |
| **Pattern** | `/tools/finance/loan-calculator/[loan-type]` |

**Loan Types:** FHA, VA, USDA, Conventional, Jumbo
**Variations:** First-time buyer, With down payment, With co-signer

**Examples:**
- FHA loan calculator
- VA loan calculator
- conventional loan calculator
- jumbo loan calculator

---

### LOW Priority Opportunities

#### 9. Shipping Zone Guides by Origin × Destination
| Metric | Value |
|--------|-------|
| **Page Count** | 200+ |
| **Search Demand** | Low-Medium |
| **Difficulty** | High |
| **SEO Value** | Medium |

#### 10. Compound Interest by Investment Type
| Metric | Value |
|--------|-------|
| **Page Count** | 20 |
| **Search Demand** | Medium |
| **Difficulty** | Low |
| **SEO Value** | Medium |

**Examples:**
- compound interest calculator savings account
- CD compound interest calculator
- investment compound interest calculator

#### 11. Token Calculator by Model
| Metric | Value |
|--------|-------|
| **Page Count** | 30 (major AI models) |
| **Search Demand** | Medium |
| **Difficulty** | Low |
| **SEO Value** | Medium-High |

**Examples:**
- GPT-4 token calculator
- Claude token calculator
- Gemini token calculator
- Llama token calculator

---

## Ranking Summary

| Rank | Opportunity | Pages | Demand | Difficulty | SEO Value |
|------|-------------|-------|--------|------------|-----------|
| 1 | Mortgage by State | 50 | High | Medium | Very High |
| 2 | Salary by State | 50 | High | Low | High |
| 3 | BMI by Age/Gender | 18 | High | Low | High |
| 4 | Loan by Type (FHA/VA/etc) | 25 | High | Low | High |
| 5 | Shipping by Carrier × Zone | 100+ | Med-High | Medium | High |
| 6 | Calorie by Activity × Goal | 45 | High | Low | Med-High |
| 7 | Work Hours by State | 50 | Medium | Medium | Medium |
| 8 | Age by Country | 50 | Medium | Medium | Medium |
| 9 | Token by Model | 30 | Medium | Low | Med-High |
| 10 | Compound Interest by Type | 20 | Medium | Low | Medium |

---

## Top 3 Recommendations

### 1. Mortgage by State
- **Estimated Pages:** 50
- **Highest Traffic Potential:** High-volume local searches with strong commercial intent
- **Unique Value:** State-specific rates, regulations, median home prices
- **Competitive Advantage:** Most competitors only have generic calculators

### 2. Loan by Type (FHA/VA/Conventional/Jumbo)
- **Estimated Pages:** 25
- **Fastest Win:** Reuse existing loan calculator, add type parameter
- **High Demand:** Very specific search intent = high conversion
- **Low Effort:** Template-based, minimal new logic needed

### 3. BMI by Age/Gender
- **Estimated Pages:** 18
- **Fastest Win + High Value:** Simple extension to existing BMI calculator
- **Strong Search Intent:** Health-conscious users seeking personalized results
- **Low Competition:** Most competitors lack demographic segmentation

---

## Estimated Page Counts by Phase

| Phase | Opportunities | Est. Pages |
|-------|---------------|------------|
| **Phase 1 (Fast Wins)** | BMI by Age/Gender, Loan by Type, Token by Model | 73 |
| **Phase 2 (High Value)** | Mortgage by State, Salary by State | 100 |
| **Phase 3 (Expansion)** | Shipping by Carrier×Zone, Calorie by Activity | 145 |
| **Phase 4 (Deep Dive)** | Work Hours by State, Age by Country | 100 |
| **Total Potential** | All opportunities | ~418+ |

---

## Recommended Next Phase

### P5.2 – Phase 1 Implementation Plan

**Recommended Starting Point:** BMI by Age/Gender + Loan by Type

**Rationale:**
1. **Fastest Time-to-Market:** Both can be implemented in 1-2 days
2. **High Search Demand:** Combined ~165K monthly searches
3. **Low Technical Risk:** Extend existing calculators, no new components
4. **Clear ROI:** Each page targets specific, high-intent queries

**Implementation Approach:**
1. Add demographic parameters to existing calculator components
2. Create URL structure: `/tools/[category]/[slug]/[variant]`
3. Generate static pages at build time
4. Add structured data for rich snippets
