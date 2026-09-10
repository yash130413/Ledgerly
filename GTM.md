# Ledgerly — Go-To-Market Strategy

## The Honest Starting Point

Most GTM docs for early-stage products are aspirational fiction. This one is not.

Ledgerly is a zero-revenue product at launch. The goal of the first 90 days is not growth — it is **learning whether the problem is painful enough to pay for**. Every tactic below is chosen to answer that question as fast as possible with the least wasted effort.

The product has one structural advantage worth exploiting early: **the audit output is shareable**. Every public report is a distribution artifact. That shapes the entire strategy.

---

## Who Actually Has This Problem Right Now

Not every company with AI subscriptions is a good target. The right early user has a specific profile:

### Primary: The Accidental AI Buyer

A technical founder or engineering lead at a 10–80 person startup who:

- approved ChatGPT Team for the eng team 8 months ago
- then approved Cursor Pro when developers asked
- then approved Claude Pro for a few power users
- has no idea how many people are actually using any of it
- got a question from their CFO or investor about "AI software spend" and couldn't answer it

This person is not looking for enterprise procurement software. They want a fast answer to "are we wasting money here?" They will try a free tool in 10 minutes if it promises a clear output.

**Where to find them:** LinkedIn posts complaining about SaaS costs, X/Twitter threads about AI tooling stacks, YC company directories, Indie Hackers "what's your stack" threads.

### Secondary: The Engineering Manager Under Pressure

An EM at a 50–300 person company who:

- manages 8–20 engineers all on Copilot Business
- suspects half of them barely use it
- has been asked to "find savings" in the next budget cycle
- needs a defensible number to bring to finance, not a gut feeling

This person needs the audit output as a document they can forward. The shareable report format is the product for them.

**Where to find them:** LinkedIn, internal Slack communities, engineering management forums.

### Who to Ignore Early

- Enterprise procurement teams (6-month sales cycles, compliance requirements, not worth it yet)
- Finance teams without a technical co-pilot (they can't evaluate the recommendations)
- Companies with fewer than 3 AI subscriptions (the problem isn't painful enough yet)

---

## The First 100 Users — Exactly How

This is not a funnel. It is a sequence of manual actions.

### Week 1–2: 20 Users from Direct Outreach

**The list:** Build a spreadsheet of 50 founders/EMs who have publicly mentioned AI tooling costs. Sources:

- Search X/Twitter: `"Cursor" "Copilot" "ChatGPT" "spending"` — people complaining about overlapping tools
- Search LinkedIn: `"AI tools" "software spend" "engineering team"` — posts from the last 30 days
- YC company list filtered to B2B SaaS, 10–50 employees, founded 2021–2024
- Indie Hackers "what tools do you use" threads — look for people listing 4+ AI tools

**The message (LinkedIn DM or cold email):**

```
Hey [name] — saw your post about [specific thing they said about AI tooling].

Built a free tool that audits AI software spend across ChatGPT, Claude, Cursor, and Copilot —
surfaces inactive seats, duplicate subscriptions, and estimated savings in about 2 minutes.

No signup required for the first audit. Would genuinely value your feedback if you try it:
[link]

Happy to walk through the output together if useful.
```

What makes this work: it references something specific they said, it's free, it's fast, and it asks for feedback not a sale. The ask is tiny.

**Target:** 50 messages → 15–20 responses → 10–15 completed audits.

### Week 3–4: 30 More Users from Communities

**Reddit — the right way:**

Don't post "I built a thing, check it out." That gets ignored or downvoted.

Instead, post findings. Real examples:

- Post to r/startups: *"We analyzed AI tooling spend patterns across 20 early-stage startups — here's what we found"* — share actual data from the first 15 audits (anonymized). Link to the tool at the bottom as "this is what generated the data."
- Post to r/SideProject: *"Show r/SideProject: I built an AI spend auditor after our own team was paying for Cursor + Copilot for the same 8 engineers"* — personal story, real numbers, honest about what it does and doesn't do.
- Post to r/ExperiencedDevs or r/cscareerquestions: *"How does your team decide which AI coding tools to keep? We found most teams with both Cursor and Copilot use one <20% of the time"* — discussion post, not a product post.

The goal is not to go viral. The goal is 5–10 people per post who DM asking to try it.

**Hacker News — Show HN:**

Timing: Tuesday–Thursday, 9–11am ET. Title matters enormously.

Good titles:
- `Show HN: Ledgerly – audit your team's AI software spend (ChatGPT, Claude, Cursor, Copilot)`
- `Show HN: We built deterministic AI spend audits instead of LLM-generated recommendations`

Bad titles:
- `Show HN: AI-powered spend optimization platform` (sounds like every other SaaS)
- `Show HN: Save money on AI tools` (too vague)

The HN post body should lead with the technical decision — why deterministic rules instead of an LLM generating recommendations. HN readers will engage with that tradeoff. Include a link to the live demo with a pre-filled example audit so people can see output without signing up.

Realistic outcome from a decent Show HN: 50–200 upvotes, 20–40 comments, 100–300 signups over 48 hours. A bad Show HN gets 5 upvotes and dies. Don't launch on HN until the product is genuinely polished.

**Indie Hackers:**

Post a "building in public" update: *"Launched Ledgerly — here's what the first 30 audits taught us about how startups waste AI spend."* Indie Hackers rewards transparency and real numbers. Share the actual data: how many audits run, average savings identified, most common rule triggered, what surprised you.

### Week 5–8: 50 More Users from Product Hunt + Compounding

**Product Hunt launch:**

PH is not a growth channel. It is a credibility checkpoint and a backlink. Treat it that way.

What actually drives PH performance:
1. A hunter with an existing audience (reach out to active hunters 2 weeks before, not the day of)
2. A demo video under 90 seconds that shows a real audit output — not a feature tour
3. A first comment from the maker that's honest: "Here's what we built, here's what it doesn't do yet, here's what we learned from the first 50 users"
4. Personal outreach to your existing 50 users the morning of launch asking them to upvote if they found it useful — not a mass blast, individual messages

What doesn't work: buying upvotes, posting in "upvote exchange" groups, launching without any existing users.

Realistic outcome: Top 5 of the day = 500–1500 new visitors, 50–150 signups. Top 10 = 200–600 visitors, 20–60 signups. Either is fine for the goal.

**The compounding effect:**

By week 6, if 50 audits have been run and shared, those public report URLs are indexed by Google. Someone searching "ChatGPT team seat utilization" or "Cursor vs Copilot cost comparison" may land on a public audit. This is slow but compounds. Optimize the public report pages for these queries.

---

## The Shareable Report as a Distribution Engine

This is the most underutilized part of the product.

Every time someone generates an audit and shares it with their CFO, board, or team, that's a new person seeing the product. The public report page should:

1. Show the full audit output — don't gate it
2. Have a clear CTA at the top: *"Run an audit for your team — free, 2 minutes"*
3. Include the Ledgerly branding prominently but not obnoxiously
4. Be fast — a slow public report page kills the referral loop

The goal is that every shared report generates at least 0.3 new signups on average. At 100 audits shared, that's 30 organic signups with zero additional effort.

---

## What to Say (and What Not to Say)

**Positioning that works:**

> "Ledgerly audits your AI software spend across ChatGPT, Claude, Cursor, and Copilot — surfaces inactive seats, duplicate subscriptions, and estimated annual savings in 2 minutes."

This works because it's specific, it names the tools people actually use, and it promises a concrete output in a concrete time.

**Positioning that doesn't work:**

> "AI-powered spend optimization platform for modern engineering teams"

This sounds like every other SaaS. It triggers no recognition of a specific pain.

**The number that matters most in messaging:**

Lead with annual savings, not monthly. "$4,800/year in identified savings" lands harder than "$400/month." Finance brains think annually.

**What to avoid:**

- Claiming AI generates the recommendations (it doesn't, and technically sophisticated users will distrust it if you imply it)
- Overstating savings estimates — conservative numbers that prove out build more trust than aggressive numbers that don't
- "We help companies save money on AI" — too generic, no specificity about which AI or how

---

## Channels Ranked by Expected ROI (First 90 Days)

| Channel | Effort | Expected users | Quality of feedback |
|---|---|---|---|
| Direct founder outreach | High | 15–25 | Very high |
| Reddit (findings-first posts) | Medium | 20–40 | High |
| Hacker News Show HN | Medium | 30–150 | Very high |
| Indie Hackers build-in-public | Low | 10–20 | High |
| Product Hunt launch | High | 30–100 | Medium |
| Shareable report referrals | Low (setup) | Compounds | Medium |
| SEO | Low (setup) | 0 in 90 days | — |
| Paid ads | — | Skip | — |

Paid ads are not in the plan. At this stage, paid acquisition before product-market fit is burning money to learn things you could learn for free through direct outreach.

---

## The Feedback Loop That Matters

The first 100 users are not a revenue target. They are a research panel.

After every audit, send a single-question follow-up (email or in-app):

> "Did the savings estimate feel realistic for your team? Yes / No / Somewhat — and why?"

This one question tells you:
- Whether the rule thresholds are calibrated correctly
- Whether users trust the output
- What objections to address in the product copy

Track which rules fire most often. If `CHATGPT_INACTIVE_SEATS_001` fires in 80% of audits, that's the headline feature. If `CURSOR_COPILOT_REDUNDANCY_002` generates the most "wow, I didn't realize" reactions, that's the marketing angle.

---

## The Risks Worth Taking Seriously

**Risk 1: The problem feels real but isn't urgent enough to act on**

Many teams will look at a $3,600/year savings estimate and think "interesting" but not change anything. The product needs to make the action obvious — not just surface the insight but tell them exactly what to do (cancel these seats, downgrade this plan, consolidate these vendors).

Mitigation: The recommendation field in every audit output should be a specific action, not a vague suggestion. "Remove 4 inactive ChatGPT Team seats" is actionable. "Consider optimizing seat utilization" is not.

**Risk 2: Users don't trust the numbers**

Financial recommendations from a tool they've never heard of will be met with skepticism. The confidence score and the explicit reasoning (`reason` field) exist to address this — but they only work if they're prominently displayed, not buried.

Mitigation: Show the math. "4 inactive seats × $30/seat × 12 months = $1,440/year" is more trustworthy than "$1,440 identified savings." The audit report should show the formula, not just the output.

**Risk 3: The data input problem**

The biggest friction point is getting accurate workspace metrics into the product. If users have to manually enter seat counts and utilization rates, many will guess — and wrong inputs produce wrong recommendations that erode trust.

Mitigation for now: Provide realistic defaults and ranges. Make it clear in the UI that estimates based on typical usage patterns are available if exact numbers aren't known. Long-term: direct integrations with Slack (for activity signals), billing APIs, and SSO directories.

---

## 90-Day Milestones

| Milestone | Target | Why it matters |
|---|---|---|
| First 10 audits | Week 1 | Validates the onboarding flow works |
| First shared public report | Week 1 | Validates the sharing mechanic |
| First unsolicited signup (no outreach) | Week 3 | Validates organic discovery |
| 50 audits completed | Week 4 | Enough data to write a findings post |
| Show HN launch | Week 5–6 | After product is polished, not before |
| 100 audits completed | Week 8 | Enough to identify the highest-value rule |
| First user who shares with their CFO | Week 6–8 | Validates the finance use case |
| First user who asks about recurring monitoring | Any | First signal of willingness to pay |

The last two milestones matter more than the numbers. A user who shares the report with their CFO has validated the stakeholder communication use case. A user who asks about recurring monitoring has told you what the paid tier should be.
