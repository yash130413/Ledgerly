# Development Log — Ledgerly AI Spend Audit Tool

---

## Day 1 — 2026-05-21

**Hours worked:** 0

**What I did:**
Nothing. I received the assignment today but didn't start. I told myself I'd begin tomorrow.

**What I learned:**
N/A

**Blockers / what I'm stuck on:**
Procrastination. I underestimated the scope and thought I could do it later.

**Plan for tomorrow:**
Start reading the assignment and researching pricing data.

---

## Day 2 — 2026-05-22

**Hours worked:** 0

**What I did:**
Nothing. I was busy with other commitments and kept pushing this off.

**What I learned:**
I'm falling behind. The assignment requires steady work across 7 days.

**Blockers / what I'm stuck on:**
Poor time management. I need to start immediately.

**Plan for tomorrow:**
Actually start the project. Set up Next.js and begin building.

---

## Day 3 — 2026-05-23

**Hours worked:** 0

**What I did:**
Nothing again. I kept telling myself I'd start "later today" but never did.

**What I learned:**
I've now wasted 3 days. This is becoming a serious problem.

**Blockers / what I'm stuck on:**
Fear of starting. The scope feels overwhelming so I keep avoiding it.

**Plan for tomorrow:**
No excuses. Must start coding tomorrow.

---

## Day 4 — 2026-05-24

**Hours worked:** 0

**What I did:**
Nothing. I've now wasted 4 out of 7 days.

**What I learned:**
I've completely mismanaged this assignment. I should have started on Day 1.

**Blockers / what I'm stuck on:**
Panic is setting in. I know I need to start but I'm paralyzed by how much work is left.

**Plan for tomorrow:**
Start immediately. Work all day. Focus on core features first.

---

## Day 5 — 2026-05-25

**Hours worked:** 2

**What I did:**
- Finally started. Read through the full assignment document carefully
- Reached out to Yogesh (Icertis) for user interview via WhatsApp
- Had 35-minute conversation about AI spend tracking at enterprise scale
- Took detailed notes on his insights about duplicate subscriptions and governance
- Started researching pricing data for ChatGPT, Claude, Cursor, Copilot, Gemini
- Realized I'm in serious trouble with only 2 days left

**What I learned:**
- The user interview was incredibly valuable — Yogesh's insights about organizational fragmentation completely changed my understanding of the problem
- Enterprise users care more about governance and visibility than just cost savings
- I should have done these interviews on Day 2-3 to inform my design from the start
- I've dug myself into a hole and will have to work non-stop for the next 48 hours

**Blockers / what I'm stuck on:**
- Haven't written a single line of code yet
- Only 2 days left before deadline
- Need to build entire MVP, write all docs, and deploy

**Plan for tomorrow:**
Work from morning to night. Build the entire MVP in one day. No breaks.

---

## Day 6 — 2026-05-26

**Hours worked:** 16

**What I did:**
- Woke up at 6 AM and worked until midnight
- Set up Next.js 16 project with TypeScript, Tailwind CSS, and Supabase
- Built the entire audit engine with 13 rules across 6 providers
- Implemented confidence scoring and priority classification logic
- Created Supabase schema with organizations, audits, and recommendations tables
- Set up Row Level Security policies
- Built authentication flow with Supabase Auth
- Created dashboard layout with sidebar navigation
- Started building audit results visualization with Recharts
- Reached out to Jagbir Singh (Forza Medi) for second user interview
- Had 28-minute phone conversation about business metrics vs technical metrics
- Documented pricing sources in PRICING_DATA.md
- Wrote initial versions of ARCHITECTURE.md and GTM.md
- Made 9 git commits throughout the day

**What I learned:**
- Working 16 hours straight is exhausting and leads to mistakes
- I caught several bugs in the audit logic because I was rushing
- Deterministic rules are better than LLM-generated recommendations for financial audits
- The "already optimized" case is important — don't manufacture fake savings
- I should have built public-first flow instead of auth-first (realized this too late)
- Jagbir's insight about business-friendly language completely changed my approach to the UI
- Most AI tool pricing is per-seat monthly, but API pricing is usage-based
- Companies don't track seat utilization at all — this is the core insight

**Blockers / what I'm stuck on:**
- Exhausted from working all day
- Realized I built auth-first when assignment requires public-first — need to pivot
- Still need to build landing page, public audit flow, emails, and all remaining docs
- Haven't written tests yet
- Haven't deployed yet

**Plan for tomorrow:**
Work another 16+ hours. Build public audit flow, write all remaining docs, write 25 tests, deploy to production, submit before deadline.

---

## Day 7 — 2026-05-27

**Hours worked:** 18

**What I did:**
- Woke up at 5 AM and worked until 11 PM
- Reached out to Tarun Rohilla (Deloitte) for third user interview
- Had 42-minute phone conversation about AI governance frameworks at enterprise scale
- Built public landing page with hero section and clear value proposition
- Created public audit form at /audit-form with localStorage persistence
- Implemented public audit results page accessible without login
- Added shareable URL generation with unique IDs and Open Graph tags
- Integrated Anthropic API for personalized summaries with fallback
- Set up Resend for transactional emails
- Built email templates with React Email
- Implemented lead capture form with honeypot spam protection
- Added Framer Motion animations throughout the app
- Wrote 21 unit tests for audit engine covering all edge cases
- Wrote USER_INTERVIEWS.md with detailed notes from all 3 conversations
- Wrote PROMPTS.md documenting all LLM prompts and what didn't work
- Completed TESTS.md documenting all test cases
- Wrote REFLECTION.md answering all 5 questions
- Completed ECONOMICS.md with unit economics breakdown
- Completed LANDING_COPY.md with hero copy and FAQs
- Completed METRICS.md with North Star metric definition
- Set up GitHub Actions CI workflow
- Deployed to Vercel production
- Tested entire flow end-to-end as a cold visitor
- Ran Lighthouse audits (Performance: 92, Accessibility: 95, Best Practices: 100)
- Fixed multiple bugs found during testing
- Fixed CI issues (Node version, vitest config, lint errors, env variables)
- Added Lighthouse screenshot to README
- Updated pricing data to May 2026
- Made 28 git commits throughout the day
- Prepared final submission

**What I learned:**
- Working 18 hours straight is brutal and not sustainable
- Tarun's insights about governance maturity completely validated the optimization score concept
- The user interviews were incredibly valuable — they completely changed my design priorities
- The public audit flow is the most important feature — everything else supports it
- Documentation quality matters as much as code quality for this assignment
- Testing the full user journey as a stranger reveals UX issues you miss as the builder
- Compressing 7 days of work into 2 days leads to corners being cut and quality compromises
- I should have started on Day 1 and worked steadily across the full week
- The assignment is testing discipline and consistency as much as technical skill
- My poor time management and procrastination cost me the discipline score
- CI/CD issues take longer to debug than you think
- Getting a green check on GitHub Actions requires careful attention to env variables and Node versions

**Blockers / what I'm stuck on:**
None — ready to submit, but fully aware that I failed the discipline and consistency dimension of the evaluation.

**Plan for tomorrow:**
Submit the assignment. Reflect on what went wrong with my time management. Learn from this mistake. Never procrastinate on a 7-day assignment again.

---

## Honest Reflection on This DEVLOG

**The brutal truth:**

I wasted the first 4 days (May 21-24) due to procrastination and poor time management. I did 2 hours of work on Day 5 (May 25) conducting one user interview and researching. Then I worked intensively for 16 hours on Day 6 (May 26) and 18 hours on Day 7 (May 27) to complete everything.

**Git history confirms this:**
- May 26: 9 commits (initial setup, audit engine, dashboard, docs)
- May 27: 28 commits (public flow, tests, CI fixes, final polish)
- Total: 2 days of actual work

**What this means:**
- My git history only shows 2 days of commits (May 26-27)
- This violates the requirement of "commits on at least 5 distinct calendar days"
- I failed the discipline and consistency test
- The compressed timeline is obvious and undermines the credibility of my submission

**User interview timeline (actual):**
- May 25: Yogesh (Icertis) — 35 minutes via WhatsApp
- May 26: Jagbir Singh (Forza Medi) — 28 minutes via phone
- May 27: Tarun Rohilla (Deloitte) — 42 minutes via phone

These interviews were real and happened on these dates, but they were rushed because I started late.

**What I learned:**

The assignment is not just testing my ability to code — it's testing my ability to plan, execute consistently, and manage my time like a professional. I failed that test. Even though I built a working product with good code quality and comprehensive documentation, the lack of consistent daily progress shows poor discipline.

**What I would do differently:**

1. Start on Day 1 of the assignment window, no excuses
2. Work 3-4 hours per day across 7 days instead of 34 hours across 2 days
3. Conduct user interviews early (Day 2-3) to inform design decisions from the start
4. Make meaningful commits daily to show steady progress
5. Build public-first flow from the start, not auth-first
6. Allocate proper time for documentation throughout the week instead of rushing it at the end
7. Test and deploy incrementally instead of doing everything on the last day

**Key takeaway:**

Consistent daily progress beats last-minute heroics. This is true in startups and it's true in this assignment. I learned this lesson the hard way.

**Self-assessment on discipline (1-10): 2/10**

I procrastinated for 4 days, did minimal work on Day 5, then crammed everything into Days 6-7. This is the opposite of discipline. The only reason I'm not giving myself a 1/10 is that I at least finished the work and am being honest about what happened.

**Will I advance to Round 2?**

Probably not. The git history requirement is explicit: "commits on at least 5 distinct calendar days... If fewer than 5, submission is rejected." I have 2 days. Even if my product quality is good, I failed the discipline test.

But I'm submitting anyway because:
1. I built something real and learned a lot
2. Honesty matters more than trying to hide mistakes
3. This is portfolio-worthy work regardless of the outcome
4. I learned a valuable lesson about time management and discipline

**Honest assessment:**
I built a working product with good code quality and comprehensive documentation, but I failed the discipline and consistency dimension of the evaluation. The compressed timeline is obvious in the git history and undermines the credibility of the submission. If I could do this again, I would start immediately and work steadily across the full 7-day window.