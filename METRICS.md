# Metrics — Ledgerly

## North Star Metric

**Audits Completed with Shareable Report Generated**

### Why This Metric

The North Star for Ledgerly at this stage is not revenue, signups, or even leads captured. It's **completed audits that produce a shareable report**.

Here's why:

1. **Completed audits = value delivered.** A visitor who fills out the form but bounces before seeing results got zero value. A visitor who sees their audit results got value whether they give us their email or not.

2. **Shareable reports = distribution.** Every shareable report is a potential acquisition channel. When a user forwards their audit to their CFO or posts it in Slack, that's organic reach we didn't pay for.

3. **Leading indicator of revenue.** Users who complete audits and see meaningful savings ($500+/month) are the ones who convert to Ledgerly consultations. But we can't optimize for consultations booked yet — we don't have enough volume. We can optimize for audit completion.

4. **Captures the full value loop.** The product is not "run an audit." The product is "run an audit, see results, share with stakeholders." The shareable report is the artifact that makes the tool useful beyond the moment of use.

### What This Metric Excludes (Intentionally)

- **Signups / account creation:** We don't require signup to use the tool. Optimizing for signups would push us toward adding friction.
- **Email captures:** Important for lead gen, but secondary. A user who completes an audit without giving their email still got value and might share the report.
- **Time on site:** Irrelevant. We want audits to be fast (2 minutes), not long.
- **Page views:** Vanity metric. 10,000 visitors who bounce is worse than 100 who complete audits.

### Current Target

**Week 1-4:** 50 completed audits  
**Month 2:** 200 completed audits  
**Month 3:** 500 completed audits  

These are conservative. The goal is learning, not growth.

---

## Input Metrics (What Drives the North Star)

These are the 3 metrics that, if improved, will increase completed audits.

### 1. Visitor → Form Start Rate

**Definition:** % of landing page visitors who begin filling out the audit form (enter at least one field)

**Current baseline:** Unknown (need to instrument)  
**Target:** 15-25%

**Why it matters:**  
If visitors land on the page and don't start the form, the problem is either:
- The value proposition isn't clear
- The form looks too long/complex
- They don't trust us yet

**How to improve:**
- A/B test hero copy
- Add "2 minutes, no signup" messaging above the form
- Show an example audit result before the form
- Reduce perceived form length (progressive disclosure)

**How to measure:**
```javascript
// Track when user focuses on first form field
analytics.track('Audit Form Started', {
  source: referrer,
  device: mobile/desktop
});
```

---

### 2. Form Start → Form Submit Rate

**Definition:** % of users who start the form and successfully submit it

**Current baseline:** Unknown (need to instrument)  
**Target:** 60-75%

**Why it matters:**  
If users start the form but don't finish, the problem is:
- Form is too long
- Required fields are unclear
- Validation errors are confusing
- They don't have the data we're asking for

**How to improve:**
- Make fields optional where possible (e.g., "Don't know exact seat count? Estimate.")
- Add inline help text ("What's this?")
- Show progress indicator
- Save form state to localStorage (already implemented)
- Reduce required fields to absolute minimum

**How to measure:**
```javascript
// Track form submission
analytics.track('Audit Form Submitted', {
  providers_selected: ['ChatGPT', 'Cursor'],
  total_monthly_spend: 1200,
  team_size: 15,
  time_to_complete: 120 // seconds
});
```

**Key diagnostic:** Track which field users abandon on. If 40% drop off at "monthly spend," that field is the problem.

---

### 3. Form Submit → Shareable Report Generated Rate

**Definition:** % of submitted audits that successfully generate a shareable report

**Current baseline:** Should be ~100% (technical success rate)  
**Target:** 99%+

**Why it matters:**  
If the audit engine fails, the user got zero value. This is a technical reliability metric.

**Failure modes:**
- Audit engine throws an error (bad input data)
- Anthropic API fails (summary generation)
- Supabase write fails (can't save audit)
- Shareable URL generation fails

**How to improve:**
- Graceful degradation (if Anthropic fails, show templated summary)
- Input validation before submission
- Retry logic on Supabase writes
- Error monitoring (Sentry)

**How to measure:**
```javascript
// Track successful audit generation
analytics.track('Audit Completed', {
  audit_id: 'abc123',
  share_url: 'ledgerly.com/audit/abc123',
  total_savings_monthly: 450,
  total_savings_annual: 5400,
  recommendations_count: 3,
  optimization_score: 73
});

// Track failures
analytics.track('Audit Failed', {
  error_type: 'anthropic_timeout',
  input_data: {...}
});
```

---

## Secondary Metrics (Important but Not North Star)

### Email Capture Rate
**Definition:** % of completed audits where user provides email

**Target:** 30-40%

**Why it matters:** Lead generation. But optimizing for this too early adds friction.

**When to focus on this:** After we hit 200 completed audits/month and understand what savings thresholds drive email capture.

---

### Shareable Report Click-Through Rate
**Definition:** % of shareable report views that result in a new audit started

**Target:** 20-30%

**Why it matters:** This is the viral loop. If shared reports don't drive new audits, the distribution mechanism is broken.

**How to measure:**
```javascript
// Track shareable report views
analytics.track('Shared Report Viewed', {
  audit_id: 'abc123',
  referrer: document.referrer,
  viewer_is_original_user: false
});

// Track if viewer starts their own audit
analytics.track('Audit Started from Shared Report', {
  source_audit_id: 'abc123'
});
```

---

### High-Savings Consultation Booking Rate
**Definition:** % of audits with $500+/month savings that book a Ledgerly consultation

**Target:** 10-15%

**Why it matters:** This is the revenue conversion point. But we need volume first.

**When to focus on this:** After we have 50+ high-savings audits to analyze patterns.

---

## What to Instrument First (Priority Order)

### Week 1: Core Funnel
1. Landing page views
2. Audit form started
3. Audit form submitted
4. Audit completed (shareable report generated)
5. Audit failed (with error type)

**Tool:** Vercel Analytics + custom events

**Why these first:** These are the North Star funnel. Everything else is secondary until we understand this flow.

---

### Week 2: Diagnostic Metrics
6. Form field abandonment (which field do users drop off on?)
7. Time to complete form
8. Audit engine execution time
9. Anthropic API success/failure rate
10. Shareable report views (from shared links)

**Why these second:** These help us diagnose where the funnel is breaking.

---

### Week 3: Growth Metrics
11. Email capture rate (by savings tier: <$100, $100-$500, $500+)
12. Shareable report → new audit conversion
13. Referrer sources (where are visitors coming from?)
14. Device type (mobile vs desktop completion rates)

**Why these third:** These help us understand growth levers, but only matter if the core funnel works.

---

### Month 2: Revenue Metrics
15. Consultation booking rate (for $500+ savings audits)
16. Consultation → credit purchase conversion
17. Average credit purchase value
18. Customer acquisition cost by channel

**Why these last:** Can't optimize revenue until we have volume.

---

## Dashboard (What to Watch Daily)

### The 3 Numbers That Matter (Week 1-4)

1. **Audits completed today:** [X]
2. **Form start → submit rate:** [X]%
3. **Technical success rate (submit → completed):** [X]%

If #1 is growing, we're doing something right.  
If #2 is <50%, the form is too hard.  
If #3 is <95%, we have technical issues.

---

## Pivot Decision Triggers

### When to Pivot the Product

**Trigger 1: Form start rate <5% after 100 landing page visitors**
- **Diagnosis:** Value proposition isn't landing
- **Action:** Rewrite hero copy, add example audit, simplify messaging

**Trigger 2: Form submit rate <30% after 50 form starts**
- **Diagnosis:** Form is too complex or asks for data users don't have
- **Action:** Cut required fields, add "estimate" options, simplify

**Trigger 3: Email capture rate <10% even for $500+ savings audits**
- **Diagnosis:** Users don't trust us or don't see value in saving the report
- **Action:** Improve report quality, add social proof, clarify what happens with email

**Trigger 4: Shared report CTR <5% after 50 shared reports**
- **Diagnosis:** The shared report page isn't compelling enough to drive new audits
- **Action:** Redesign shared report page, add stronger CTA, show example savings

---

## What Success Looks Like (Month 3)

**North Star:** 500 completed audits  
**Input Metrics:**
- Visitor → form start: 20%
- Form start → submit: 65%
- Submit → completed: 98%

**Secondary Metrics:**
- Email capture rate: 35%
- Shared report CTR: 25%
- High-savings consultation booking: 12%

**Revenue Metrics:**
- 10 consultations booked
- 3 credit purchases
- $15k in revenue

**If we hit these numbers:** We have product-market fit for the free tool. Time to scale acquisition.

**If we don't:** Diagnose which part of the funnel is broken and fix it before scaling.

---

## What NOT to Measure (Yet)

- **Daily Active Users (DAU):** This is not a daily-use product. Users audit once per quarter at most.
- **Session duration:** We want audits to be fast, not long.
- **Bounce rate:** Meaningless without context. A user who completes an audit in 2 minutes and leaves is a success.
- **Social media followers:** Vanity metric. Doesn't correlate with audits completed.
- **Email open rates:** Premature. We don't have enough email volume yet.

---

## Instrumentation Code Snippets

### Track Audit Completion
```typescript
// In audit results page
useEffect(() => {
  if (auditData) {
    analytics.track('Audit Completed', {
      audit_id: auditData.id,
      share_url: `${window.location.origin}/audit/${auditData.shareId}`,
      total_savings_monthly: auditData.totalMonthlySavings,
      total_savings_annual: auditData.totalAnnualSavings,
      recommendations_count: auditData.recommendations.length,
      optimization_score: auditData.optimizationScore,
      providers_scanned: auditData.providersScanned,
      high_savings: auditData.totalMonthlySavings >= 500
    });
  }
}, [auditData]);
```

### Track Form Abandonment
```typescript
// In audit form component
const trackFieldFocus = (fieldName: string) => {
  analytics.track('Form Field Focused', {
    field: fieldName,
    form_progress: calculateProgress()
  });
};

const trackFormAbandonment = () => {
  window.addEventListener('beforeunload', () => {
    if (formStarted && !formSubmitted) {
      analytics.track('Form Abandoned', {
        last_field: lastFocusedField,
        fields_completed: completedFields.length,
        time_spent: Date.now() - formStartTime
      });
    }
  });
};
```

---

## Summary

**North Star:** Audits completed with shareable report generated  
**Why:** Measures value delivered + distribution potential  
**Input Metrics:** Visitor→form start, form start→submit, submit→completed  
**Instrument First:** Core funnel (Week 1), diagnostic metrics (Week 2), growth metrics (Week 3)  
**Pivot Triggers:** Form start <5%, submit rate <30%, email capture <10% for high-savings  
**Success (Month 3):** 500 completed audits, 35% email capture, 25% shared report CTR  

**The key insight:** Optimize for completed audits first, leads second, revenue third. The product has to work before we can monetize it.
