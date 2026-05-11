# QA Checklist — Pre-Submit Gate

Every draft must pass this checklist before going to the Reviewer queue. The runner enforces it programmatically. Reviewers re-check during human review.

If a draft fails any HARD check, the runner rejects it and writes the reason to [[anti-patterns]]. If it fails any SOFT check, the runner flags it but still submits.

## Hard Checks (auto-reject)

### 1. Proof Point Presence
- [ ] Every claim of the form "X% of Y" or "we found Z" has a source — either a published VOC AI report URL, a public Amazon listing, or a citation
- [ ] No invented statistics. If the number doesn't trace to real data, kill the draft
- [ ] No generic "AI is changing e-commerce" filler without a proof point

### 2. Hook Compliance
- [ ] First line uses one of the 7 hook categories from [[hooks]] (data-bomb, competitor-intel, contrarian, curiosity-gap, direct-challenge, result-first, speed-ease)
- [ ] The hook contains at least one specific number, name, or concrete claim
- [ ] The hook does NOT start with "I" (X-specific rule from [[platform-tone]])

### 3. Platform Native Format
- [ ] X posts ≤ 280 chars (single) or use clear thread markers (1/, 2/, ...)
- [ ] LinkedIn posts have the first-line hook earning the "see more" click (≤ 210 chars before the break)
- [ ] Instagram carousels have slide 1 = bold claim (≤ 8 words)
- [ ] TikTok scripts have the hook in first 2 seconds with text overlay
- [ ] YouTube has SEO title (≤ 60 chars) + structured sections (hook/context/main/recap)

### 4. Voice Lock
- [ ] No banned words from [[brand-voice]]: "delve," "robust," "comprehensive," "nuanced," "leverage," "synergize," "circle back," "in today's fast-paced world"
- [ ] No em dashes used as a stylistic crutch (one max per post; if multiple, kill it)
- [ ] Lowercase rule for X (no Title Case body text)
- [ ] Numbers and proof points present (default rule: at least 1 specific metric per post)

### 5. Niche Lock
- [ ] Topic fits VOC AI niche per [[index]] — Amazon seller pain, e-commerce data, review intelligence
- [ ] Not a generic "AI tools list" or "10 marketing tips" post
- [ ] Not a competitor's brand mention without our angle (no free advertising for Helium 10)

## Soft Checks (flag, don't auto-reject)

### 6. Anti-Pattern Match
- [ ] Cross-reference `agents/<id>/anti-patterns.md` — does this draft look like a previously-rejected pattern? If yes, flag with the matched anti-pattern reason
- [ ] Recently-used hook? If the same hook category was used 2x already this week → flag (variety check)

### 7. Repurpose Drift
- [ ] If part of a [[repurpose]] chain: does this version genuinely RETHINK the topic for the platform, or just reformat the X version? Reformat = soft reject. Rethink = pass.
- [ ] Each platform version uses a different angle on the same topic (not the same words with different line breaks)

### 8. CTA Sanity
- [ ] CTA exists but isn't desperate
- [ ] Free tool links go to actual free tools (voc.ai/free-tools/*), not paywall pages
- [ ] No 3+ links in a post body. Links in replies (X) or first comment (LinkedIn) only

### 9. Trust Markers
- [ ] If we cite a customer, we have permission to name them (or it's anonymized)
- [ ] If we cite a competitor, the factual claim is verifiable (don't trash competitors without proof)
- [ ] If we cite a number, it's within last 12 months (no stale stats)

### 10. Accessibility & Inclusivity
- [ ] Image posts have alt text suggested in frontmatter
- [ ] No exclusionary language (e.g. "successful sellers" not "real sellers")

## Runner Implementation

```yaml
# In agent.yaml or per-draft frontmatter:
qa_checks:
  hard_passed: [proof, hook, format, voice, niche]
  hard_failed: []
  soft_flagged: [variety]
  ready_for_review: true
```

If `hard_failed` is non-empty → runner writes draft to `content-bank/draft-rejected/<ts>-<slug>.md` instead of `draft/`, and writes the reason to `anti-patterns.md` immediately. No human review.

If `hard_failed` is empty but `soft_flagged` is non-empty → draft submits but the Reviewer queue shows the flag inline ("⚠ variety check: 3rd contrarian hook this week").

## Why This Exists

Without a QA gate, the engine produces volume but the volume is slop. Reviewer burns 20 min per draft fact-checking. With this gate, Reviewer spends 2 min per draft on taste only — fact-check is mechanical.

The hard checks should pass 90%+ of the time if the rest of the skill graph ([[brand-voice]], [[hooks]], [[platforms]]) is followed. If hard checks are failing often, the upstream prompt is broken, not the QA gate.

## References
- [[index]] — overall flow
- [[brand-voice]] — banned words and voice rules
- [[hooks]] — hook categories
- [[platform-tone]] — per-platform format rules
- [[repurpose]] — what "rethink not reformat" means
