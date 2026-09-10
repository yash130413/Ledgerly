# User Interviews — Ledgerly AI Spend Audit

## Interview 1 — Yogesh, Program Manager, Icertis

**Date:** May 26, 2026
**Duration:** 35 minutes  
**Context:** Personal connection and follow-up WhatsApp conversation

### Background
- Works at a large enterprise SaaS company (Icertis)
- Manages cross-functional operational workflows and procurement processes
- Team actively experiments with AI tools for automation and productivity
- Using ChatGPT, Claude, GitHub Copilot, Notion AI across teams
- Estimated monthly AI spend: $3,000–$8,000
- No centralized tracking of AI subscriptions or usage

### Direct Quotes

> "The biggest problem is not the AI cost itself — it's that nobody knows where the money is going."

> "Every team buys tools independently, and leadership gets visibility only after invoices arrive."

> "We don't have a single dashboard for AI subscriptions, usage, or ROI."

> "AI adoption is happening faster than governance."

### Most Surprising Thing
Yogesh revealed that multiple teams inside Icertis were unknowingly paying for overlapping AI tools with duplicate functionality. For example, three different departments had separate ChatGPT Team subscriptions when they could have consolidated under one enterprise plan.

This was a huge insight — the problem isn't just inactive seats, it's **organizational fragmentation** leading to duplicate spend.

### What It Changed About the Design

**Before this interview:** I was focused on individual seat utilization and plan optimization.

**After this interview:** I realized enterprise users need **cross-team visibility**. This led to:

1. Adding duplicate subscription detection as a core audit rule
2. Designing the audit report to show organization-wide spend, not just per-tool breakdowns
3. Adding "consolidation opportunities" as a recommendation category
4. Prioritizing executive-level summaries that leadership can understand at a glance
5. Adding cost trend visualization concepts for future iterations

### Key Insight
Large organizations struggle less with adopting AI tools and more with **tracking, visibility, and governance** of rapidly increasing AI spend. The audit tool needs to surface organizational inefficiencies, not just individual waste.

---

## Interview 2 — Jagbir Singh, AGM, Forza Medi

**Date:** May 26, 2026  
**Duration:** 28 minutes  
**Context:** Family/professional network referral and direct phone discussion

### Background
- Assistant General Manager at Forza Medi (healthcare/medical operations)
- Works in operations and enterprise management
- Company has multiple departments evaluating AI adoption
- Non-technical stakeholder involved in budgeting decisions
- Uses productivity-focused AI solutions selectively
- Estimated monthly AI spend: $1,500–$4,000

### Direct Quotes

> "Finance teams want measurable outcomes before approving more AI spending."

> "Most AI dashboards are too technical for decision-makers."

> "If a tool saves time but nobody can quantify it, leadership loses confidence."

> "We need business insights, not just usage numbers."

### Most Surprising Thing
Jagbir emphasized that leadership teams care more about **measurable business impact** than raw AI usage metrics. He said "showing me that 20 people used ChatGPT 500 times last month doesn't help me — I need to know if that translated to faster project delivery or cost savings."

This was eye-opening because I had been designing the audit output with technical metrics (prompts per user, API calls, etc.) when non-technical decision-makers need **business outcomes**.

### What It Changed About the Design

**Before this interview:** The audit report was full of technical metrics and utilization percentages.

**After this interview:** I realized the language needs to be **business-friendly**. This led to:

1. Simplifying all metric labels — "inactive seats" instead of "utilization rate < 10%"
2. Adding ROI-focused language — "$X saved per year" instead of "Y% optimization"
3. Creating an executive summary section at the top of the audit report
4. Using clean, professional visual hierarchy that looks like a finance report, not a dev tool
5. Removing technical jargon from recommendation titles

### Key Insight
AI spend platforms must communicate **business value clearly to leadership**, not just technical analytics. The audit report is a communication tool for CFOs and VPs, not just for engineering managers.

---

## Interview 3 — Tarun Rohilla, Advisory Lead Solution Advisor, Deloitte

**Date:** May 27, 2026  
**Duration:** 42 minutes  
**Context:** Family/professional network referral and direct phone discussion

### Background
- Advisory Lead Solution Advisor at Deloitte
- Advises enterprise clients on digital transformation and AI adoption
- Works with large-scale enterprise technology ecosystems across multiple industries
- Observes AI tooling decisions at Fortune 500 companies
- Uses ChatGPT Enterprise, Microsoft Copilot, Claude, Gemini, and internal AI solutions
- Estimated enterprise AI spend exposure: $10,000+ monthly across clients

### Direct Quotes

> "AI tooling sprawl is becoming the new SaaS sprawl."

> "Organizations are adopting AI faster than they can govern it."

> "Executives need confidence that AI investments are producing measurable efficiency gains."

> "The companies that win will be the ones that operationalize AI spending intelligently."

### Most Surprising Thing
Tarun explained that many enterprises currently lack **standardized frameworks for evaluating AI ROI and governance maturity**. He said "companies are spending $50k/month on AI tools but have no idea if they're getting $50k of value back — there's no benchmark, no scorecard, no governance model."

This was a critical insight because it validated the need for an **optimization score** and **governance health metrics**, not just cost savings.

### What It Changed About the Design

**Before this interview:** The audit tool was purely focused on cost reduction.

**After this interview:** I realized enterprises need **governance and maturity scoring**. This led to:

1. Adding the "Optimization Score" (0-100) as a key metric in the audit output
2. Designing the audit report to include actionable recommendations, not just passive analytics
3. Prioritizing enterprise-grade dashboard aesthetics (professional, polished, boardroom-ready)
4. Adding confidence scores to recommendations so executives can trust the analysis
5. Noting in ARCHITECTURE.md that future versions should include governance maturity assessments

### Key Insight
The future of AI operations is not just adoption — it is **intelligent management, governance, optimization, and measurable ROI**. The audit tool needs to position itself as a governance platform, not just a cost-cutting tool.

---

## Cross-Interview Patterns

### What All Three Said
1. **Visibility is the core problem** — organizations don't know where AI spend is going
2. **Governance is lagging behind adoption** — tools are being bought faster than they can be managed
3. **Leadership needs business metrics, not technical metrics** — CFOs care about ROI, not API calls
4. **Duplicate spend is a hidden problem** — teams unknowingly buy overlapping tools

### What None of Them Said
- No one mentioned wanting AI-generated recommendations (they want deterministic, explainable logic)
- No one asked about real-time monitoring (they want periodic audits, not live dashboards)
- No one cared about individual user behavior (they care about team-level and org-level trends)

### Biggest Surprise Across All Interviews
The tool is not primarily about **saving money**. It's about **governance, visibility, and confidence**.

Enterprises are willing to spend on AI tools — they just need to know the spend is justified, tracked, and optimized. The audit report is a governance artifact, not just a cost report.

---

## How These Interviews Shaped the Product

| Feature | Why It Exists | Which Interview |
|---|---|---|
| Duplicate subscription detection | Yogesh's team had 3 overlapping ChatGPT subscriptions | Interview 1 |
| Executive summary section | Jagbir needs business-friendly language for leadership | Interview 2 |
| Optimization Score (0-100) | Tarun said enterprises lack governance benchmarks | Interview 3 |
| Simplified metric labels | Jagbir said technical dashboards confuse decision-makers | Interview 2 |
| Confidence scores on recommendations | Tarun said executives need trust in the analysis | Interview 3 |
| Organization-wide spend view | Yogesh said teams buy tools independently with no visibility | Interview 1 |
| Actionable recommendations | Tarun said passive analytics don't drive change | Interview 3 |

---

## What I'd Ask in Future Interviews

1. How do you currently track AI spend across teams? (Spreadsheets? Finance tools? Not at all?)
2. What would make you trust an AI spend audit? (Third-party validation? Case studies? Transparent formulas?)
3. If this tool cost $X/month for recurring audits, would you pay for it?
4. What other categories of spend would you want audited? (SaaS tools? Cloud infrastructure? Design tools?)
5. How often would you run an audit? (Monthly? Quarterly? Only when asked by finance?)

---

## Validation of Core Assumptions

**Assumption 1:** Companies don't track AI tool utilization.  
**Validated:** All three confirmed this. Yogesh said "nobody knows where the money is going," Jagbir said "we don't have visibility," and Tarun said "governance is lagging."

**Assumption 2:** The pain point is significant enough to act on.  
**Validated:** All three said yes. Yogesh's company is spending $3k-8k/month with no tracking, Jagbir's finance team is blocking new AI spend until they get visibility, and Tarun's clients are spending $10k+/month with no ROI framework.

**Assumption 3:** Users will share the audit report with stakeholders.  
**Validated:** Jagbir explicitly said "finance teams want measurable outcomes" and Tarun said "executives need confidence" — both indicating the report will be forwarded to leadership.

**Assumption 4:** Users want AI-generated recommendations.  
**Invalidated:** No one asked for this. They want explainable, deterministic logic. Tarun specifically said "executives need confidence" — black-box AI recommendations would undermine trust.

---

## Conclusion

These three conversations fundamentally shaped the product. The biggest insight: **this is a governance and visibility tool disguised as a spend audit**.

The user running the audit is not the end user of the output. The CFO, VP, or board member reading the forwarded report is the real audience.

Enterprises are adopting AI faster than they can govern it. The audit tool needs to provide:
1. **Visibility** — where is the money going?
2. **Governance** — are we spending intelligently?
3. **Confidence** — can we trust these recommendations?
4. **Action** — what should we do next?

That realization changed everything about how I designed the audit engine, the recommendation format, the optimization score, and the executive summary.
