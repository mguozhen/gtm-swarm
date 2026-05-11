# Competitor Analysis — VOC AI

## Top 5 Competitors

### 1. Helium 10
- **URL**: helium10.com
- **Stage**: Late-stage private / bootstrapped-then-funded; reported ~$150M+ ARR, dominant market position; acquired by Perch (aggregator) ecosystem, then management buyout — exact cap table unclear but operationally profitable and cash-generative
- **Their wedge**: The all-in-one Amazon seller operating system — keyword research, listing optimization, PPC management, inventory tracking, and review monitoring bundled into one subscription that sellers are already paying for and already trained on
- **Their price**: $99/mo (Starter, heavily limited) → $249/mo (Platinum, most popular) → $399/mo (Diamond); annual discount ~25%; many power users on $249/mo
- **Their weakness**: Review analytics is a bolt-on afterthought. Helium 10's "Review Insights" and "Review Downloader" give you volume counts and basic star-rating breakdowns — they cannot cluster complaints by theme, track how a complaint topic's prevalence shifts over time, or aggregate across an entire category of ASINs. A seller can see "327 1-star reviews" but cannot answer "what specifically do customers keep complaining about and is that complaint growing?" The product was designed for keyword arbitrage operators, not for teams that need to understand the underlying customer desire. Every insight is ASIN-level, never category-level. There is no cross-ASIN synthesis.

---

### 2. Jungle Scout
- **URL**: junglescout.com
- **Stage**: Late-stage private; estimated $50M–$80M ARR; received PE growth investment (Summit Partners); has expanded into enterprise product "Cobalt" targeting CPG brand research teams
- **Their wedge**: The friendliest product research entry ramp for new Amazon sellers — Chrome extension + web app combo that makes demand validation feel simple; Cobalt positions as the enterprise-grade market intelligence layer for CPG brands
- **Their price**: $49/mo (Basic, very limited) → $79/mo (Suite, most popular) → $399/mo (Professional); Cobalt is enterprise-quoted, likely $15K–$60K ARR
- **Their weakness**: Jungle Scout's core data moat is sales estimates and demand signal — they reverse-engineer BSR into estimated unit velocity. This is useful for sizing a market but tells you nothing about *why* customers are choosing or rejecting products. Their review module is thinner than Helium 10's. Cobalt is genuinely moving toward brand intelligence, but their data asset is fundamentally market-size oriented (how big is the pie?) rather than customer-voice oriented (what does the customer actually want?). The gap: Jungle Scout can tell you a category does $40M/month in sales; it cannot tell you that 34% of 1-star reviews in that category complain about the same assembly problem — which is the product design brief for your next launch. Additionally, their SMB tool and their enterprise product (Cobalt) are effectively separate products with separate teams, creating internal coherence gaps.

---

### 3. Threecolts (FeedbackWhiz + ScoutIQ + broader bundle)
- **URL**: threecolts.com (FeedbackWhiz: feedbackwhiz.com; ScoutIQ: scoutiq.co)
- **Stage**: PE-backed rollup; raised $90M+ (reported 2022); aggressively acquiring Amazon seller tool companies; owns FeedbackWhiz, ScoutIQ, SellerBench, Bindwise, and ~10 other tools
- **Their wedge**: The Amazon seller tool consolidator — rather than building best-in-class features, Threecolts acquires functional tools and bundles them, betting that sellers prefer one invoice and one login over multiple point solutions; FeedbackWhiz specifically owns the review request and reputation management workflow
- **Their price**: FeedbackWhiz: $20–$60/mo (review management only); ScoutIQ: ~$30–$50/mo (book/product scouting); Threecolts unified bundle pricing not fully public; enterprise quotes likely $500–$3,000/mo
- **Their weakness**: Threecolts is a financial rollup, not a product vision. Each acquired tool retains its original UI and data architecture — there is no unified intelligence layer across the bundle. FeedbackWhiz is operationally focused (did the customer get my review request email?) not analytically focused (what is the customer actually saying?). ScoutIQ's 3.3★ App Store rating on 554 reviews is a direct signal of user dissatisfaction — the product works well enough to not churn immediately but generates enough frustration to generate negative public reviews. Their TikTok content output for FeedbackWhiz received 288 plays — near zero organic distribution — indicating no content moat and weak brand resonance. Crucially: Threecolts does not have a category-level review intelligence product. They manage reviews as operational tasks (respond, request, monitor alerts) but do not synthesize review *content* into product or market intelligence.

---

### 4. SmartScout
- **URL**: smartscout.com
- **Stage**: Early growth; bootstrapped or seed-stage; App Store listing shows 11 reviews (low penetration), 4.6★; gaining attention in the market analysis/brand intelligence subspace of Amazon tools
- **Their wedge**: Amazon market mapping — understanding brand-level and category-level structure of who sells what, at what price, with what market share; targeted at sellers who want to understand the competitive landscape at a macro level before entering a category
- **Their price**: ~$97/mo (Basic) → $187/mo (Essentials) → $277/mo (Business); pricing subject to change as they scale
- **Their weakness**: SmartScout's data is structural (who sells what, how much, with what catalog) not experiential (what customers actually say). They tell you Anker owns 31% of the portable charger category — they cannot tell you that Anker's customers' top complaint is the cable durability. The review intelligence layer is absent. Their content moat is thin (low App Store penetration, limited community presence), and their positioning overlaps with the "category entry research" use case but serves it with market structure data rather than customer desire data. They are not a review analytics company at all — they are a market mapping company, which means a switcher from SmartScout to VOC AI isn't switching from the same tool, they're adding a layer.

---

### 5. Brandwatch (and the enterprise sentiment tier: Sprinklr, Medallia)
- **URL**: brandwatch.com (owned by Cision post-2021 acquisition; Sprinklr: sprinklr.com; Medallia: medallia.com)
- **Stage**: Enterprise SaaS; Brandwatch: Cision-acquired, ~$100M+ ARR segment; Sprinklr: NYSE listed ($CXM), ~$650M ARR; Medallia: private equity (Thoma Bravo), ~$500M ARR
- **Their wedge**: Enterprise-grade social listening and customer experience intelligence — monitoring brand mentions, social media sentiment, and (in Brandwatch's case) some review data across channels at Fortune 500 scale with dedicated CSM, compliance, and custom reporting
- **Their price**: Brandwatch: $800–$3,000/mo entry (consumer intelligence tier); enterprise contracts $36K–$500K ARR; Sprinklr: $25K–$300K ARR; Medallia: $50K–$500K+ ARR. These are not self-serve products.
- **Their weakness**: Structurally inaccessible for any company under $10M revenue. The onboarding, procurement, and contract processes take 3–6 months. The platforms are generalist social listening tools that happen to include some Amazon review data — they were not built around Amazon's review corpus, do not have 2B+ reviews indexed with category-level taxonomy, and their Amazon-specific intelligence is a feature among hundreds rather than a core product thesis. Critically: a DTC brand with $2M in Amazon revenue cannot use Brandwatch economically. A solo FBA operator cannot use Brandwatch at all. The entire SMB and mid-market segment ($500K–$50M revenue brands) is structurally unserved by this tier.

---

## Positioning Map

**Dimensions chosen** (from Step 2 ICP priorities):

- **X-axis: Data depth on customer desire** — Low (structural / keyword / market-size data) → High (review content intelligence, complaint clustering, sentiment synthesis)
- **Y-axis: Accessibility / self-serve ease** — Low (enterprise-only, sales-assisted) → High (PLG self-serve, immediate time-to-insight)

```
                    HIGH ACCESSIBILITY (Self-serve, fast, affordable)
                              │
          Helium 10           │              VOC AI
       (⬛ keyword-depth,    │           (⬛ high review depth,
        low review depth,    │            high self-serve,
        high accessibility)  │            OPEN WHITE SPACE)
                              │
  ──────────────────────────────────────────────────────────────→
  LOW CUSTOMER                │                           HIGH CUSTOMER
  DESIRE DEPTH                │                           DESIRE DEPTH
  (structural/keyword)        │                           (review intelligence)
                              │
    Jungle Scout              │
    SmartScout                │         [OPEN SPACE: mid-market
    Threecolts                │          brand teams, $2K-10K/mo]
                              │
          Brandwatch          │
          Sprinklr/Medallia   │
       (low accessibility,    │
        medium review depth)  │
                              │
                    LOW ACCESSIBILITY (Enterprise, long sales cycle)
```

**Where VOC AI sits**: High accessibility (PLG self-serve, trial with real data immediately) × High customer desire depth (review content intelligence, category-level complaint clustering, cross-ASIN synthesis). This is the only player operating in this quadrant at any price point.

**Open white space**: Two zones are structurally unoccupied:
1. **Self-serve, high customer desire depth at $99–$299/mo** — This is VOC AI's current wedge and the clearest uncontested territory. No competitor operates here.
2. **Mid-market brand teams ($2K–$10K/mo, moderately assisted, high review depth)** — The space between Helium 10's SMB ceiling and Brandwatch's enterprise floor. Anker, Panasonic, Dreame, and Insta360 are already in this space with VOC AI. No competitor has explicitly claimed this positioning. This is the expansion zone for the next 18 months.

---

## The Gap We Own

VOC AI is the only product built from the ground up around a single thesis — that the 2 billion Amazon reviews in existence represent the world's largest unmoderated, uncoached product feedback panel — and has structured that corpus into a category-level intelligence database that can answer, in under 60 seconds, the question no keyword tool can touch: *not how many people searched for this product, but what the people who already bought it keep wishing was different*. Every competitor either stops at structural market data (keyword volume, BSR, sales estimates) or is priced and packaged for enterprises that need a 6-month procurement process — VOC AI is the first and only tool that delivers category-level customer desire intelligence to the operator or brand manager who makes the product decision themselves, today, without a CSM or a sales contract. The structural advantage is not just the data index size; it is the combination of index depth × category taxonomy × accessibility — all three simultaneously — which no competitor has assembled because Helium 10 built for keyword operators, Brandwatch built for enterprise compliance buyers, and nobody built specifically for the person who needs to know, right now, why the product two spots above them on Amazon has 847 customers complaining about the same thing.

---

## Competitive Risks

**12-month risk: Helium 10 bundles a "real" review intelligence module into Platinum tier**

Helium 10 has been publicly investing in AI feature expansion under the "Helium 10 AI" branding since late 2024. Their review module today is weak (see above), but they have the distribution, the brand recognition, and the existing paying customer base to absorb a meaningful feature upgrade. If Helium 10 ships category-level complaint clustering — even a mediocre version — into the $249/mo Platinum tier, the message "I already pay for Helium 10 and it does review analytics now" becomes the first objection in every SMB sales conversation. The risk is not that Helium 10 matches the depth; the risk is that Helium 10's feature is *good enough* to remove the switching motivation for the T3 trigger (Helium 10 frustration ceiling) which is one of VOC AI's highest-intent acquisition triggers. **Mitigation**: Build and publicize structural advantages that a bundle feature cannot replicate — cross-category benchmarking, multi-year trend tracking, and the specific accuracy/depth metrics (e.g., "analyzes 47,000 reviews across 200 ASINs in a category, not just the 3 ASINs you manually input"). Make the comparison explicit and quantitative before Helium 10 forces the conversation.

**24-month risk: Threecolts acquires a review analytics company and integrates it into the bundle, and/or Jungle Scout's Cobalt product matures into the mid-market brand intelligence space**

Threecolts' acquisition strategy is explicitly to bundle Amazon seller tools at every workflow touchpoint. They have capital ($90M raised) and appetite. If they acquire a review analytics startup — or build out FeedbackWhiz's analysis layer — they can instantly cross-sell review intelligence to their existing FeedbackWhiz and ScoutIQ customer base with one pricing email. Simultaneously, Jungle Scout Cobalt is explicitly targeting brand research teams with enterprise positioning; if Cobalt adds category-level review synthesis (a logical product roadmap move), it attacks the secondary ICP (brand PM / consumer insights lead) with Jungle Scout's existing brand recognition in that segment. **Mitigation**: The 24-month defense is the category intelligence database itself — the structural depth of the 2B review index with taxonomy, the proprietary complaint clustering schema, and the multi-year historical data that cannot be replicated in 6 months of engineering. Additionally, locking in enterprise reference customers (Anker, Panasonic, Dreame) with expanding contracts and case studies creates social proof that is expensive for a rollup to replicate from a standing start. The secondary mitigation is expanding from Amazon-only to multi-platform (Shopify reviews, App Store reviews, Walmart reviews) before Threecolts or Jungle Scout can, making the data asset structurally harder to match.

---

## Win-Loss Patterns

**Picks VOC AI when:**

- They've hit the Helium 10 frustration ceiling (T3): they are already paying for Helium 10, they know how to use it, and they've realized that keyword rank data does not explain why a product is underperforming or where the next opportunity is. They are not looking to replace Helium 10 — they are looking for the layer Helium 10 doesn't have. The conversation is "I have the demand signal, I need the desire signal."
- They have a specific acute trigger (T1 or T2): a bad launch they need to diagnose, or a team meeting where someone asked "what are customers complaining about with [competitor ASIN]?" and nobody had an answer faster than manual Googling. These users convert on trial because the aha moment (category-level complaint clusters surfaced in 60 seconds) is immediate and unmistakably better than their current alternative.
- They are entering a new category (T4) and have heard — from a podcast, Reddit thread, or peer — that review-mining before product design is the move. They are in research mode and willing to pay for a tool that compresses 40 hours of manual reading into a structured output.
- They are a brand-side PM or consumer insights lead at a company that already has Anker or Panasonic in their social proof orbit — they see themselves in the reference customer and the enterprise lane feels designed for them.
- Price is not the primary decision variable — they are evaluating on depth and speed of insight, not on whether to pay $199/mo vs. $249/mo.

**Picks a competitor when:**

- They are new to Amazon selling (<6 months) and are still in the "learn the basics" phase: they pick Helium 10 or Jungle Scout because every YouTube tutorial, Facebook group, and podcast they consume recommends those tools first. VOC AI is not yet part of the new seller onboarding conversation. These users do not have the product experience to feel the frustration ceiling yet. **Sales rep action**: Do not chase this segment in paid acquisition; let them develop the need first; reach them through T3 content (Helium 10 frustration ceiling moments) 6–12 months into their seller journey.
- They are on a strict budget and need an all-in-one tool to avoid multiple subscriptions: they choose Helium 10 Diamond or Jungle Scout Professional because it "does everything" — even if the review module is weak. They have made a mental trade-off: depth for breadth. **Sales rep action**: ROI calculator showing cost of one failed product launch (typically $30K–$150K) vs. VOC AI subscription cost ($2,400/yr) makes this a false economy argument — make this math visible and specific.
- They evaluated the free trial but didn't reach the aha moment during the trial window: this is an onboarding/activation problem, not a positioning problem. If a user signs up, analyzes one ASIN (not a category), and sees individual review summaries rather than the category-level insight, they leave thinking "this is just a review summarizer — ChatGPT does this for free." **Sales rep action**: Trial onboarding must route users immediately to the category-level complaint clustering view, not the single-ASIN view. The one thing that ChatGPT cannot replicate is the cross-category, cross-ASIN synthesis — if users never see this in trial, they will never understand the structural difference.
- They are an enterprise brand with a procurement process: they cannot buy a PLG tool without IT security review, vendor onboarding, and finance approval. They choose Brandwatch (or renew their Qualtrics contract) not because it's better but because it has the compliance paperwork. **Sales rep action**: For the secondary ICP (brand PM tier), the sales motion must include SOC2 documentation, a security questionnaire template, and a named account executive contact — the product alone will not clear procurement.
- They are a pure review management / reputation management buyer: they want to request reviews, auto-respond to negative reviews, and track star rating trends — they choose FeedbackWhiz because VOC AI is not positioned for that workflow. **Sales rep action**: Correctly lose this segment; review management is an adjacent workflow but a different job-to-be-done. Do not try to win reputation management buyers by adding review response features — it dilutes the intelligence positioning.

---

## Key Assumptions

The following assumptions underpin this competitor analysis. Any material change to these should trigger a re-run of this brief against updated market data:

**CA1 — "Helium 10's review module remains functionally weak through the next product cycle (2025–2026)."**
This analysis gives VOC AI a clear positioning gap based on Helium 10's current review analytics limitations. If Helium 10 ships a meaningful category-level review clustering feature — not just a UI refresh — the T3 acquisition trigger (Helium 10 frustration ceiling) loses potency. *Monitoring signal*: Watch Helium 10 product release notes and their "Helium 10 AI" roadmap announcements quarterly. Any mention of "category review trends," "complaint clustering," or "cross-ASIN review analysis" is a yellow-flag event requiring immediate positioning response.

**CA2 — "Jungle Scout Cobalt has not yet achieved meaningful penetration in the mid-market brand team segment ($10M–$500M companies)."**
Cobalt is the most serious 24-month threat to VOC AI's secondary ICP. This analysis assumes Cobalt is early-stage in adoption and has not established strong reference customers in the consumer electronics / hardware brand segment where Anker, Panasonic, and Dreame operate. *Monitoring signal*: Jungle Scout case study page for Cobalt — if they publish a reference customer in consumer electronics or CPG with a review intelligence use case, escalate this competitive threat from medium to high.

**CA3 — "Threecolts has not yet acquired a dedicated review analytics / sentiment intelligence company."**
Threecolts' M&A pace (multiple acquisitions per year) makes this a live risk. This analysis assumes their current portfolio does not include a category-level review intelligence capability and that FeedbackWhiz remains operationally focused (review requests + monitoring) rather than analytically focused (content intelligence). *Monitoring signal*: Threecolts press releases, Crunchbase acquisition data, and their product changelog page. Any acquisition of a company with "sentiment," "review analytics," "voice of customer," or "AI review" in its product description is a yellow-flag event.

**CA4 — "The 2B+ review index with category-level taxonomy is genuinely harder to replicate than it appears from the outside."**
This analysis treats VOC AI's data depth as a structural moat. If a well-funded competitor (Helium 10 or a new entrant) could realistically index a comparable review corpus in 6–12 months of engineering, the moat is shallow and the window is shorter than assumed. The assumption here is that the combination of index scale + category schema + historical data + processing infrastructure creates 18–24 months of defensible lead time. *Monitoring signal*: Any new entrant with >$5M seed funding explicitly targeting "Amazon review analytics" or "review-first product intelligence" — this would indicate the moat is weaker than assumed and requires immediate differentiation on taxonomy depth, not data volume alone.

**CA5 — "Amazon does not expand its native 'Review Highlights' / AI summary feature into a seller-facing competitive intelligence tool."**
Amazon's consumer-facing AI review summaries (launched 2023) are already commoditizing single-product review summarization at the consumer level. This analysis assumes Amazon will not extend this into a seller-facing tool that provides category-level competitive review benchmarking — because doing so would transparently arm sellers to attack each other, which is not in Amazon's marketplace health interest. However, if Amazon launches an "Amazon Brand Analytics" module with review content intelligence, this would structurally undermine all review analytics tools simultaneously. *Monitoring signal*: Amazon Brand Analytics changelog and Seller Central blog posts — specifically any announcement of "review topic analysis," "category sentiment," or "competitor review benchmarking" features.

---

```yaml
# AGENT-HYDRATION BLOCK (Step 4 Content Strategy seed input — from Step 3 Competitor Analysis)

competitor_map:
  direct:
    helium10:
      url: helium10.com
      estimated_arr: "$150M+"
      price_popular_tier: "$249/mo"
      wedge: "all-in-one Amazon seller OS"
      weakness: "review analytics is bolt-on; no category-level complaint clustering; ASIN-level only"
      content_angle: "Helium 10 tells you keyword rank. VOC AI tells you what the reviews behind that rank are actually saying."
      acquisition_trigger_overlap: ["T3_helium10_frustration_ceiling"]
    jungle_scout:
      url: junglescout.com
      estimated_arr: "$50M-$80M"
      price_popular_tier: "$79/mo (Suite); Cobalt enterprise-quoted"
      wedge: "demand validation + market sizing; Cobalt for enterprise brand research"
      weakness: "data is structural/market-size, not customer desire; review module thin; Cobalt ≠ review intelligence"
      content_angle: "Jungle Scout tells you the category does $40M/month. VOC AI tells you why 34% of buyers in that category give 1-star reviews."
      acquisition_trigger_overlap: ["T4_category_entry_research"]
    threecolts_feedbackwhiz:
      url: threecolts.com
      funding: "$90M+ raised (PE rollup)"
      price_popular_tier: "$20-$60/mo (FeedbackWhiz standalone)"
      wedge: "Amazon seller tool consolidation via acquisition; review request + reputation management"
      weakness: "no category-level review intelligence; ScoutIQ 3.3★ satisfaction signal; financial rollup ≠ product vision"
      content_angle: "FeedbackWhiz manages your review requests. VOC AI tells you what the reviews actually mean."
      acquisition_trigger_overlap: ["T1_bad_launch_postmortem"]
    smartscout:
      url: smartscout.com
      stage: "early growth / bootstrapped-to-seed"
      price_popular_tier: "$97-$277/mo"
      wedge: "Amazon market mapping — who sells what, at what share"
      weakness: "structural data only, no review content intelligence; low penetration (11 App Store reviews)"
      content_angle: "SmartScout maps the market structure. VOC AI maps what customers inside that market actually want."
      acquisition_trigger_overlap: ["T4_category_entry_research"]
  adjacent_enterprise:
    brandwatch_sprinklr_medallia:
      stage: "enterprise (Cision/NYSE/PE); $500K-$500M ARR range"
      price_entry: "$800-$3,000/mo Brandwatch; $25K+ ARR Sprinklr; $50K+ ARR Medallia"
      wedge: "enterprise social listening + CX intelligence"
      weakness: "structurally inaccessible <$10M revenue; not Amazon-native; Amazon is one data source among hundreds; no PLG"
      content_angle: "Brandwatch costs $60K/year and takes 3 months to onboard. VOC AI costs $2,400/year and shows you category-level review intelligence in 60 seconds."
      acquisition_trigger_overlap: ["T2_competitor_intel_gap", "T5_new_role_onboarding"]

positioning_map:
  dimensions:
    x: "data depth on customer desire (structural/keyword → review intelligence)"
    y: "accessibility (enterprise sales-assisted → PLG self-serve)"
  white_space:
    primary: "high review depth × high self-serve accessibility — $99-$299/mo — uncontested"
    expansion: "high review depth × moderate accessibility — $2K-$10K/mo brand teams — partially occupied by VOC AI via Anker/Panasonic, needs explicit GTM"

gap_we_own_1sentence: >
  VOC AI is the only tool that combines 2B+ Amazon reviews indexed with category-level complaint 
  clustering in a self-serve product accessible to any operator or brand manager today — 
  answering the question keyword tools cannot: not how many people searched for this, 
  but what every person who already bought it keeps wishing was different.

competitive_risks:
  12_month:
    threat: "Helium 10 ships category-level review clustering into Platinum tier"
    mitigation: "Publish quantitative depth comparisons before Helium 10 forces the conversation; build cross-category benchmarking as moat"
    monitoring: "Helium 10 AI product release notes; 'category review trends' feature announcement"
  24_month:
    threat: "Threecolts acquires review analytics company OR Jungle Scout Cobalt matures into mid-market brand intelligence"
    mitigation: "Lock in enterprise reference customers; expand to multi-platform (Shopify, App Store, Walmart); deepen taxonomy schema"
    monitoring: "Threecolts M&A activity; Jungle Scout Cobalt case study page; new entrants >$5M seed in 'amazon review analytics'"

win_loss_patterns:
  picks_us:
    - trigger: "T3 — Helium 10 frustration ceiling; already have H10, need the layer it doesn't have"
    - trigger: "T1 — Bad launch diagnosis; need to know specifically what customers are complaining about"
    - trigger: "T4 — Category entry research; heard 'read reviews before you design' and needs scale"
    - trigger: "T2 — Team meeting competitor intel gap; manual Googling is embarrassing at team scale"
    - profile: "Price-insensitive on $199/mo; evaluating on depth and speed of insight"
  picks_competitor:
    - scenario: "New seller (<6 months) in 'learn basics' phase — Helium 10/Jungle Scout wins by default (tutorial ecosystem)"
      action: "Do not chase; let frustration ceiling develop; reach via T3 content at 6-12 month mark"
    - scenario: "Budget-constrained all-in-one buyer; trades review depth for breadth"
      action: "ROI calculator: 1 failed launch ($30K-$150K) vs. VOC AI ($2,400/yr) — make math visible"
    - scenario: "Trial user analyzed 1 ASIN, never saw category-level view; left thinking 'this is just ChatGPT'"
      action: "Onboarding must route immediately to category-level clustering view, not single-ASIN view — this is an activation problem, not a positioning problem"
    - scenario: "Enterprise procurement buyer; can't buy PLG without IT security review"
      action: "Provide SOC2 docs, security questionnaire template, named AE contact for secondary ICP"
    - scenario: "Review management / reputation management buyer; wants review request + auto-response"
      action: "Correctly lose this segment; do not add review response features to compete — dilutes intelligence positioning"

comparison_content_priorities:
  - page: "VOC AI vs Helium 10"
    angle: "keyword data vs customer desire data — two different questions"
    trigger: "T3"
    priority: 1
  - page: "VOC AI vs Jungle Scout"
    angle: "market size data vs customer complaint data — what you need before you design, not just before you source"
    trigger: "T4"
    priority: 2
  - page: "VOC AI vs Brandwatch (for SMB/mid-market)"
    angle: "Amazon-native depth at 1/20th the price; accessible to brand teams under $50M"
    trigger: "T2, T5"
    priority: 3
  - page: "VOC AI vs manual review reading + ChatGPT"
    angle: "20 reviews pasted vs 47,000 reviews indexed — different questions, different answers"
    trigger: "T1, T4"
    priority: 4

onboarding_aha_moment_fix:
  problem: "Trial users who analyze 1 ASIN think they're using a review summarizer (ChatGPT does this free)"
  fix: "Route all new trial activations to category-level view first — show complaint clustering across 50+ ASINs, not single-ASIN summary"
  metric: "Track % of trial users who reach category-level view within first session; target >60%"

content_angles_from_competitive_gaps:
  - angle: "The review data Helium 10 downloads but doesn't read"
    format: "comparison article / YouTube tutorial"
    hook: "Helium 10 lets you download 500 reviews. Here's what you actually need to do with them — and why downloading is not analyzing."
  - angle: "What happens when a brand manager says 'what are customers complaining about in [competitor ASIN]?'"
    format: "LinkedIn narrative post / case study"
    hook: "In a product meeting, someone asked our team to find the top 3 complaints about [competitor brand]'s new product. Here's how we answered in 90 seconds."
  - angle: "The gap between Jungle Scout and VOC AI is a $30,000 product launch mistake"
    format: "ROI calculator landing page"
    hook: "Jungle Scout told us the category did $2M/month. It didn't tell us 40% of buyers in that category share the same complaint. We found out the expensive way."
  - angle: "Why Brandwatch costs $60K and VOC AI costs $2,400 — and what you actually need"
    format: "comparison landing page / LinkedIn thought leadership"
    hook: "Enterprise brands pay $60K/yr for social listening. The intelligence they actually use — Amazon review analysis — costs $2,400/yr elsewhere."
```