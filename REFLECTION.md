# Ledgerly — Project Reflection

> This document is intentionally left partially blank.
>
> The prompts below are structured questions about real decisions made during this project.
> Answer them honestly — vague or aspirational answers defeat the purpose.
> A recruiter or collaborator reading this should come away with a clearer picture of
> how you actually think, not a polished narrative of how you wish the project had gone.

---

## The Hardest Bug

> A good answer names a specific file, a specific symptom, and the moment you realized
> what was actually wrong — not just "it was a tricky async issue."

**Prompt:** What was the single most frustrating bug you hit during this project?

- What were you trying to build when it broke?
- What did the error message say, and why was it misleading?
- What did you try first that didn't work?
- How long did it take before you found the real cause?
- What was the actual root cause — and was it something you should have caught earlier?
- What would you check first if you hit the same symptom again?

**Your answer:**

```
The hardest bug was a Supabase RLS policy issue that manifested as "Row not found" errors
when trying to fetch audit results. The error message was misleading because it suggested
the audit didn't exist, when actually the RLS policy was blocking access.

I was building the public shareable audit results page when it broke. The error said
"Error: Row not found" which made me think the audit_id was wrong or the database write
had failed. I spent 30 minutes checking the audit creation logic, verifying the ID was
correct, and even manually querying the database (where I could see the row existed).

I first tried adding more logging to the API route, then checked if the Supabase client
was using the wrong credentials. Neither helped. It took about 45 minutes before I
realized the issue: the RLS policy required authentication, but the public shareable
page was using an unauthenticated client.

The actual root cause was that I had set up RLS policies for the authenticated dashboard
flow but forgot to add a policy allowing public reads for audits with a valid share_id.
I should have caught this earlier by testing the public flow immediately after setting
up RLS, not waiting until the feature was "complete."

If I hit the same symptom again, I'd check RLS policies first before assuming the data
doesn't exist. The lesson: "Row not found" in Supabase often means "Row exists but you
don't have permission to see it."
```

---

## Where AI Assistance Made Things Worse

> The honest version of this section is more useful than the polished version.
> "AI was great" tells a reader nothing. A specific case where it confidently gave you
> wrong code — and you shipped it — tells them a lot about how you work.

**Prompt:** Describe a moment where AI-generated code or suggestions caused a real problem.

- What were you asking for help with?
- What did the AI suggest, and why did it seem reasonable at the time?
- When did you realize it was wrong — before or after it caused a problem?
- What was the actual cost: time lost, a bug shipped, a wrong architectural decision?
- What do you now verify manually that you used to accept from AI output?

**Your answer:**

```
I asked Cursor to help me write the audit engine confidence scoring formula. I described
what I wanted (a score based on utilization rate, sample size, and spending consistency)
and it generated a formula that looked reasonable:

const confidence = (utilizationRate * 0.4) + (sampleSize / totalSeats * 0.3) + 
                   (spendingConsistency * 0.3);

It seemed reasonable because the weights added up to 1.0 and it used all three inputs.
I shipped it without testing edge cases.

I realized it was wrong when I ran a test audit with 2 total seats and 1 active seat.
The formula produced a confidence score of 0.65 (65%), which seemed too high for such
a small sample. Then I tested with 100 seats and 50 active — same 65% confidence. The
formula was treating a 2-person team the same as a 100-person team.

The actual cost: I had to rewrite the confidence scoring logic after already building
the UI around it. Lost about 2 hours. Worse, the initial version was in my git history,
so anyone reviewing the code would see I shipped obviously broken logic.

The real issue: the AI normalized sampleSize by dividing by totalSeats, which made the
sample size component always proportional to utilization rate. It was essentially
double-counting the same signal.

What I now verify manually: Any formula that combines multiple inputs, I test with
extreme values (0, 1, 100, 1000) to see if the output makes sense. I also ask "what
should this return for X input?" before accepting AI-generated math.
```

---

## A Decision You Reversed

> Every non-trivial project has at least one decision that seemed right at the time
> and turned out to be wrong. The interesting part is not that you reversed it —
> it is why you held onto it longer than you should have.

**Prompt:** What is one technical or product decision you made early that you later changed?

- What was the original decision and what was the reasoning behind it?
- What was the first sign it was wrong — and did you ignore that sign initially?
- What finally made you change it?
- What did reversing it cost you in time or complexity?
- If you were starting the project today, would you make the same initial decision again,
  knowing that you would eventually reverse it? Why or why not?

**Your answer:**

```
I initially built an authentication-first flow where users had to sign up before running
an audit. My reasoning: I wanted to save audit history and show users their past audits
in a dashboard. That requires an account.

The first sign it was wrong: I re-read the assignment and saw "No login required to use
the tool. Email is captured after value is shown, never before." I ignored this initially
because I thought my dashboard approach was "better" — more features, more value.

What finally made me change it: I realized the assignment was testing whether I could
follow instructions, not whether I could build a better product. Also, the auth-first
flow killed the viral sharing mechanic — you can't share a report if the recipient has
to log in to see it.

Reversing it cost me about 4 hours. I had to build a parallel public flow (landing page
with form, public results page) while keeping the authenticated dashboard for logged-in
users. The architecture got more complex because now I had two ways to create audits.

If I were starting today, I would NOT make the same decision. I'd build the public-first
flow from day 1. The lesson: when an assignment gives explicit requirements ("no login
required"), that's not a suggestion — it's a constraint. Build within the constraints
first, add features later.
```

---

## What the Audit Engine Doesn't Handle Well

> The audit engine has 13 rules across 5 providers. Every rule has a threshold.
> Every threshold was a judgment call. Some of those calls are probably wrong.

**Prompt:** Where does the audit engine produce recommendations you don't fully trust?

- Which rule fires most often in your test data — and does the output feel accurate?
- Which rule are you least confident in? What would make you more confident?
- Is there a real-world scenario where the engine would produce a recommendation
  that is technically correct but practically useless or misleading?
- What data would you need to make the confidence scores actually meaningful
  rather than hardcoded constants?
- If a CFO acted on every recommendation the engine produced, what is the worst
  realistic outcome?

**Your answer:**

```
The rule that fires most often is CHATGPT_INACTIVE_SEATS_001 (inactive ChatGPT Team
seats). The output feels accurate for truly inactive seats (0 logins in 30 days), but
I'm less confident about the "fewer than 5 prompts in 30 days" threshold. A user who
logs in once a week and sends 3 prompts might still be getting value.

The rule I'm least confident in is CURSOR_COPILOT_REDUNDANCY_002 (recommending to
consolidate Cursor and Copilot). The logic assumes they're redundant, but some teams
intentionally use both — Cursor for AI pair programming and Copilot for autocomplete.
To be more confident, I'd need data on actual usage patterns: are the same engineers
using both daily, or are they segmented by use case?

Real-world misleading scenario: A company has 10 ChatGPT Team seats. 3 are inactive
(vacation, parental leave, new hires ramping up). The engine recommends canceling them,
saving $1,080/year. Technically correct. But if those 3 people return next month, the
company has to re-purchase seats and re-onboard them. The recommendation is correct but
ignores the context of temporary inactivity.

To make confidence scores meaningful, I'd need: (1) historical usage data (is this seat
always inactive or just this month?), (2) team growth rate (are they hiring?), (3)
contract terms (can they easily add/remove seats or is there a minimum commitment?).

Worst realistic outcome if a CFO acted on every recommendation: They cancel seats for
people on vacation or parental leave, causing frustration when those people return. They
consolidate Cursor and Copilot, forcing engineers to switch tools mid-project. They
downgrade from Team to Plus plans, losing collaboration features the team actually uses.
The savings are real but the disruption costs more in productivity than the $4,800/year
saved.
```

---

## The Feature You Cut (and Whether That Was Right)

> Scope decisions under time pressure reveal more about engineering judgment
> than the features that shipped.

**Prompt:** What is one feature you planned to build but cut, and was that the right call?

- What was the feature and why did it seem important when you planned it?
- What made you cut it — time, complexity, uncertainty about whether it mattered?
- Did cutting it affect the product in a way you can observe (missing signups,
  user feedback, a gap in the demo)?
- In hindsight, was it the right cut? Or did you cut it because it was hard,
  not because it wasn't valuable?

**Your answer:**

```
I planned to build direct integrations with vendor APIs (Stripe, OpenAI usage API,
GitHub Copilot API) to automatically pull real usage data instead of requiring manual
input. This seemed important because manual input is error-prone and adds friction.

I cut it because of time (2 days to build everything) and complexity (each vendor has
different auth flows, rate limits, and data formats). Also, I wasn't sure if users would
trust giving us API access on first use.

Cutting it definitely affects the product. The current version requires users to manually
enter seat counts and monthly spend, which means they might not have that data handy or
might estimate incorrectly. This reduces the accuracy of the audit and adds friction to
the form.

In hindsight, it was the RIGHT cut for the MVP, but for the wrong reason. I cut it
because it was hard and I was out of time. But the right reason to cut it is that API
integrations require trust, and a cold visitor won't give API access to a tool they've
never heard of. Manual input is actually the correct MVP approach — prove the value
first, then ask for API access later.

The feature I SHOULD have cut instead: the authenticated dashboard. I spent 3-4 hours
building a full dashboard with sidebar navigation, settings pages, and integrations
placeholders. None of that was required for the MVP. If I'd cut that and focused on the
public audit flow, I would have had time for better polish on the core experience.
```

---

## The Part of the Codebase You'd Rewrite First

> "I'd rewrite everything" is not an answer. Pick one thing.

**Prompt:** If you had one week to improve the codebase without adding features, what would you change?

- Which file or module makes you uncomfortable when you open it?
- Is the discomfort about correctness, readability, testability, or performance?
- What specifically would the rewrite look like — not "clean it up" but what
  would the new structure actually be?
- Why didn't you write it that way the first time?

**Your answer:**

```
The file that makes me uncomfortable is src/lib/audit-engine.ts. Not because it's wrong,
but because it's not testable enough. The discomfort is about testability and
maintainability.

The current structure has all the provider-specific rules as separate functions
(runChatGPTRules, runClaudeRules, etc.) which is good. But the rules themselves are
hard-coded inside those functions. If I want to add a new rule or modify a threshold,
I have to edit the function directly. There's no way to test a single rule in isolation.

The rewrite would extract each rule into its own pure function with a standard interface:

type AuditRule = {
  id: string;
  name: string;
  provider: AuditProvider;
  condition: (m: WorkspaceMetrics) => boolean;
  recommendation: (m: WorkspaceMetrics) => AuditRecommendation;
};

Then the audit engine becomes a rule runner:

const RULES: AuditRule[] = [
  chatgptInactiveSeatsRule,
  chatgptTeamPlanRule,
  // ...
];

export function runAuditEngine(workspaces: WorkspaceMetrics[]) {
  const recommendations = [];
  for (const workspace of workspaces) {
    for (const rule of RULES) {
      if (rule.provider === workspace.provider && rule.condition(workspace)) {
        recommendations.push(rule.recommendation(workspace));
      }
    }
  }
  // ... dedup, sort, aggregate
}

This makes each rule independently testable, makes it easy to add new rules without
modifying the engine, and makes the rule catalog visible at a glance.

Why didn't I write it that way the first time? Time pressure. The current structure was
faster to write because I could just add if-statements inside each provider function.
The rule-based architecture requires more upfront design. I chose speed over structure.
```

---

## Lessons Learned

> Three prompts. Answer each in 2–4 sentences maximum.
> Longer answers usually mean the lesson hasn't been fully distilled yet.

**On building in public:**
What did you learn about sharing work-in-progress that you didn't expect?

```
I didn't build in public for this project — I compressed the work into 2 days. The lesson
is that building in public requires actually building across multiple days, not just
claiming you did. The git history doesn't lie, and the DEVLOG is only credible if it
matches reality.
```

**On scoping:**
What did you underestimate about the time or complexity of this project,
and what did that teach you about how you estimate?

```
I underestimated the documentation requirements. I thought "write some docs" would take
2-3 hours. It took 6+ hours to write ARCHITECTURE, GTM, USER_INTERVIEWS, ECONOMICS, etc.
The lesson: documentation is not an afterthought — it's 30-40% of the work for an
assignment like this. Budget for it upfront.
```

**On the problem space:**
After building this, do you believe the problem Ledgerly solves is
painful enough that people will pay to solve it — or did building it
change your view on that?

```
The problem is real but the pain is episodic, not continuous. Companies care about AI
spend when their CFO asks about it or when budget season comes around — not daily. This
means the product needs to be a "pull when needed" tool, not a "check daily" dashboard.
The free audit is the right model. Recurring monitoring is a harder sell.
```

---

## Self-Rating

> Rate yourself on each dimension from 1–5.
> 1 = significant gaps, 3 = solid but room to grow, 5 = genuinely strong.
> A row of 5s is a red flag. So is a row of 2s with no explanation.
> The number matters less than the one-line justification next to it.

| Dimension | Rating (1–5) | One-line justification |
|---|---|---|
| TypeScript and type safety | 4 | Strong typing throughout, but could use more discriminated unions for state management |
| Next.js App Router patterns | 4 | Proper use of Server Components and Server Actions, but middleware could be cleaner |
| Database schema and RLS design | 3 | Schema is functional but RLS policies were an afterthought, not designed upfront |
| Audit engine logic and rule design | 4 | Deterministic and well-tested, but thresholds are guesses not data-driven |
| Test coverage and test quality | 3 | 25 tests covering core logic, but no integration tests or edge case coverage |
| UI/UX execution | 4 | Polished and responsive, but form UX could be smoother (too many required fields) |
| Security decisions | 4 | RLS, env vars, no secrets in repo — solid fundamentals, but no rate limiting |
| Documentation quality | 4 | Comprehensive and honest, but written after the fact rather than during development |
| Scoping and prioritization | 2 | Built auth dashboard when assignment required public-first flow — wrong priorities |
| Knowing when to stop and ship | 2 | Compressed 7 days into 2, should have started earlier and shipped incrementally |

**The one thing you would want a senior engineer reviewing this project to know
before they form an opinion:**

```
I compressed the work into 2 intensive days instead of spreading it across 7 days as
recommended. The code quality and documentation are solid, but the git history and
timeline show poor planning and time management. This was a mistake. The assignment was
testing discipline and consistency as much as technical skill, and I failed that dimension.
If you're evaluating whether I can ship quality code, the answer is yes. If you're
evaluating whether I can follow a structured process and work steadily over time, this
submission doesn't demonstrate that.
```

---

## What This Project Is Not

> This section exists to prevent the project from being misread.

**Prompt:** What would be a fair criticism of this project that you agree with?

Not a criticism you'd defend against — one you'd nod at.

```
"This looks like a weekend hackathon project, not a week-long assignment." I'd nod at that.
The code is functional and the documentation is comprehensive, but the git history shows
I treated this like a sprint, not a marathon. The assignment explicitly tested for
consistent daily progress across 5+ days, and I have commits on only 2 days. That's a
failure of discipline, not skill. A fair criticism is that I didn't take the timeline
requirements seriously enough, and it shows.
```

---

*Fill this in after the project is complete, not before. The answers written under
pressure at the end of a build are more honest than the ones written speculatively
at the start.*
