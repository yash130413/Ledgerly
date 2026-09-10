# LLM Prompts — Ledgerly

## Overview

Ledgerly uses the Anthropic Claude API for **narrative generation only**. The audit engine itself is deterministic and rule-based — no LLM is involved in calculating savings or generating recommendations.

The LLM is used to:
1. Generate a personalized ~100-word summary paragraph for each audit
2. Polish the language of recommendation titles (optional enhancement)

This document contains all prompts used in production, why they're structured this way, and what we tried that didn't work.

---

## Prompt 1: Audit Summary Generation

### Purpose
Generate a personalized, human-readable summary paragraph that explains the audit results in plain language.

### Location in Code
`src/app/api/audits/summarize/route.ts`

### The Prompt

```
You are a financial analyst helping a startup optimize their AI software spend.

You have just completed an audit of their AI tool subscriptions. Here are the results:

AUDIT RESULTS:
- Total providers scanned: {providersScanned}
- Total monthly savings identified: ${totalMonthlySavings}
- Total annual savings identified: ${totalAnnualSavings}
- Optimization score: {optimizationScore}/100
- Number of recommendations: {recommendationCount}

TOP RECOMMENDATIONS:
{topRecommendations}

WORKSPACE CONTEXT:
- Team size: {teamSize} people
- Primary use case: {primaryUseCase}
- Current tools: {currentTools}

Write a personalized 100-word summary paragraph that:
1. Acknowledges their current setup
2. Highlights the most impactful finding
3. States the total annual savings opportunity
4. Ends with a clear next step

Tone: Professional but friendly. Direct and specific. No fluff.

Do not use phrases like "I analyzed" or "I found" — write in passive voice.
Do not use bullet points — write in paragraph form.
Do not exceed 120 words.
```

### Why This Structure Works

**1. Role definition ("You are a financial analyst...")**
- Sets the tone and expertise level
- Prevents the LLM from being overly casual or technical

**2. Structured data input**
- Gives the LLM all the context it needs
- Prevents hallucination (it can't make up numbers)

**3. Explicit constraints**
- "100-word summary" prevents rambling
- "No bullet points" ensures paragraph form
- "Passive voice" avoids first-person ("I analyzed...")

**4. Clear output format**
- 4-step structure ensures consistency
- "Clear next step" makes the summary actionable

### Example Output

**Input:**
- Total monthly savings: $450
- Total annual savings: $5,400
- Optimization score: 73/100
- Team size: 12
- Primary use case: Coding
- Current tools: ChatGPT Team, Cursor Pro, GitHub Copilot

**Output:**
> "Your team's AI tooling setup shows strong adoption across ChatGPT, Cursor, and Copilot, but there's significant overlap. The audit identified $5,400 in annual savings, primarily from consolidating Cursor and Copilot (both serve the same coding assistance function) and removing 4 inactive ChatGPT Team seats. Your optimization score of 73/100 indicates moderate efficiency. The highest-impact action is eliminating the Cursor/Copilot redundancy, which alone saves $2,880/year. Review the detailed recommendations below to prioritize next steps."

### Fallback Behavior

If the Anthropic API fails (rate limit, timeout, or error), the system falls back to a **templated summary**:

```typescript
const fallbackSummary = `
Your audit identified $${totalMonthlySavings}/month ($${totalAnnualSavings}/year) in potential savings across ${providersScanned} providers. 
The analysis found ${recommendationCount} optimization opportunities, with the highest priority being: ${topRecommendation.title}. 
Your current optimization score is ${optimizationScore}/100. Review the detailed recommendations below to see where you can reduce costs while maintaining productivity.
`.trim();
```

This ensures the audit always completes, even if the AI service is unavailable.

---

## Prompt 2: Recommendation Title Polish (Optional Enhancement)

### Purpose
Polish the auto-generated recommendation titles to be more human-readable.

### Location in Code
Not currently implemented in production (planned for v2)

### The Prompt (Experimental)

```
You are editing recommendation titles for a financial audit report.

Original title: "{originalTitle}"
Context: This recommendation will save ${monthlySavings}/month by {action}.

Rewrite the title to be:
- Clear and specific
- Action-oriented (starts with a verb)
- Under 60 characters
- Professional but not robotic

Examples:
- "Remove 4 inactive ChatGPT Team seats" (good)
- "Optimize seat utilization" (too vague)
- "Consider removing inactive seats" (too wishy-washy)

Output only the rewritten title, nothing else.
```

### Why We're Not Using This Yet

**Pros:**
- Makes titles more readable
- Adds variety to the language

**Cons:**
- Adds latency (one API call per recommendation)
- Adds cost ($0.01-0.03 per audit)
- Introduces non-determinism (same input → different output)
- The auto-generated titles are already clear

**Decision:** The deterministic titles are good enough. Polish can be added later if user feedback indicates it's needed.

---

## What We Tried That Didn't Work

### Attempt 1: LLM-Generated Recommendations (Failed)

**What we tried:**
```
You are a financial analyst. Analyze this workspace data and generate savings recommendations:

{workspaceData}

Generate 3-5 recommendations with estimated savings.
```

**Why it failed:**
1. **Hallucinated savings numbers** — The LLM would make up savings estimates that didn't match the actual pricing
2. **Inconsistent output** — Same input would produce different recommendations on each run
3. **No explainability** — Users couldn't see why a recommendation was made
4. **Slow** — Took 3-5 seconds per audit vs. <100ms for deterministic rules

**Lesson learned:** Financial calculations should never be delegated to an LLM. Use deterministic logic for the math, LLMs for narrative polish only.

---

### Attempt 2: Conversational Tone (Failed)

**What we tried:**
```
Hey! I just finished analyzing your AI spend. Here's what I found...
```

**Why it failed:**
- Users found it unprofessional
- Didn't match the seriousness of a financial audit
- One user said "this feels like a chatbot, not a tool"

**Lesson learned:** Financial tools should sound professional, not casual. Save the friendly tone for onboarding, not audit results.

---

### Attempt 3: Overly Technical Language (Failed)

**What we tried:**
```
Utilization rate analysis indicates suboptimal resource allocation across provisioned seat inventory...
```

**Why it failed:**
- Users didn't understand it
- Sounded like enterprise software jargon
- One user said "I need to translate this for my CFO"

**Lesson learned:** Write for a smart generalist, not a technical specialist. The CFO reading the forwarded report shouldn't need a glossary.

---

### Attempt 4: Asking the LLM to "Show the Math" (Failed)

**What we tried:**
```
Calculate the savings and show your work step-by-step.
```

**Why it failed:**
- The LLM would make arithmetic errors
- The "work" was verbose and hard to follow
- Users didn't trust the calculations

**Lesson learned:** Never ask an LLM to do math. Do the math in code, then ask the LLM to explain it in plain language.

---

## Prompt Engineering Principles We Follow

### 1. Be Specific About Format
❌ "Write a summary"  
✅ "Write a 100-word paragraph summary with no bullet points"

### 2. Provide Examples
❌ "Make it professional"  
✅ "Tone: Professional but friendly. Example: 'Your team's setup shows...'"

### 3. Constrain the Output
❌ "Explain the results"  
✅ "Write exactly 100 words. Do not exceed 120 words."

### 4. Use Structured Input
❌ "Here's some data: {json}"  
✅ "AUDIT RESULTS:\n- Total savings: $X\n- Providers: Y"

### 5. Prevent Hallucination
❌ "Analyze this and tell me what you find"  
✅ "Here are the findings: {findings}. Summarize them."

---

## API Configuration

### Model
`claude-3-5-sonnet-20241022` (Claude 3.5 Sonnet)

**Why this model:**
- Fast (1-2 second response time)
- High quality output
- Good at following instructions
- Cost-effective ($3/1M input tokens, $15/1M output tokens)

**Why not Claude 3 Opus:**
- Slower (3-5 seconds)
- More expensive ($15/1M input tokens)
- Overkill for this use case

**Why not Claude 3 Haiku:**
- Lower quality output
- Struggles with nuanced tone
- Not worth the cost savings ($0.25/1M input tokens)

### Parameters

```typescript
{
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 300,  // ~100-word output + buffer
  temperature: 0.7, // Balanced creativity and consistency
  top_p: 1.0,       // Default
}
```

**Why temperature = 0.7:**
- 0.0 = Too robotic, repetitive phrasing
- 1.0 = Too creative, inconsistent tone
- 0.7 = Sweet spot for professional but varied language

---

## Cost Analysis

### Per-Audit Cost

**Input tokens:** ~500 tokens (audit data + prompt)  
**Output tokens:** ~150 tokens (~100-word summary)

**Cost per audit:**
- Input: 500 tokens × $3/1M = $0.0015
- Output: 150 tokens × $15/1M = $0.00225
- **Total: ~$0.004 per audit**

### At Scale

| Audits/month | LLM cost | Notes |
|---|---|---|
| 100 | $0.40 | Early stage |
| 1,000 | $4.00 | Product Hunt launch |
| 10,000 | $40.00 | Sustainable |
| 100,000 | $400.00 | Consider caching |

**Conclusion:** LLM cost is negligible compared to infrastructure costs. No optimization needed until 100k+ audits/month.

---

## Error Handling

### Anthropic API Failures

**Possible errors:**
1. Rate limit (429)
2. Timeout (504)
3. Invalid API key (401)
4. Model overloaded (529)

**Handling strategy:**
```typescript
try {
  const summary = await generateSummary(auditData);
  return summary;
} catch (error) {
  console.error("Anthropic API error:", error);
  return fallbackSummary; // Templated summary
}
```

**No retry logic** — If the API fails, fall back immediately. The audit should complete in <2 seconds total, and retries would add latency.

---

## Testing the Prompts

### Manual Testing Process

1. Run an audit with real data
2. Check the generated summary for:
   - Accuracy (does it match the audit results?)
   - Tone (professional but friendly?)
   - Length (100-120 words?)
   - Actionability (clear next step?)
3. If any check fails, adjust the prompt and re-test

### Automated Testing

Not currently implemented. LLM outputs are non-deterministic, making automated testing difficult.

**Future consideration:** Use a "golden set" of 10 audits and manually verify the summaries are acceptable. Re-run this set after any prompt changes.

---

## Future Prompt Additions

### 1. Email Subject Line Generation
```
Generate a compelling email subject line for this audit report:
- Savings: ${totalAnnualSavings}
- Optimization score: {optimizationScore}

Examples:
- "You could save $5,400/year on AI tools"
- "Your AI spend audit: 73/100 optimization score"

Output only the subject line, under 60 characters.
```

### 2. Recommendation Explanation Expansion
```
Expand this recommendation into a 2-sentence explanation:

Recommendation: "{title}"
Savings: ${monthlySavings}/month
Reason: {reason}

Write 2 sentences that explain:
1. Why this recommendation was made
2. What action to take

Tone: Clear and direct. No jargon.
```

### 3. "Already Optimized" Celebration Message
```
This user's audit found no savings opportunities. Write a 50-word congratulatory message that:
1. Celebrates their efficient spending
2. Encourages them to share the tool with others
3. Offers to notify them if new optimizations apply

Tone: Positive and genuine. Not patronizing.
```

---

## Conclusion

**Key principle:** Use LLMs for language, not logic.

The audit engine is deterministic and rule-based. The LLM is used only to make the output more readable and personalized. This gives us:
- **Accuracy** — Financial calculations are always correct
- **Speed** — Deterministic rules run in <100ms
- **Explainability** — Every recommendation traces to a named rule
- **Cost-effectiveness** — LLM cost is <$0.01 per audit

The prompts are designed to be specific, constrained, and failure-tolerant. If the LLM fails, the audit still completes with a templated summary.

This is the right architecture for a financial tool.
