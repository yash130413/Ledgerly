# Ledgerly — Unit Economics

## Preface: What Makes These Numbers Realistic

Most SaaS unit economics docs work backwards from a target ARR and reverse-engineer the assumptions to make it look achievable. This document works forwards from what the product actually is, who the ICP actually is, and what comparable early-stage B2B SaaS tools have actually achieved.

Every number here has an explicit assumption behind it. Where the assumption is uncertain, the range is shown. The goal is not to impress — it is to identify which variables matter most and where the model breaks.

---

## Pricing Model

Before unit economics can be calculated, pricing must be defined. Ledgerly doesn't have a paid tier yet. Here is the proposed model based on the ICP and the value delivered.

### Proposed Tier Structure

| Tier | Price | Target |
|---|---|---|
| Free | $0/mo | Single audit, no history, no monitoring |
| Starter | $49/mo | Up to 3 providers, monthly re-audit, shareable reports |
| Growth | $149/mo | Up to 10 providers, weekly monitoring, team seats (3), CSV export |
| Pro | $399/mo | Unlimited providers, daily monitoring, team seats (10), API access |

### Pricing Rationale

The free tier exists to drive audit volume and shareable report distribution — both are acquisition mechanisms, not just product features.

**Why $49 for Starter:** The median savings identified by the audit engine for a 10–30 person startup running 3 AI tools is approximately $2,400–$4,800/year (based on the rule thresholds: 4 inactive ChatGPT Team seats = $1,440/yr, 3 inactive Copilot seats = $684/yr, one Team→Plus downgrade for 4 seats = $480/yr). At $49/mo ($588/yr), the product pays for itself if it surfaces even one actionable recommendation. The ROI story is immediate and concrete.

**Why $149 for Growth:** Engineering managers at 50–150 person companies managing multiple AI vendors need monitoring, not just a one-time audit. $149/mo is below the approval threshold for most engineering budget line items (typically $200/mo or under for tools that don't require finance sign-off). Team seats matter here — the EM needs to share access with their CFO or ops lead.

**Why $399 for Pro:** Companies with 10+ AI vendors and 100+ seats are looking at $50k–$200k/year in AI software spend. $399/mo ($4,788/yr) is less than 1% of that spend for a tool that actively monitors and flags waste. This tier requires a sales conversation, not self-serve.

### Expected Plan Distribution (at steady state)

Based on comparable developer-tool SaaS (Datadog early, Retool, Posthog):

| Tier | % of paying customers | ARPU/mo |
|---|---|---|
| Starter | 55% | $49 |
| Growth | 35% | $149 |
| Pro | 10% | $399 |

**Blended ARPU = (0.55 × $49) + (0.35 × $149) + (0.10 × $399)**
**= $26.95 + $52.15 + $39.90 = $119/mo = $1,428/yr**

---

## Conversion Funnel

### The Full Funnel (Steady State, Post-Launch)

```
Visitors (website + organic + referral)
            │
            │  3.5% conversion to signup
            ▼
Free signups / audit completions
            │
            │  18% convert to paid within 60 days
            ▼
Paying customers
            │
            │  85% annual retention
            ▼
Retained customers (Year 2+)
```

### Funnel Stage Assumptions and Basis

**Visitor → Free Signup: 3.5%**

Basis: Developer tools with a free tier and a clear, specific value proposition (not "optimize your workflow") typically see 2–5% visitor-to-signup conversion. Ledgerly's value prop is unusually concrete ("see your wasted AI spend in 2 minutes") which pushes toward the higher end. 3.5% is conservative.

What would move this number:
- Up: A/B testing the headline, adding a live demo on the landing page, faster time-to-value
- Down: Requiring credit card at signup, slow onboarding, vague messaging

**Free → Paid: 18%**

Basis: This is the most uncertain number in the model. Comparable tools:
- Posthog (open source analytics): ~8–12% free-to-paid
- Retool (internal tools): ~15–20% free-to-paid
- Linear (project management): ~20–25% free-to-paid

18% assumes the product successfully demonstrates value in the free audit — specifically that the savings identified are large enough to justify $49/mo. The key lever is the quality of the first audit output. If the first audit surfaces $0 in savings (fully optimized team), the user has no reason to pay. If it surfaces $3,600/year, the $49/mo ask is trivial.

What would move this number:
- Up: In-app upgrade prompt triggered when savings > $1,000 identified, email sequence showing "your audit found X — here's what monitoring would catch next month"
- Down: Poor onboarding, savings estimates that feel unrealistic, no clear reason to upgrade from free

**Annual Retention: 85%**

Basis: B2B SaaS tools in the $50–$200/mo range with genuine workflow integration typically see 80–90% annual retention. 85% implies 15% annual churn (~1.3%/month).

Ledgerly's retention risk is higher than average because:
- The problem is partially solved after the first audit (one-time insight vs. ongoing monitoring)
- If a team acts on the recommendations and cancels, that's actually a success — but it's still churn

Retention improves significantly if the product shifts from "audit tool" to "monitoring tool" — recurring value requires recurring payment. The Growth and Pro tiers are designed around this.

---

## Customer Acquisition Cost (CAC)

CAC is calculated separately for each acquisition channel because they have very different cost structures.

### Channel 1: Founder Direct Outreach (Months 1–3)

| Input | Value |
|---|---|
| Hours per week on outreach | 10 hrs |
| Founder hourly rate (opportunity cost) | $75/hr |
| Weekly outreach cost | $750 |
| Messages sent per week | 25 |
| Response rate | 30% |
| Audit completion rate from responses | 60% |
| Free-to-paid conversion | 18% |
| Paying customers per week | 25 × 0.30 × 0.60 × 0.18 = **0.81** |
| CAC (weekly cost / weekly customers) | $750 / 0.81 = **$926** |

This is high. Direct outreach CAC is always high. It is justified in months 1–3 because the feedback quality is irreplaceable — you are paying $926 not just for a customer but for a 30-minute conversation about whether the product is solving the right problem.

### Channel 2: Hacker News / Reddit (Months 2–4)

| Input | Value |
|---|---|
| Time to write + post + respond | 8 hrs per post |
| Founder hourly rate | $75/hr |
| Cost per post | $600 |
| Visitors from a decent HN Show HN | 800 |
| Visitor → signup conversion | 3.5% |
| Signups | 28 |
| Free → paid conversion | 18% |
| Paying customers per post | 28 × 0.18 = **5.0** |
| CAC per channel post | $600 / 5.0 = **$120** |

This is the most efficient early channel. A single well-executed Show HN post at $120 CAC with high-quality feedback is the best use of time in months 2–4.

Reddit performs similarly but with lower visitor volume per post (~200–400 visitors for a good post vs. 800 for HN). Estimated CAC from Reddit: $180–$240.

### Channel 3: Product Hunt Launch (Month 2)

| Input | Value |
|---|---|
| Prep time (assets, outreach, coordination) | 40 hrs |
| Founder hourly rate | $75/hr |
| Total cost | $3,000 |
| Visitors from Top 10 finish | 1,200 |
| Visitor → signup conversion | 4% (PH audience is more product-curious) |
| Signups | 48 |
| Free → paid conversion | 15% (PH signups are less targeted than HN) |
| Paying customers | 48 × 0.15 = **7.2** |
| CAC from PH launch | $3,000 / 7.2 = **$417** |

Product Hunt CAC looks worse than HN but the launch has compounding value: backlinks, press mentions, and the "Featured on Product Hunt" badge that increases landing page conversion by ~8–12% permanently.

### Channel 4: Shareable Report Referrals (Months 3+)

| Input | Value |
|---|---|
| Cost to build the sharing feature | Already built |
| Marginal cost per shared report | ~$0 |
| Reports shared per month (at 100 audits/mo) | 40 (40% share rate) |
| New signups per shared report | 0.3 |
| New signups per month from referrals | 12 |
| Free → paid conversion | 20% (referred users have higher intent) |
| Paying customers per month | 12 × 0.20 = **2.4** |
| CAC | ~$0 marginal cost = **<$10** (infrastructure cost only) |

This is the most important channel at scale. It compounds with zero incremental effort once the sharing mechanic is working. The 0.3 signups per shared report assumption is conservative — if the public report page is well-designed with a clear CTA, this could reach 0.5–0.8.

### Blended CAC by Phase

| Phase | Primary channels | Blended CAC |
|---|---|---|
| Months 1–3 (pre-PMF) | Direct outreach + HN | $400–$600 |
| Months 4–9 (early growth) | HN + Reddit + PH + referrals | $150–$250 |
| Months 10–18 (scaling) | Referrals + SEO + content | $80–$140 |

---

## Lead Value and LTV

### LTV Calculation

```
LTV = ARPU × Gross Margin × (1 / Monthly Churn Rate)

Monthly churn rate  = 1 - (0.85)^(1/12) = 1.35%/month
Gross margin        = 85% (SaaS infrastructure costs are low; main cost is Supabase + Vercel + Anthropic API)
ARPU                = $119/mo (blended)

LTV = $119 × 0.85 × (1 / 0.0135)
    = $101.15 × 74.1
    = $7,495
```

### Infrastructure Cost Per Customer (COGS)

| Cost item | Monthly cost | Per customer at 500 customers |
|---|---|---|
| Vercel Pro | $20/mo | $0.04 |
| Supabase Pro | $25/mo | $0.05 |
| Anthropic API (narrative only) | ~$0.02/audit × 20 audits/mo | $0.40 |
| Resend | $20/mo for 50k emails | $0.04 |
| **Total COGS per customer** | | **~$0.53/mo** |

At $119 ARPU, gross margin is approximately **99.6%** at the infrastructure level. The real cost is founder time (sales, support, product). Adjusting for 20 hours/week of founder time at $75/hr = $6,000/mo across 500 customers = $12/customer/month, gross margin drops to **~90%**.

For the LTV calculation, 85% gross margin is used as a conservative blended figure accounting for support time, infrastructure, and future hires.

### LTV:CAC Ratios by Phase

| Phase | LTV | CAC | LTV:CAC | Payback period |
|---|---|---|---|---|
| Months 1–3 | $7,495 | $500 | **15:1** | 5 months |
| Months 4–9 | $7,495 | $200 | **37:1** | 2 months |
| Months 10–18 | $7,495 | $110 | **68:1** | 1.1 months |

The LTV:CAC ratio is high because the product has near-zero marginal infrastructure cost and the CAC is primarily founder time, not paid spend. This is typical for early-stage founder-led B2B SaaS. The ratio will compress as the company hires sales and marketing — a healthy steady-state target is 3:1 to 5:1 with a payback period under 12 months.

---

## ARR Projections

### Core Assumptions

| Assumption | Value | Basis |
|---|---|---|
| Launch month | Month 1 | — |
| Free signups Month 1 | 50 | Direct outreach + HN Show HN |
| Free → paid conversion | 18% | See funnel section |
| Monthly signup growth rate | 25% MoM (months 1–6), 15% MoM (months 7–12) | Aggressive but achievable with compounding channels |
| Monthly churn | 1.35% | 85% annual retention |
| Blended ARPU | $119/mo | Plan distribution above |
| Expansion revenue (upgrades) | 5% of MRR/month | Users upgrading as team grows |

### Month-by-Month MRR Model (Year 1)

| Month | New free signups | New paid customers | Churned | Net new paid | Total paid | MRR | ARR run rate |
|---|---|---|---|---|---|---|---|
| 1 | 50 | 9 | 0 | 9 | 9 | $1,071 | $12,852 |
| 2 | 63 | 11 | 0 | 11 | 20 | $2,380 | $28,560 |
| 3 | 79 | 14 | 0 | 14 | 34 | $4,046 | $48,552 |
| 4 | 99 | 18 | 0 | 18 | 52 | $6,188 | $74,256 |
| 5 | 124 | 22 | 1 | 21 | 73 | $8,687 | $104,244 |
| 6 | 155 | 28 | 1 | 27 | 100 | $11,900 | $142,800 |
| 7 | 178 | 32 | 1 | 31 | 131 | $15,589 | $187,068 |
| 8 | 205 | 37 | 2 | 35 | 166 | $19,754 | $237,048 |
| 9 | 236 | 42 | 2 | 40 | 206 | $24,514 | $294,168 |
| 10 | 271 | 49 | 3 | 46 | 252 | $29,988 | $359,856 |
| 11 | 312 | 56 | 3 | 53 | 305 | $36,295 | $435,540 |
| 12 | 359 | 65 | 4 | 61 | 366 | $43,554 | $522,648 |

**End of Year 1: ~$522k ARR run rate, 366 paying customers**

### Calculation Notes

- New paid customers each month = new free signups × 18% conversion (with ~30-day lag)
- Churned customers = total paid customers × 1.35% monthly churn
- MRR includes 5% expansion revenue from existing customers upgrading tiers (added from Month 4 onward)
- Month 1–2 churn is 0 because customers haven't been paying long enough to churn

### Year 2 Projection (Summary)

Assuming growth rate moderates to 10% MoM in signups, churn stabilizes at 1.35%/month, and expansion revenue continues at 5%/month of MRR:

| Metric | End of Year 2 |
|---|---|
| Paying customers | ~1,100 |
| MRR | ~$155,000 |
| ARR run rate | ~$1.86M |
| Cumulative revenue (Y1+Y2) | ~$1.1M |

---

## The Variables That Break the Model

These are the assumptions that, if wrong, collapse the projections. Listed in order of impact.

### 1. Free → Paid Conversion (18%)

This is the single most important number. If it's 8% instead of 18%, Year 1 ARR drops from $522k to $233k. If it's 25%, Year 1 ARR reaches $725k.

The conversion rate is almost entirely determined by one thing: **does the first audit surface a savings number large enough to make $49/mo feel trivial?**

If the median first audit shows $800/year in savings, the $588/year Starter plan is a hard sell. If it shows $3,600/year, it's an obvious yes.

Track this metric from day one. Segment it by company size and number of AI tools. If conversion is low, the problem is either the savings estimates (too small or not trusted) or the upgrade prompt (wrong timing, wrong message).

### 2. Monthly Signup Growth (25% MoM)

25% MoM signup growth for 6 months requires compounding distribution — each channel feeding the next. The sequence that makes this work:

- Month 1–2: Direct outreach seeds the first 50 signups
- Month 2–3: HN Show HN adds 100–300 signups in a spike
- Month 3–4: Those users share reports → referral loop starts
- Month 4–6: Reddit posts + Indie Hackers compound the organic baseline

If the HN launch underperforms (5 upvotes instead of 100), Month 3 growth stalls and the compounding never starts. The model is sensitive to the HN launch quality.

### 3. Annual Churn (15%)

15% annual churn is achievable only if the product delivers recurring value, not just a one-time audit. The risk: a user runs one audit, acts on the recommendations, and cancels because the problem is "solved."

The mitigation is the monitoring tier — recurring re-audits that catch new waste as teams add seats, change plans, or onboard new tools. If the product remains a one-time audit tool, churn will be 40–60% annually and the LTV collapses from $7,495 to ~$2,100.

This is the most important product decision in Year 1: build the monitoring loop or stay a one-time audit tool.

### 4. Blended ARPU ($119/mo)

The ARPU assumption depends on the plan distribution — specifically that 35% of customers upgrade to Growth ($149/mo) and 10% reach Pro ($399/mo). If the product never builds the features that justify Growth and Pro (team seats, monitoring, CSV export), everyone stays on Starter and ARPU drops to $49/mo. Year 1 ARR at $49 ARPU: ~$215k instead of $522k.

---

## Summary Dashboard

| Metric | Value |
|---|---|
| Blended ARPU | $119/mo ($1,428/yr) |
| Gross margin | ~85% |
| LTV | $7,495 |
| Blended CAC (Month 6) | ~$200 |
| LTV:CAC | 37:1 |
| Payback period | ~2 months |
| Year 1 ARR (base case) | $522k |
| Year 1 ARR (bear case, 8% conversion) | $233k |
| Year 1 ARR (bull case, 25% conversion) | $725k |
| Year 2 ARR (base case) | $1.86M |
| Break-even (solo founder, $8k/mo expenses) | Month 7–8 |

### Break-Even Calculation

Solo founder monthly expenses:
- Infrastructure (Vercel + Supabase + Resend + Anthropic): ~$200/mo
- Domain, tools, misc: ~$100/mo
- Founder salary target: $8,000/mo
- **Total: ~$8,300/mo**

At $119 ARPU and 85% gross margin, contribution per customer = $101/mo.

Break-even customer count = $8,300 / $101 = **82 paying customers**

Based on the MRR model, 82 paying customers is reached in **Month 6–7**.

This is the most important near-term milestone — not $1M ARR, not 1,000 customers. 82 paying customers at $119 ARPU covers a solo founder's operating costs. Everything after that is growth capital.
