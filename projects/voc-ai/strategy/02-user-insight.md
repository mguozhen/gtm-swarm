# User Insight — VOC AI

## 一、ICP（Ideal Customer Profile, 三层）

### 1.1 主受众（primary, 70% 内容资源）

**Consumer Insights / VOC Manager at Mid-Market & Enterprise Consumer Brand（>$100M revenue, Amazon 是 top-3 渠道）**

- **Firmographic**：
  - **Role**：Director / Senior Manager of Consumer Insights、VOC Lead、Brand Insights Manager、Director of E-commerce Analytics
  - **Company size**：500–10,000 FTE，年营收 $100M–$10B
  - **Revenue range**：Amazon 渠道贡献 ≥ 15% of total D2C revenue（典型如 Anker / ESR / Insta360 / Dreame 这种 Amazon-native 品牌；或 Panasonic / Bose / Logitech 这种 Amazon 是 top-3 渠道的传统品牌）
  - **Tech stack**：已经在用 Brandwatch / Sprinklr / Talkwalker（社交侧）+ Profitero / Stackline / Cobalt（电商侧），Tableau / Looker for BI，Slack for ops，Salesforce for CRM
  - **Geo**：北美总部（US 60% / Canada 5%），西欧（UK / DE 15%），亚太总部品牌（CN HQ / JP HQ 各 10%）
- **Psychographic**：
  - **Belief**：「品牌健康 = social listening + ecommerce listening 的合集，但目前没人能把后半段做对」
  - **Fear**：被 CMO 在季度会问"Amazon 上有没有什么我们没看见的差评叙事正在发酵"，自己只能拿到 Brandwatch dashboard + 一份手工 Excel review 摘要
  - **Aspiration**：成为「品牌-产品-供应链」三方在评论维度的唯一信息源，季度报告里有一页是自己独家产出，CMO 在董事会引用
- **Trigger event**：「Brandwatch / Sprinklr 合同进入 60 天 renewal window，CFO 让 Insights 团队解释为什么花 $180K/年但回答不了 "Anker 充电宝 Q3 在 Amazon 上为什么差评升 40bps" 这种问题」

### 1.2 次受众（secondary, 25% 内容资源）

**Director / VP of E-commerce at $50M–$500M Consumer Brand（"Amazon 是赚钱主战场"的品牌方）**

- **Firmographic**：
  - **Role**：VP of E-commerce、Director of Amazon、Head of Marketplace、Senior Brand Manager (Amazon)
  - **Company size**：100–2,000 FTE，年营收 $50M–$500M
  - **Tech stack**：Helium 10 / Jungle Scout（轻度，给团队执行用）+ Profitero / Stackline（重度，给自己做汇报用）+ 内部 Amazon Brand Analytics + Helium 10 / Datahawk
  - **Geo**：US 70% / EU 20% / APAC HQ 10%
- **Psychographic**：
  - **Belief**：「Amazon 已经是 50%+ revenue，但 organization 还在用 social-first 工具假装在听用户」
  - **Fear**：竞品（同品类下一家 brand）某条新品悄悄抢了 share of voice，自己 6 周后才在 Profitero 月报里发现
  - **Aspiration**：把 Amazon review intelligence 升级成 "weekly product team standing input"，让 R&D 团队相信 Amazon 数据 = 真用户声音
- **Trigger event**：「NPI（new product introduction）launch 30 天后，retention 不及预期，需要快速回答"是 review 里某个 pain 没解决吗"，但手上工具只有 Helium 10 review export → 给团队半天时间手工读 200 条」

### 1.3 排除受众（explicitly NOT for, 5%）

> 显性排除，反向锐化定位。

- **Amazon FBA SMB seller, $100K–$10M GMV**：他们不付 $5K+/mo，他们的工作流是"搜词→看销量→选品"，review intelligence 不是他们的 first principle。继续讨好这群人会让定价、UI、销售话术全部分裂。**这群人是 Helium 10 / Jungle Scout 的人，不是 VOC AI 的人。**
- **Customer Support Manager / CX Director**：他们想要的是"自动回评论 + 工单系统"，buyer persona 是 Gorgias / eDesk 的客户，不是 Brandwatch 的客户。把产品做给他们会让 Insights / Brand 团队觉得你是个客服 SaaS。
- **B2B SaaS PM**：Productboard / Enterpret / Anecdote.ai 的战场。即使技术栈 80% 重叠，GTM 100% 不同，未来 24 个月不碰。
- **Indie hacker / solopreneur 找选品灵感**：Exploding Topics / Glimpse 的客群，LTV 太低，会污染 funnel signal。

---

## 二、Top 5 痛点（ranked by economic cost）

> 排序按：每年因为这件事白花的人时 × FTE 时薪 + 误判带来的 revenue loss / 库存损失。

| # | 痛点 | 现状 cope 方式 | 年成本 / 时间 / 风险 | 数据出处 |
|---|---|---|---|---|
| 1 | **「我们买了 Brandwatch / Sprinklr，但它在 Amazon/Walmart review 上几乎是瞎的」**——Insights 团队每月手工导 50K+ review CSV、用 Excel/GPT 自己跑 sentiment | Insights analyst 1–2 人 × 每月 60–80h 手工 review reading + 半自动 GPT 分析 | $120K–$180K/年 人力沉没成本（按 $80/h fully loaded × 1.5 FTE）+ Brandwatch $150K–$250K/年但 e-commerce 维度浪费 50% 价值 = **真实 wasted spend $200K–$300K/年** | [LLM derived，需 CIA Reddit + G2] |
| 2 | **「我看不到 review 里哪条 pain 真的在影响 conversion / return rate」**——只看到 4.2★ 平均分，不知道是什么 specific feature 在拉分；R&D / NPD 团队不信"review 数据" | 季度做一次手工 deep dive，挑 top 3 SKU 让实习生汇总 100 条 review；R&D 仍按工程师直觉迭代 | 一次错误 NPI（用了 wrong 设计 spec）= $300K–$2M tooling sunk + 6 个月上市延迟。**单次错误年化成本 $500K–$1M** | [需 CIA App Reviews 真实数据 — 参考 Anker MagGo / Insta360 X3 review 主题分布] |
| 3 | **「竞品 Q3 上了一个新 SKU，4 周后才发现它在 share of voice 上偷走了我们 8%」**——Profitero / Stackline 给的是 share of shelf / 价格 / 库存，**不主动告警 review-level 的叙事变化** | 每月例会拉 Profitero export + 每周自己看 Amazon best-seller list；review 维度靠 Slack 群转发 | Share of voice 损失 8% × $50M Amazon 渠道 = **潜在 $4M revenue 漏出 / 季度**；典型 brand 一年至少踩 1–2 次 | [需 CIA SERP + CIA App Reviews 验证；参考 Insta360 vs GoPro share war] |
| 4 | **「老板每次问"我们 Amazon brand health 这季度怎么样"，我没有一个 1-page deck 能直接 answer」**——Brandwatch 给的是 social health，Profitero 给的是 commercial health，没有 review-driven brand health | 每季度 Insights team 花 2 周拼 PPT，靠半人工 + GPT-4 summary | 1 FTE × 8 周/年 = 320h × $80/h = **$25.6K/年纯报告劳动**；更关键的是 Insights 在 leadership 桌上的 perceived value 持续被稀释 | [LLM derived] |
| 5 | **「我有 5 个 marketplace（Amazon US / EU / JP, Walmart, Target.com）的 review，没有统一 lens」**——每个 marketplace 一份 export，时差、语言、品类映射全靠手工对齐 | 实习生 + GPT 翻译，excel pivot 拼成一张图 | 跨市场 product 决策延迟 4–8 周；典型决策"日本市场要不要 launch v2"被延迟 1 季度 = **$1M–$5M 机会成本**（参考 Anker、Dreame 在日本市场的节奏） | [需 CIA App Reviews × multi-marketplace] |

---

## 三、Buying Triggers（3-5 个 EVENTS）

> Events, not states. 每个 trigger 都伴随一个可预测的 Google / ChatGPT 搜索行为。

| Trigger event | Predicted prevalence | What they Google/ask after |
|---|---|---|
| **Brandwatch / Sprinklr / Talkwalker contract renewal 60 天前**——CFO 让 Insights 解释 ROI，特别是 "e-commerce voice 上的 ROI" | 30%+ of mid-market & enterprise brand Insights leaders 每年遇到一次（renewal cycle） | "brandwatch alternative for amazon"、"sprinklr alternative ecommerce"、"voice of customer amazon platform"、"replace brandwatch ecommerce listening" |
| **新品 NPI 上市 30–60 天后 retention 不及预期**——E-commerce VP 需要 4 周内回答"是哪条 pain 没解决"，否则 Q4 sourcing 决策卡住 | 每个 mid-market brand 每年发生 2–4 次（按 4–8 个 NPI/年） | "amazon review pain point analysis"、"npi feedback amazon"、"why is my amazon product getting bad reviews"、"product feature feedback from reviews" |
| **季度 board meeting 前 2 周**——CMO/COO 要"Amazon brand health 1-pager"，Insights 团队没有现成模板 | 4 次/年/品牌，几乎 100% prevalence | "amazon brand health dashboard"、"voice of customer report template"、"how to report amazon brand health to ceo" |
| **竞品突然在 share of voice 上抢走 5%+**——E-commerce VP / Brand Manager 在 Profitero/Stackline 月报里发现，需要紧急回答"为什么" | 每个品牌每年 1–3 次"惊吓时刻" | "competitive review analysis amazon"、"why is competitor winning amazon"、"profitero review intelligence"、"share of voice amazon competitor" |
| **Amazon Q4 / Prime Day 后 14 天**——retro 阶段，需要把"为什么这个 SKU 没爆 / 为什么差评涨"讲清楚 | 100% prevalence，每年 2 次（Prime Day 7 月 + Holiday 12 月） | "prime day post-mortem amazon"、"q4 amazon review analysis"、"holiday season review insights"、"black friday amazon brand recap" |

---

## 四、Top 3 Objections + 最强 Counter

| Objection | Counter (1 sentence, evidence-backed) |
|---|---|
| **"Brandwatch / Sprinklr 也号称做 Amazon listening，为什么我要再加一个 vendor？"** | 我们不替换 Brandwatch——我们补全 Brandwatch 在 Amazon/Walmart review 上的 60% 盲区，证据：拿你最近 30 天 Brandwatch Amazon export 跟我们的同期数据做 side-by-side gap 分析，typical gap 是 review volume 60–80%、theme depth 5–10×（来自 Anker / ESR 现网部署的真实对比）。 |
| **"我们已经付 Profitero $80K/年看 marketplace intelligence，review 维度他们也能给"** | Profitero 给你 share of shelf / 价格 / 库存这三件事很强，但 review 维度只到 "星级 + 数量" 这个深度——他们的 product head 自己在 G2 上承认 review 是 roadmap item；我们做的是 pain-point quantification + product-feature attribution，是 R&D 能拿去改设计的颗粒度，不是 dashboard summary。 |
| **"$5K–$20K/mo 比 Helium 10 贵 50×，凭什么？"** | Helium 10 是给 SMB seller 选品的工具，buyer 是个人 seller，不是 brand 决策者；你买的不是 review 数据，你买的是把 1.5 FTE Insights analyst 每月 80h 的 review reading 工作压缩到 4h，加上 R&D 能信的颗粒度，加上和 Profitero/Brandwatch 现有 stack 的 native integration——typical ROI 在 6 个月内 break even。 |

---

## 五、Vocabulary Audit

> **read by run-agent.py** — 这套词典直接进入 11 GTM Agents 的 prompt。每条词都决定一次 Reddit / LinkedIn post 是 native 还是露馅。

### 5.1 词汇他们用（自描述 + 行业黑话）

**Tier 1 (always)**：
- voice of customer / VOC（**永远全大写 VOC，不要 voc**）
- brand health
- consumer insights
- share of voice / SOV
- share of shelf / SOS
- review velocity
- 4-star ratio / 1-star ratio（不说 sentiment score）
- NPI（new product introduction）/ NPD
- SKU（不说 product）
- listing（在 Amazon 语境必用）
- marketplace（指 Amazon/Walmart/Target.com 的总称）
- ASIN（必用，是 brand-side 内部沟通单位）
- pain point / pain
- theme（"this theme is trending in Q3"）
- claim（"the durability claim is being challenged"）

**Tier 2 (often)**：
- subcategory / category
- competitive set
- DTC vs marketplace（区分 own site vs Amazon）
- review mining
- topic modeling（technical Insights 用）
- brand sentiment（ok 用，但不滥用 sentiment 这个词）
- conversion rate / CVR
- return rate / 退货率（敏感词，有 P&L impact）
- Q4 / holiday season / Prime Day（节奏词，必用）
- aha moment（用户 onboarding 语境）
- post-mortem / retro（季度 review 语境）

### 5.2 词汇他们不用（销售感 / 学术 / 平台感 — 避雷）

- ❌ "AI-powered"（每个 SaaS 都说，听腻了，用 "AI" 单独出现 ok，"AI-powered platform" 立刻露馅）
- ❌ "revolutionary" / "game-changing" / "next-gen"（marketing 套词）
- ❌ "synergy" / "leverage"（咨询黑话，brand-side 反感）
- ❌ "unlock insights"（被滥用到失效）
- ❌ "actionable insights"（说太多了，反而不 actionable）
- ❌ "sentiment analysis"（学术词，Insights 老炮儿觉得是 2018 年的事）
- ❌ "natural language processing" / "NLP"（同上）
- ❌ "find your blue ocean"（SMB seller 的话术，立刻把你打成 Helium 10 阵营）
- ❌ "boost your sales" / "skyrocket revenue"（FBA YouTuber 话术）
- ❌ "hack" / "growth hack"（成长黑客词，brand-side 不用）
- ❌ "10× your reviews"（工具型话术）
- ❌ "platform" 单独出现且没有定语时（典型 SaaS pitch deck 词，要么 "intelligence platform" 要么不用）
- ❌ "seller"（这是 SMB FBA 圈词，brand-side 自称 brand / company / team）

### 5.3 触发情绪词（pain + relief language pairs）

| Pain phrase | Relief phrase |
|---|---|
| "drowning in reviews" / "60K reviews and no one's actually reading them" | "every review on the shelf, summarized by SKU, by week" |
| "Brandwatch is blind on Amazon" / "we're paying $200K and it can't tell me why Anker MagGo is dropping" | "the Amazon layer your social listening platform was supposed to have" |
| "the Q4 retro is a fire drill every year" | "your holiday post-mortem deck, generated Monday after Prime Day" |
| "I can't get R&D to trust review data" | "review-to-feature attribution that ships into the JIRA ticket" |
| "we found out 4 weeks late" / "Profitero told us in the monthly" | "competitive review alerts the same week the spike happens" |
| "the CMO is going to ask and I won't have an answer" | "the 1-pager that answers the brand health question before it's asked" |
| "I'm exporting CSVs at 11pm" | "stop exporting. start asking." |

---

## 六、Channel × Trigger 映射

> 每个 trigger 对应的 self-diagnosis → discovery → decision 路径。这张表直接决定 Step 4 里 11 个 GTM Agents 的资源分配。

| Trigger | First search platform | Discovery channels | Decision channels |
|---|---|---|---|
| Brandwatch renewal 60d before | **Google + ChatGPT**（"brandwatch alternative for amazon"）+ **G2 / Capterra**（横向比） | LinkedIn (peer Insights leaders 推荐) + Reddit r/marketing + Insights Slack communities (Insights Association) + analyst reports (Forrester Wave Social Listening) | **Demo with peer reference**（"Anker / ESR 怎么用"）+ **side-by-side gap analysis** + **3-month pilot with paid POC** |
| NPI retention drop | **ChatGPT + 自家 Slack 群**（"how to analyze amazon reviews fast for a launch"） | LinkedIn (E-commerce VP 圈) + Helium 10/Jungle Scout YouTube（虽然他们最后会买 enterprise 工具，但首次搜索常掉到 SMB content 池）+ Marketplace Pulse | **Speed-to-insight demo**（48h 内出 review pain map）+ R&D team buy-in |
| Quarterly board prep | **内部 Confluence / Notion** 找历史模板 → **Google**（"voice of customer report template ecommerce") + ChatGPT | LinkedIn thought-leader posts (consumer insights leaders) + Substack newsletters (Marketplace Pulse, Modern Retail) | **Template + dashboard demo**（直接给 1-page deck 模板）+ exec sponsor sign-off |
| Competitive SOV shock | **Profitero/Stackline 内部 dashboard 搜索 → Google**（"competitor review analysis amazon"）→ **ChatGPT** | LinkedIn + Reddit r/AmazonSeller (low signal, but 中层会去看) + Trade press (Modern Retail, Digital Commerce 360) | **Live competitive teardown demo**（拿 brand 自己的 top 3 竞品做 30 分钟 walkthrough） |
| Prime Day / Q4 post-mortem | **ChatGPT**（"prime day post mortem template"）+ **LinkedIn**（peer post 学习） | LinkedIn（强）+ Modern Retail / Marketplace Pulse + Insights Association webinars | **Auto-generated retro deck demo** + 限时 onboarding offer（Prime Day 后 14 天内签的 -20%） |

**Step 4 资源分配 implication**：
- **LinkedIn Agent**：5/5 优先级（出现在 5 个 trigger 的 5 个）— 这是 #1 channel
- **SEO/Blog Agent**（"brandwatch alternative" / "voice of customer amazon"）：5/5
- **Reddit Agent**：3/5（mid signal — 中层 IC 看，决策者不太看）
- **YouTube/Podcast Agent**：3/5（"Modern Retail Podcast" 露出 > 自建 channel）
- **Twitter/X Agent**：2/5（brand-side Insights 决策者 X 活跃度低）
- **TikTok Agent**：1/5（不是这条 ICP 的 channel）
- **Newsletter Agent**：4/5（Marketplace Pulse / Modern Retail 是高信任度 channel）
- **Webinar Agent**：4/5（Insights Association webinar = 直接 ICP 聚集地）
- **Email/Cold Outreach Agent**：5/5（enterprise 销售必用）
- **Case Study / Customer Voice Agent**：5/5（Anker / ESR / Insta360 是最强 social proof）
- **Analyst Relations Agent**（Forrester / Gartner / IDC）：4/5（enterprise 决策必看 analyst report）

---

## 七、Top 3 用户访谈问题（for Founder to actually run）

> 这周让 Hunter 给 5 个真实付费客户打 25min 电话，问这 3 个问题，得到的答案会直接证伪/证实上述 ICP。

1. **「Walk me through the last time you had to answer a leadership question about your Amazon brand health that you couldn't answer in 5 minutes. What was the question, what did you have to do, and how long did it take?」**
   → 验证 痛点 #4 + Trigger #3 + 真实 cope cost。如果 5 个里 4 个回答都是"季度 board prep"，则 Trigger #3 是真实的；如果 5 个里 3 个回答的是"NPI launch retention"，则需要把 ICP 从 Insights Manager pivot 到 E-commerce VP（次受众变主受众）。

2. **「If we shut off VOC AI tomorrow, what's the *first* thing you'd Google to replace it? And what's the *next* thing you'd accept as a temporary workaround?」**
   → 直接测 wallet competitor。如果回答是 "Brandwatch + 一个 Excel intern"，confirm 我们在 Brandwatch 替代池；如果回答是 "Helium 10 + ChatGPT"，则我们其实在 SMB 池里被 mis-categorized，整个 enterprise pivot 论点要重新审视。

3. **「Last quarter, what specific Amazon-review-driven decision did you take to your CMO / VP of Product / VP of Supply Chain — and did they act on it?」**
   → 验证 review intelligence 是否真的 *穿到 R&D / 供应链 / CMO 决策层*。如果 5 个里 4 个回答 "我们做了 dashboard 但没人 act"，则我们没有真正解决 痛点 #2，定价正当性被削弱；如果 4 个回答了具体的 SKU 决策 / spec 调整 / sourcing 决定，则 痛点 #2 + Counter #2 都被实证。

---

## 八、对 Step 1 假设的回看

| Step 1 假设 | Step 2 用户层面证据 | 是否需要调整 Step 1 |
|---|---|---|
| **L1 (Enterprise Brand Listening) 是最大池，应投 70% 资源** | ✅ 加强证实——主受众的 trigger #1 (Brandwatch renewal) 直接对应 L1 wallet | 不调整。L1 + L4 仍然是主战场。 |
| **L2 (Amazon SMB seller tools) 应只 10% 资源维护 inbound** | ✅ 加强证实——5.2 vocabulary audit 显示 SMB 词汇（"seller", "blue ocean", "hack"）会污染 brand-side 信任 | 进一步减少：L2 资源建议从 10% 砍到 5%，5% 给到 webinar / analyst relations 这类 enterprise channel |
| **L4 (Marketplace Intelligence) 与 L1 是孪生赛道** | ✅ 加强证实——次受众（E-commerce VP）和 主受众（Insights Manager）在很多大品牌里是同一个 BU 下的 sister teams，可以共享 case study + 复用 sales motion | 不调整。但 GTM 上要明确"Insights buyer 进 → 引荐 E-commerce buyer"这条 motion |
| **2B+ reviews 是 moat 的基础设施层，不是叙事层** | ✅ 加强证实——Vocabulary 5.2 显式排除"AI-powered" / "billions of"这类基础设施叙事；用户用的是 "Brandwatch is blind on Amazon" 这种 *gap-叙事* | 不调整，Step 3 (Competitor) 必须用 gap framing，不能用 capability framing |
| **Step 1 #五 假设："Founder stated ICP (FBA SMB) ≠ Actual PMF (Enterprise)"** | ⚠️ **部分修正**——Step 2 vocabulary + trigger 分析进一步证实 ICP 应是 Insights / E-commerce 决策者（不是 FBA SMB），但 Step 2 也暴露了一个新风险：**主受众 Insights Manager 的"决策权"未必直接 = 付款权**——付款人通常是 CMO / CFO，Insights Manager 是 champion 而非 decision-maker | 调整：Step 1 §五 第一项应补一句"Insights Manager 是 champion，CMO/CFO 是 economic buyer——内容策略需同时 serve 两层" |
| **DTC 应作 secondary ICP** | ❌ **进一步反对**——Step 2 vocabulary 显示 DTC 圈用词与 Amazon brand 圈完全分离，且 DTC review 量不足以发挥 2B+ moat 价值 | **强烈调整**：Step 1 应明确把 DTC 划入 §1.3 排除受众；只保留 "Amazon + own site 双轨品牌"（Beardbrand / Allbirds 那种）作为边缘机会 |

---

## 九、Data Gaps

> 以下 CIA pipeline runs 在 Step 3 (Competitor) 之前完成会显著提升下一步质量。

1. **App Reviews scrape**（CIA Step 7 Apify Apple App Store / Google Play API）：
   - **Brandwatch (Cision)** mobile app — last 200 reviews, target keywords: "amazon", "ecommerce", "review", "marketplace"
   - **Sprinklr** — last 200 reviews, same keyword filter
   - **Helium 10** — last 200 reviews（理解 SMB 圈在抱怨什么，作为反向锚点）
   - **Yotpo** — last 200 reviews（验证 痛点 #2 在 DTC 圈的 prevalence）
   - **目标产出**：每 vendor 一张 pain frequency heatmap，证实/证伪 痛点 #1 和 #2
2. **Reddit scrape**（CIA Step 7 Apify Reddit Scraper）：
   - r/marketing — query strings: "brandwatch", "sprinklr alternative", "amazon review analysis", "consumer insights"
   - r/CustomerSuccess — query strings: "voice of customer", "review analytics"
   - r/AmazonSeller + r/FulfillmentByAmazon — query strings: "review analysis tool"（反向锚点）
   - r/ProductManagement — query strings: "voice of customer", "review insights"
   - **目标产出**：community vocabulary 真实分布，校准 Vocabulary Audit §5.1 / §5.2
3. **G2 / Capterra reviews scrape**（CIA Step 7 SerpAPI / DataForSEO）：
   - Brandwatch G2 reviews: pull pros/cons, 提取"weak ecommerce" / "weak amazon" mention 频次
   - Sprinklr G2 reviews: 同上
   - Profitero G2 reviews: 提取"weak review" / "shallow sentiment" mention 频次
   - Talkwalker G2 reviews: 同上
   - **目标产出**：直接证据库 for Counter #1 + Counter #2
4. **TikTok hook patterns scrape**（CIA Step 7 Apify TikTok Scraper）：
   - Query "amazon review analysis", "voice of customer", "brandwatch alternative"
   - **现实判断**：这条 ICP 不在 TikTok 决策，预期数据稀薄 → confirm "TikTok Agent 优先级 = 1/5" 这个判断
5. **LinkedIn Sales Navigator export**（手动 / Apify）：
   - "Director, Consumer Insights" + company size > 1000 + industry: Consumer Goods / Electronics → ICP pool size
   - "VP / Director, E-commerce" + company revenue > $100M + tag "Amazon" → 次 ICP pool size
   - **目标产出**：精准 TAM × ICP 转化漏斗预估
6. **Founder 内部数据**（无需 CIA，30 分钟即可）：
   - 过去 12 个月 ARR by deal size segment（< $5K, $5K-$20K, $20K-$100K, $100K+）
   - 过去 12 个月 NRR by segment
   - 当前 active customer base 中"Insights Manager / VOC Manager / E-commerce Director" title 占比
   - **这一项最关键**——直接定 enterprise pivot 是 0→1 还是 1→10。

---

## 十、Key Assumptions

> 5 个可证伪条件。如果 Step 3 / Step 4 数据击穿任何一条，必须回头改 Step 2。

1. **主受众 (Consumer Insights Manager) 在 enterprise brand 里的 *决策影响力* ≥ 50%**——如果 5 次销售对话证明 Insights Manager 只是 information gatherer 而非 budget influencer，且 economic buyer 是 CMO 但 CMO 完全不接触我们内容，则主受众必须改成 CMO 或 VP E-commerce。
2. **Brandwatch / Sprinklr 的 Amazon review 覆盖深度 *gap* ≥ 60%**——如果 side-by-side gap analysis 显示 gap 只有 < 30%，差异化叙事 #1 (Counter #1) 不足以支撑 enterprise pricing。
3. **R&D / 供应链团队愿意把 review pain 数据进 NPI workflow**——如果 5 个客户访谈中 ≥ 3 个回答 "我们做 review dashboard 但 R&D 不看"，则痛点 #2 不能成为 #1 价值主张，必须 fallback 到痛点 #4（季度 board prep）这种纯 reporting 价值。
4. **典型 mid-market & enterprise consumer brand 在 Amazon review intelligence 上的预算意愿 ≥ $30K/年（独立 line item，非 Brandwatch budget 的次级分配）**——如果 5 个对话里 ≥ 3 个回答 "我们没有独立 review intelligence 预算，只能从 Brandwatch / Profitero 现有合同抠"，则销售周期会从 6 个月被拉长到 12-18 个月，整个 ICP economics 重做。
5. **Vocabulary Tier 1 词汇（VOC, NPI, share of voice, review velocity, claim, theme）确实是 native 用词**——如果对 5 个客户语音录音做 transcript 分析，这 6 个词的 mention frequency 总和 ≤ 10 次/小时，则 Vocabulary Audit §5.1 需要回头修正，11 GTM Agents 的 voice prompt 需要重训。

—

**Step 2 done. Awaiting Founder review + edits before triggering Step 3 (Competitor Analysis).**