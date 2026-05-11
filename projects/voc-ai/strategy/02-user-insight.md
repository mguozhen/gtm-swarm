# User Insight — VOC AI

## 一、ICP（Ideal Customer Profile, 三层）

### 1.1 主受众（primary, 70% 内容资源）

**Firmographic**
- **Role**: Amazon Brand Manager / Head of Product (at DTC-first brand) — or solo Amazon FBA operator wearing both hats
- **Company size**: 5–50 employees (or 1–3 person FBA operation with contractors)
- **Revenue range**: $500K–$8M annual Amazon GMV
- **Tech stack**: Helium 10 or Jungle Scout (already paying), Seller Central, Google Sheets, sometimes Notion; may have tried ChatGPT for manual review summarization
- **Geo**: US (primary), UK/DE/CA (secondary)
- **Catalog profile**: 3–25 SKUs, at least one product with 200+ reviews; launching 1–3 new products per year

**Psychographic**
- **Core belief**: "Data beats gut — but I'm drowning in the wrong data." They distrust their own instincts after one bad product launch, yet the data tools they have (keyword rank, BSR) don't explain *why* a product is failing or succeeding.
- **Core fear**: Launching a product that already has a solvable-but-invisible problem — and learning about it only after manufacturing 2,000 units. Secondary fear: a competitor finding a gap in *their* listing reviews before they do.
- **Aspiration**: To be the seller who "knows something competitors don't" — to find the product improvement or the untapped variant before anyone else. They romanticize the idea of being review-first, not keyword-first.
- **Self-image**: Analytical, scrappy, resourceful. They read r/fulfillmentbyamazon religiously. They've watched every Helium 10 YouTube tutorial. They feel slightly embarrassed spending 3 hours manually reading reviews in a spreadsheet.

**Trigger event (1 sentence)**
They just received a batch of 1-star reviews on a product they thought was solid, and their Helium 10 dashboard shows nothing useful — the keyword ranks are fine, but sales dropped 18% in 30 days and they don't know why.

---

### 1.2 次受众（secondary, 25% 内容资源）

**Firmographic**
- **Role**: Product Research Manager, Consumer Insights Analyst, or Senior PM at a mid-size brand with dedicated Amazon presence
- **Company size**: 100–2,000 employees; brand is either a hardware/electronics company or CPG company with Amazon as one of 3+ channels
- **Revenue range**: $10M–$500M overall company revenue; Amazon channel $2M–$50M
- **Tech stack**: Internal BI dashboards (Tableau/Looker), Brandwatch or Sprinklr contract (often not renewed due to cost), regular Qualtrics surveys, ad-hoc ChatGPT use
- **Geo**: US HQ, often with global sales (EU/JP markets)
- **Reference customers already in this bucket**: Anker, Panasonic, Dreame, Insta360

**Psychographic**
- **Core belief**: "Amazon reviews are the world's largest unmoderated product feedback panel — and we're barely using them."
- **Core fear**: Their Qualtrics surveys are too slow and too coached; their Brandwatch contract is $60K/yr and nobody knows how to use it; a startup competitor (who has no survey budget) is making better product decisions because they're reading reviews at scale.
- **Aspiration**: Replace a quarterly consumer research cycle with real-time review intelligence. Present at the next product roadmap meeting with "here's what 40,000 customers actually said about our competitor's latest model."

**Trigger event (1 sentence)**
They're in a quarterly product planning meeting and someone asks "what are the top 3 complaints about [competitor brand]'s new product?" — and nobody in the room has an answer faster than "I'll look it up manually and get back to you."

---

### 1.3 排除受众（explicitly NOT for, 5%）

- **Amazon consumer reviewers / influencers seeking affiliate income**: CIA TikTok data shows massive consumer-side mindshare around "how to become an Amazon reviewer" (@haileenwcarvalho, 1.3M plays). These users have near-zero tool budget ($0–$20/mo ceiling) and a completely different job-to-be-done. They would drain support, abuse free tiers, and contaminate ICP signal. **Do not target this audience with paid content or trials.**
- **Enterprise procurement-led buyers (Fortune 50 CPG, Procter & Gamble tier)**: Sales cycle >6 months, SOC2 + procurement compliance required, ARPU negotiation grinds below product value. These accounts require a dedicated enterprise GTM that VOC AI isn't resourced for today.
- **Pure keyword/PPC arbitrage sellers** (dropshippers, low-volume resellers with <$50K GMV): They have no interest in review quality — only in rank manipulation. They churn fast and do not value the core product.
- **Aggressively review-gating sellers**: Anyone whose primary use case is review manipulation or TOS circumvention. They will misuse the product and create platform risk.

---

## 二、Top 5 痛点（ranked by economic cost）

| # | 痛点 | 现状 cope 方式 | 年成本 / 时间 / 风险 | 数据出处 |
|---|---|---|---|---|
| 1 | **Launching a product blind** — no systematic way to read what 1-star reviews across an entire *category* are saying before committing to a SKU. Bad launches cost inventory, PPC spend, and 6–12 months of runway. | Manually reading 30–50 reviews on 5–10 competitor ASINs in Google Sheets; Helium 10 keyword data as a proxy for "demand" without understanding "unmet need." | $30K–$150K per failed launch (COGS + PPC + storage fees + lost opportunity cost). Even a $100K/yr brand manager spending 4 hrs/week on manual review reading = $10K/yr in salary waste alone. | `[LLM derived from positioning + CIA TikTok: @olababstheanalyst "Excel to analyze Amazon listings/reviews" = 729 plays — confirms DIY review analysis is a real workaround]` |
| 2 | **Can't explain why a product is underperforming** — sales drop but keyword ranks haven't moved; no bridge between "customers are unhappy" and "specifically about what." | Re-reading their own listing reviews; guessing based on PPC CTR drop; asking their VA to manually tag reviews by topic. | 18–25% revenue decline on a $300K/yr ASIN = $54K–$75K before they identify the root cause. Monthly diagnostic delay = 2–4 weeks of continued underperformance. | `[LLM derived]` |
| 3 | **Competitor product intelligence is manual and slow** — product managers at brands like Dreame/Insta360 need to know what customers hate about a competitor's SKU *before* their own launch, not after. | Manually pulling competitor reviews, copy-pasting into ChatGPT, asking for summary. Ad hoc, inconsistent, not repeatable across a team, not tracked over time. | Brand manager at $50M/yr company: 6 hrs/week × 52 × $75/hr loaded = $23,400/yr in analyst time. Multiplied across 3–4 PMs = $70K–$90K/yr in wasted research capacity. Plus launch timing risk if a competitor blind spot is missed. | `[LLM derived from L7 reasoning in Step 1 + CIA: Anker/Panasonic/Dreame active customers signals this is a real use case]` |
| 4 | **No way to prioritize product improvement roadmap from real customer feedback** — they have reviews, but no systematic way to cluster them, weight them by review recency or verified purchase, or track which issue clusters are growing vs. stable. | Quarterly "voice of customer" reports built manually by a junior analyst, or Qualtrics surveys that ask customers to self-report (coached, incomplete, slow). | Qualtrics platform: $15K–$50K/yr. Human analyst time: $40K–$80K/yr equivalent. Survey completion lag: 4–8 weeks from design to insight. Real-time review cluster shift (e.g., new manufacturing defect appearing) missed for 60–90 days. | `[LLM derived + CIA: App Reviews Pain table empty — signals this pain is not yet being captured in tool reviews, i.e., market education gap]` |
| 5 | **Helium 10 / Jungle Scout show keyword demand but not customer desire** — users know there are 80,000 monthly searches for "cordless vacuum" but have no idea which specific problems (battery life, suction on carpet edges, weight) are the actual deciding factor for 1-star vs 5-star. | Toggle to Helium 10's "Review Insights" tab (limited, shows volume not meaning); fall back to manual reading. Cognitive load high, not scalable past 2–3 ASINs. | Switching cost of staying on Helium 10 despite inadequacy: $197–$397/mo ($2,400–$4,800/yr) for a tool that doesn't solve this specific job. Opportunity cost: every week they don't know the real customer complaint cluster is a week a competitor who does know it can outmaneuver them on listing copy, product design, or PPC targeting. | `[CIA App Store: ScoutIQ 3.3★ (554 reviews) — dissatisfied users in business research app cluster; SmartScout 4.6★ only 11 reviews = low penetration; signals incumbents not fully satisfying users]` |

---

## 三、Buying Triggers（5 个 EVENTS）

| Trigger event | Predicted prevalence | What they Google / ask after |
|---|---|---|
| **T1 — The Bad Launch Post-Mortem**: Just launched a product, 3 months in, reviews averaging 3.2★ with a cluster of complaints about one specific feature. PPC is burning, rankings slipping. They need to understand *specifically what to fix* for the next batch — and whether to kill or pivot. | High (~40% of active FBA sellers launch at least one underperformer per year) | "how to analyze amazon 1 star reviews at scale", "why is my amazon product getting bad reviews", "amazon review analysis tool", "what do customers hate about [category]" |
| **T2 — The Competitor Intel Gap**: In a product meeting, a PM or founder says "let's see what customers are complaining about in [competitor ASIN]" — someone Googles it, reads 10 reviews, and realizes this process is embarrassing and unscalable for a team. | Medium-high (every brand with >3 competitors experiences this monthly) | "how to analyze competitor amazon reviews", "amazon competitor product weakness finder", "bulk amazon review analysis", "amazon review intelligence tool" |
| **T3 — The Helium 10 Frustration Ceiling**: They've been using Helium 10 for 6–18 months, hit the ceiling of what keyword data tells them, and feel like they're optimizing the wrong variable. They know demand exists but can't translate it into product decisions. Common trigger: someone in a Facebook group or Podcast mentions "review-first research." | Medium (most Helium 10 power users hit this ceiling within 12 months) | "helium 10 alternative review analysis", "beyond keyword research amazon", "amazon customer sentiment tool", "product research using reviews not keywords" |
| **T4 — The Category Entry Research Moment**: They're evaluating entering a new product category. Standard playbook: keyword research first. But after reading r/fulfillmentbyamazon threads or a podcast, they hear "read 500 reviews before you design anything." They need a tool to do this at scale — not 3 days of manual reading. | High (every new product launch cycle involves this phase) | "how to find product opportunities from amazon reviews", "amazon review mining tool", "product gap finder amazon category", "untapped product niche 2025" |
| **T5 — The New Role Onboarding**: A new product manager, brand analyst, or e-commerce director joins a brand that sells on Amazon. They need to get smart on the category fast. Their first instinct is to read reviews. They immediately realize manually reading 10,000 reviews isn't feasible. | Medium (role changes happen; new team members are high-intent tool evaluators with fresh budgets) | "amazon review analytics software", "how to get insights from amazon reviews", "voice of customer amazon tool", "best amazon seller research tools 2025" |

---

## 四、Top 3 Objections + 最强 Counter

| Objection | Counter (1 sentence, evidence-backed) |
|---|---|
| **"I already have Helium 10 / Jungle Scout — why do I need another tool?"** | Helium 10 tells you the keyword volume; VOC AI tells you *why* the top-ranking product has 847 reviews saying the lid cracks after 3 uses — two entirely different questions, and only one of them tells you what to build next. |
| **"I can just paste reviews into ChatGPT and get the same thing for free."** | ChatGPT analyzes the 20 reviews you paste; VOC AI analyzes the 47,000 reviews across an entire category — including 3-year trend shifts, verified-purchase weighting, and cross-ASIN complaint clustering that no manual paste ever surfaces. |
| **"Amazon reviews aren't reliable — they're gamed / fake."** | Fake reviews cluster around 5-star ratings; the 1-star and 2-star review corpus — especially verified purchases over time — is the least gamed data set in consumer feedback because no seller pays for their own negative reviews; this is exactly the signal VOC AI is built on. |

---

## 五、Vocabulary Audit

### 5.1 词汇他们用（自描述 + 行业黑话）

**Tier 1 (always — native vocabulary, use in every touchpoint)**
- "1-star reviews" / "negative reviews" (not "critical feedback")
- "product opportunity" / "product gap" (not "market gap" — too academic)
- "launch" (verb + noun — "our last launch", "before I launch")
- "listing" (not "product page" or "PDP")
- "BSR" (Best Seller Rank — use the acronym, they do)
- "PPC" / "ACOS" (ad context — signals budget consciousness)
- "what customers are saying" / "what customers actually want" (their natural phrasing)
- "category" (not "vertical" or "segment")
- "competing ASINs" / "competitor ASIN" (ASIN is their unit of analysis)
- "FBA" (not "Amazon fulfillment" or "third-party seller")

**Tier 2 (often — use in longer-form content, not headlines)**
- "review mining" (emerging term, they've encountered it but don't fully own it yet)
- "customer sentiment" (they've heard it; Brandwatch-adjacent, slightly enterprise-feeling)
- "pain points" (they use this; it's fine but generic)
- "product-market fit" (indie hacker crossover audience uses it; FBA sellers less so)
- "voice of customer" / "VOC" (enterprise audience uses this naturally; SMB FBA sellers less so — don't lead with this acronym in SMB content)
- "variant" (product variant — they think in variants, not SKUs sometimes)
- "conversion rate" / "CVR" (listing optimization context)
- "review velocity" (power users understand this term)

### 5.2 词汇他们不用（销售感 / 学术 / 平台感 — 避雷）

- ❌ "actionable insights" — empty marketing language, triggers immediate distrust
- ❌ "360-degree view of your customer" — enterprise sales deck language
- ❌ "leverage" (as a verb) — MBAspeak
- ❌ "sentiment analysis" as a lead phrase — too technical for SMB FBA sellers; fine for brand managers
- ❌ "consumer intelligence platform" — Brandwatch/Sprinklr positioning, not how FBA sellers think
- ❌ "synergy" / "ecosystem" / "robust" — all red flags for experienced software buyers
- ❌ "NLP" / "machine learning" / "transformer model" — they don't care; feature, not benefit
- ❌ "feedback loop" — consultant-speak
- ❌ "holistic" — immediately sounds like enterprise fluff
- ❌ "disrupting the X industry" — they've been burned by this language in ad copy

### 5.3 触发情绪词（pain + relief language pairs）

| Pain phrase | Relief phrase |
|---|---|
| "I wasted 3 months on a product that had an obvious fixable problem — I just didn't know" | "Know the exact thing customers keep complaining about before you place your manufacturing order" |
| "I spent 4 hours reading reviews in a spreadsheet and still don't have a clear answer" | "Get the top 10 complaint clusters from 5,000 reviews in under 60 seconds" |
| "Helium 10 shows me demand but not *why* anyone buys or returns" | "See the review data Helium 10 doesn't show — what customers love, hate, and wish were different" |
| "My competitor launched something better than my product and I didn't see it coming" | "Track what customers are saying about any ASIN in real time — know your competitor's weak spots before their next launch" |
| "I feel like I'm guessing at what to improve" | "Stop guessing. The answer is already in the reviews — you just couldn't read all 40,000 of them" |
| "I don't know if this category is saturated or if there's still a gap" | "Find the recurring complaint no product in this category has solved yet — that's your gap" |

---

## 六、Channel × Trigger 映射

| Trigger | First search platform | Discovery channels | Decision channels |
|---|---|---|---|
| **T1 — Bad Launch Post-Mortem** | Google: "why is my amazon product getting bad reviews" / "how to analyze amazon reviews" | Reddit (r/fulfillmentbyamazon, r/AmazonFBA); YouTube tutorials; FBA Facebook groups | Demo video on YouTube; G2/Trustpilot reviews of the tool; free trial with own ASIN data |
| **T2 — Competitor Intel Gap (team moment)** | Google: "amazon competitor review analysis tool" / "bulk review analysis amazon" | Podcast mention (My Wife Quit Her Job, Serious Sellers); LinkedIn post from a seller | Case study content ("how [brand] used review data to find competitor weak spots"); comparison landing page |
| **T3 — Helium 10 Frustration Ceiling** | Google: "helium 10 alternative" / "amazon review insights tool" | Reddit: r/fulfillmentbyamazon thread; TikTok / YouTube comparison videos | Comparison page "VOC AI vs Helium 10"; free trial targeted at Helium 10 users; email sequences |
| **T4 — Category Entry Research** | Google: "how to find product opportunities from reviews" / "amazon product gap analysis" | YouTube: "amazon product research 2025"; TikTok: FBA creator content; IndieHackers/r/SideProject | Free category report (lead magnet); tool demo with live category example |
| **T5 — New Role Onboarding** | Google: "best amazon seller research tools 2025" / "amazon review analytics software" | G2, Capterra, ProductHunt; LinkedIn colleague recommendation | Onboarding experience quality; in-app aha moment speed; team sharing/collaboration features |

**Channel priority implications for the 11 GTM Agents:**
- **SEO Agent**: T1, T3, T4 have clear Google search behavior — these 3 triggers should drive pillar content and programmatic SEO (category-level report pages)
- **Reddit Agent**: T1 and T3 are heavily Reddit-influenced; authentic participation in r/fulfillmentbyamazon and r/AmazonFBA is highest-leverage dark funnel activity
- **TikTok/Short Video Agent**: T4 has massive creator-side mindshare (CIA: 15.1M plays @justicebuys product review content); bridge consumer content to seller tool discovery
- **LinkedIn Agent**: T2 and T5 are professional-context triggers — LinkedIn is where PMs and brand managers self-diagnose
- **Email/Nurture Agent**: T1 (post-bad-launch) users are in high emotional distress = high receptivity to nurture sequences with case studies

---

## 七、Top 3 用户访谈问题（for Founder to actually run）

These are questions to ask 5 real current customers (ideally 2 SMB FBA sellers + 2 brand-side users + 1 churned user) this week. They are designed to surface the actual language, event, and decision logic — not to confirm what we already believe.

**Q1: "Walk me through the last time you had to understand why a product was underperforming or why a competitor's product was winning. What did you do, step by step, and how long did it take?"**

*Why this question*: Reveals the actual pre-VOC-AI workflow (the true competitive alternative is manual reading + ChatGPT, not Helium 10). Captures precise vocabulary ("I opened a spreadsheet…", "I asked my VA to…", "I pasted it into ChatGPT and…"). Also reveals *where the pain peaked* — which becomes the "before" story in case study content.

**Q2: "What decision did you make — or almost made differently — because of something you found in VOC AI? What would you have done without it?"**

*Why this question*: Surfaces the real economic value delivered (and lets us quantify it for pain point ranking). Also validates whether the product's value is in *decision support* (research before launch) or *ongoing intelligence* (monitoring after launch) — two different content angles and retention mechanics.

**Q3: "If VOC AI disappeared tomorrow, what would you do first? And what's the first thing you'd tell a colleague this tool does?"**

*Why this question*: The "disappear" question reveals true lock-in vs. convenience. The "tell a colleague" question captures the organic referral language in the user's own words — this is the single most valuable input to the vocabulary audit and the hook library. Whatever they say in the second sentence is the headline for the next 10 ads.

---

## 八、对 Step 1 假设的回看

| Step 1 假设 | Step 2 用户层面证据 | 是否需要调整 Step 1 |
|---|---|---|
| **"True competitive alternative is manual reading + ChatGPT, not Helium 10"** | Step 2 confirms this strongly. Buying trigger T3 (Helium 10 frustration ceiling) positions VOC AI as *post*-Helium 10, not instead of it — users typically have Helium 10 AND are looking for review-depth intelligence on top. The vocabulary audit confirms "what customers are actually saying" is the native framing, not "better keyword tool." | **Adjust**: Step 1's "vs Helium 10" competitive framing is strategically useful for SEO/comparison content, but the user-layer job-to-be-done is "replace my 4-hour manual review reading session" — content should lead with this, not lead with feature comparison. Reinforce Step 1's recommendation to reduce "vs Helium 10" as primary positioning. |
| **"Primary ICP is Amazon FBA sellers $100K-$10M"** | Partly validated, but Step 2 reveals two clearly distinct user psychologies within this range: (A) solo operators <$500K GMV who are highly price-sensitive ($99-199/mo ceiling, make decisions in hours, self-serve), and (B) operators $500K-$8M who are building teams, have research budgets, and have a longer evaluation cycle. The buying triggers are meaningfully different (T1/T4 vs T2/T3). | **Adjust Step 1**: Split the SMB ICP further. The $100K-$500K band is PLG/self-serve with content-led discovery; $500K-$8M is semi-assisted with community + referral + comparison content. This affects Step 4 content strategy significantly — two separate content tracks, not one. |
| **"Anker/Panasonic customers validate enterprise lane"** | Confirmed in Step 2. The enterprise user (secondary ICP 1.2) has a completely different trigger (T2: team meeting moment) and a different vocabulary ("voice of customer," "consumer insights," "product roadmap") vs. the SMB FBA seller. The economic cost calculation also differs: enterprise pain is analyst salary waste ($70K-$90K/yr) and launch timing risk, not just tool fee ROI. | **Reinforce Step 1**: The two-lane GTM model (PLG SMB vs. enterprise assisted) is validated by user-layer evidence. L7 (competitor benchmarking) is the enterprise use case most clearly evidenced by existing customers. Step 1's L7 star rating of ⭐⭐⭐⭐ holds; this Step 2 raises confidence. |
| **"TikTok is an underutilized B2B channel for this category"** | Partially confirmed with a nuance. CIA TikTok data shows the consumer/influencer side dominates "amazon review intelligence" content (1.3M-15.1M plays), but the *seller tool* content is nearly absent (@bluebugio "AI Review Analytics 2025" = 122 plays). Step 2 shows the FBA seller community *does* live on TikTok (they follow Amazon influencer content), but the trigger to evaluate a seller tool typically happens on Google or Reddit, not TikTok. TikTok's role is awareness/education (top of funnel T4), not conversion. | **Refine Step 1**: TikTok is validated as a channel but primarily for L3/L6 content (product opportunity discovery narratives, educational hooks) — not for driving direct trial. The conversion path is TikTok → Google → Reddit → Trial, not TikTok → Trial. Content strategy should plan for this 3-step path, not assume TikTok directly converts. |
| **"L3 (opportunity discovery) has no tool king — highest priority"** | Confirmed by Step 2. Buying trigger T4 (category entry research) is real, recurring, and currently served by painful manual alternatives. The vocabulary around this use case ("find product opportunities," "review mining," "what no one in this category has solved") is emotionally charged and specific. However, Step 2 surfaces a risk not fully in Step 1: this use case is *episodic*, not *continuous*. Users in T4 mode are high-intent but may churn after the research phase if there's no ongoing monitoring hook to retain them. | **Add to Step 1**: L3 is correctly rated ⭐⭐⭐⭐⭐ for acquisition potential, but needs a retention mechanic (recurring "category watchdog" alerts, competitive ASIN monitoring) to convert from a one-time research tool into a recurring subscription product. Without this, L3 users convert well but churn fast. Step 3 (competitor analysis) should investigate whether any incumbent solves this retention problem. |

---

## 九、Data Gaps

The following CIA pipeline runs would materially improve this brief and should be prioritized before Step 3 (Competitor Analysis):

**1. App Reviews — Real Pain Data from Competitor Apps**
Current App Reviews (Pain) table is empty. The following app_ids from the CIA Competitor Apps table have sufficient review volume to yield genuine pain-point vocabulary:
- `1494755014` — Amazon Shopper Panel (180,422 reviews) — consumer pain ≠ seller pain, but review UX complaints may surface relevant vocabulary
- `1265325528` — ScoutIQ by Threecolts (554 reviews, 3.3★) — **highest priority**: low rating in the Business cluster almost certainly contains direct complaints about review analysis capability gaps
- `511248011` — Scoutly (872 reviews, 4.4★) — FBA tool; dissatisfied review minority will surface specific unmet needs
- `1289515640` — tool4seller (114 reviews, 4.7★) — smaller but highly relevant FBA audience
- `1604306734` — SmartScout (11 reviews) — too small; skip for now

Run: `scripts/cia-for-project.sh voc-ai "app_reviews" --app_ids 1265325628,511248011,1289515640`

**2. Reddit — Seller Community Pain Threads**
Current Reddit data (3 rows) is entirely consumer viral posts. The seller community pain is unrepresented. Run Apify Reddit scrape with the following query strings against r/fulfillmentbyamazon, r/AmazonFBA, r/AmazonSeller:
- `"how to analyze amazon reviews"`
- `"1 star review analysis"`
- `"helium 10 review insights"`
- `"competitor review research"`
- `"product research using reviews"`
- `"amazon review tool recommendation"`

These subreddits have active daily discussion and will yield verbatim pain language within 24 hours of scraping.

**3. TikTok — Seller-Side Hook Patterns**
Run TikTok search with seller-oriented query strings to find the low-volume but high-intent creator content that exists for FBA sellers (distinct from the consumer influencer content the CIA already returned):
- `"amazon fba product research 2025"`
- `"how I find product opportunities amazon"`
- `"amazon review mining"`
- `"helium 10 vs"`

Look specifically for videos with <50K views from accounts with "fba," "seller," "ecom," "amazon business" in bio — these are the peer educators the target ICP follows.

---

## 十、Key Assumptions

The following 5 assumptions underpin this user model. If any one is invalidated, the ICP, trigger mapping, or vocabulary audit needs revision:

**A1 — "The primary mental model is 'I need to understand what customers actually say,' not 'I need another seller tool.'"**
This assumption drives the entire vocabulary audit and pain-point framing. If user interviews reveal the primary mental model is actually "I want to beat Helium 10 at keyword research" (i.e., they frame the problem as keyword strategy, not customer understanding), then the "review-first vs keyword-first" positioning is correct but the vocabulary needs to shift toward keyword/ranking language rather than customer language.
*Invalidation signal*: In Q3 user interviews, fewer than 2 of 5 users spontaneously mention "what customers are saying" or equivalent phrasing — instead defaulting to keyword/BSR framing.

**A2 — "The buying decision is made by the same person who feels the pain (individual practitioner or owner), not by procurement."**
This drives the self-serve PLG assumption for the SMB ICP. If SMB FBA sellers ($500K-$8M) actually route tool evaluations through a business partner, spouse, or small team consensus, then trial-to-paid conversion needs a multi-user/share feature and the content strategy needs to address skeptical co-decision-makers.
*Invalidation signal*: >40% of trial signups show multiple user accounts evaluating together within 7 days; or free trial churn interviews reveal "my partner didn't see the value" as a top reason.

**A3 — "The trigger for evaluation is an acute pain event (bad launch, competitor gap moment), not a chronic low-grade awareness."**
This drives the trigger-event content strategy (T1-T5 above). If users are primarily found in a "passive discovery" state (browsing content, no acute pain), then top-of-funnel awareness content matters more than trigger-matched SEO content.
*Invalidation signal*: Signup source analysis shows >50% of trials come from non-trigger-matched content (e.g., generic "amazon seller tools" searches rather than pain-specific queries).

**A4 — "Users have already accepted that AI can process reviews at scale — they don't need to be sold on AI; they need to be sold on the specific insight output."**
This drives the vocabulary decision to avoid "NLP / machine learning" language and instead lead with output-first framing ("see the top 10 complaints in 60 seconds"). If the target ICP is still skeptical of AI-generated summaries (fears hallucination, distrusts automation), then trust-building content (methodology transparency, accuracy proof) needs to be primary, not secondary.
*Invalidation signal*: In user interviews, Q1 reveals that users still double-check AI outputs manually for every decision — "I don't fully trust it yet" appears in >3 of 5 interviews as an unprompted concern.

**A5 — "The episodic use case (category research at launch) is sufficient to generate initial conversion, and retention can be solved with ongoing monitoring features."**
This is the Step 1 L3 retention risk surfaced in Section 八 above. If the product doesn't currently have strong ongoing monitoring hooks (e.g., "alert me when a competitor's review complaint cluster shifts"), then trial-to-annual-subscription conversion will be poor even if trial activation is high — users will love the product for one research session and then have no reason to return for 3 months.
*Invalidation signal*: Free trial conversion to paid <5%; or paid monthly-to-annual upgrade rate <20%; or NPS score high but monthly active usage <2 sessions/month after the first week.

---

```yaml
# AGENT-HYDRATION BLOCK (Step 3 Competitor Analysis + Step 4 Content Strategy)

icp_primary:
  label: "Amazon FBA Brand Operator"
  revenue_range: "$500K–$8M GMV"
  tool_stack: ["Helium 10", "Jungle Scout", "Seller Central", "Google Sheets"]
  core_fear: "Launching a product with an invisible fixable problem after spending on inventory"
  core_aspiration: "Know something competitors don't before the manufacturing order"
  price_ceiling_monthly: 299
  decision_speed: "hours to 2 weeks"
  gtm_motion: "PLG self-serve + content-led"

icp_secondary:
  label: "Brand Product Manager / Consumer Insights Lead"
  company_revenue: "$10M–$500M"
  existing_tools: ["Brandwatch (expensive, underused)", "Qualtrics (slow)", "ChatGPT (ad hoc)"]
  core_fear: "Competitor making better product decisions with review data while we run Qualtrics surveys"
  price_ceiling_monthly: 5000
  decision_speed: "4–12 weeks"
  gtm_motion: "Sales-assisted + case study content (Anker/Panasonic reference)"

buying_triggers_ranked:
  T1: "bad_launch_postmortem"
  T2: "competitor_intel_gap_team_moment"
  T3: "helium10_frustration_ceiling"
  T4: "category_entry_research"
  T5: "new_role_onboarding"

vocabulary_tier1:
  use_always: ["1-star reviews", "negative reviews", "product opportunity", "product gap", "listing", "launch", "category", "competing ASINs", "what customers are actually saying", "FBA", "BSR"]
  avoid: ["actionable insights", "360-degree view", "leverage", "holistic", "robust", "consumer intelligence platform", "sentiment analysis (as lead phrase for SMB)"]

pain_relief_pairs:
  - pain: "wasted 3 months on a product with an obvious fixable problem"
    relief: "know the exact complaint clusters before you place your order"
  - pain: "4 hours reading reviews in a spreadsheet with no clear answer"
    relief: "top 10 complaint clusters from 5,000 reviews in under 60 seconds"
  - pain: "Helium 10 shows demand but not why anyone returns"
    relief: "see the review data Helium 10 doesn't show"
  - pain: "competitor launched something better and I didn't see it coming"
    relief: "track any ASIN in real time — know competitor weak spots before their next launch"

channel_priority:
  acquisition:
    - channel: "SEO / Google"
      triggers: ["T1", "T3", "T4"]
      content_type: "pain-matched landing pages + category-level review report lead magnets"
    - channel: "Reddit (r/fulfillmentbyamazon, r/AmazonFBA)"
      triggers: ["T1", "T3"]
      content_type: "authentic participation + case study comments (not self-promotion)"
    - channel: "TikTok / YouTube Shorts"
      triggers: ["T4"]
      content_type: "opportunity discovery narrative ('I found a gap no one has solved in [category]')"
    - channel: "LinkedIn"
      triggers: ["T2", "T5"]
      content_type: "brand PM case studies, competitive benchmarking data storytelling"
  conversion:
    - channel: "Free trial with own ASIN data"
      note: "T1 and T4 users convert fastest when they can immediately analyze their own category"
    - channel: "Case study content (Anker/Panasonic)"
      note: "T2 users (enterprise) convert on social proof, not feature lists"
  retention:
    - channel: "Ongoing ASIN monitoring alerts"
      note: "Critical for L3 (opportunity discovery) ICP — prevents episodic churn"

data_gaps_priority:
  1: "App Reviews Pain — ScoutIQ (app_id: 1265325528), Scoutly (511248011), tool4seller (1289515640)"
  2: "Reddit scrape — r/fulfillmentbyamazon × 6 query strings (see Section 九)"
  3: "TikTok seller-side content — FBA-specific query strings (see Section 九)"
  4: "Ahrefs KW — 'helium 10 alternative', 'amazon review mining tool', '1 star review analysis', 'product gap finder amazon'"
  5: "AI Visibility scan — 'best tool to analyze Amazon product reviews' across ChatGPT/Perplexity/Claude"

step3_competitor_watch:
  priority_threats:
    - name: "Threecolts (FeedbackWhiz + ScoutIQ bundle)"
      reason: "Actively acquiring review-adjacent tools; ScoutIQ 3.3★ dissatisfaction = user migration opportunity"
    - name: "SmartScout"
      reason: "4.6★ rating, market analysis positioning, growing business cluster penetration"
    - name: "Helium 10 'AI' feature expansion"
      reason: "2025 AI roadmap could absorb review analytics into existing bundle, removing switching motivation"
    - name: "Amazon native 'Review Highlights' / AI summary"
      reason: "Commoditizes consumer-side review summary; but explicitly cannot provide competitor cross-ASIN intelligence"
  retention_mechanic_gap:
    note: "No incumbent appears to offer real-time category-level complaint cluster shift alerts — this is the retention feature VOC AI should build to convert L3 (opportunity discovery) users from episodic to recurring"
```