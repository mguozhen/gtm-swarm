# Market Insight — Solvea

> CIA Methodology v2 · LLM-only synthesis · Real-data gaps marked `[需 CIA Step 2-8 真实数据]`
> 写于 Founder 已自带方向假设 ("AI Receptionist Vibe Builder, 10-min deploy") 的前提下。
> 本份 brief 的核心立场：**找机会，不证明想法。** Solvea 当前定位语言指向 US SMB（medspa/HVAC/律所），但实际签下的客户（Anker / Panasonic / ESR / Dreame / Insta360 / Rakuten）讲的是另一个完全不同的故事。这份 brief 会把这两个故事都摊开，并指出 Founder 极可能在错的赛道上讲对的产品。

---

## 一、核心洞察 (TL;DR)

| 你给的方向 | 实际市场容量 | 与最大赛道差距 | 反向洞察 |
|---|---|---|---|
| "AI Receptionist Vibe Builder for SMB (medspa/HVAC/law/restaurant)，10-min deploy" — 卷在最红海的 US SMB voice agent 赛道（Goodcall, Rosie, Synthflow, Bland, Air.ai 已挤满） | SMB voice receptionist (US) 5y 现实可触达 ~$1-3B ARR；但 Solvea 的真实付费客户（Anker, Panasonic, ESR, Dreame, Insta360, Rakuten）全部不属于这个赛道，而是 **Cross-border E-commerce CS agent for Chinese-origin global brands**——一个 5y 现实可触达 $300M-$1B 的细分市场 | 你定位讲的是 SMB（30M 家），实际打下来的客户在 enterprise/出海大牌（全球 ~10K 家）。两个赛道差 1000 倍家数，但单客 ACV 差 100-300 倍，TAM 量级其实接近——**问题是你的 marketing 文案在描述 A 市场，sales 在收 B 市场的钱** | 你最强的不是 "10-min deploy"（无人 care），而是 "中国出海品牌的多语种 AI 客服 + 复杂 SKU 知识 + 跨时区接管"。这是 Decagon / Sierra / Ada 都没真正下场的细分。Founder 把 wedge 描述错了一个量级 |

---

## 二、战略赛道矩阵（5-8 条，TAM 从大到小）

| # | 赛道 | 用户心智 (1 句) | 头部已知玩家 | TAM 估算 (USD ARR ceiling, 5y 现实可触达) | 与你方向关系 | 综合评分 (1-5) |
|---|---|---|---|---|---|---|
| L1 | **AI Customer Service Agent for E-commerce (Global)** | "我有 10K+ tickets/day，需要 AI 解决 60%+ 不升级到人工" | Intercom Fin, Decagon, Sierra, Ada, Forethought, Kustomer AI | $5-10B (Intercom Fin ARR 已破 $100M+) | 重叠：你已签的 Anker/Panasonic 在这里 | ⭐⭐⭐ (赛道大但卷) |
| L2 | **AI Voice Receptionist for US SMB (Vertical)** | "我接不过来电话，请个 AI 帮我接，每月几百块" | Goodcall, Rosie, Synthflow, Bland, Air.ai, Hello Sunday | $1-3B | **你的定位文案在打这里，但你没有真实付费客户** | ⭐⭐ (红海) |
| L3 | **Cross-border E-commerce CS for Chinese-origin Global Brands** ⭐ | "我是中国品牌出海，需要 24/7 多语种客服，懂复杂 SKU、退换货、海运" | Shulex, 美洽, 网易七鱼, Salesmartly | $300M-$1B | **你的真实客户全部在这里——Anker/ESR/Dreame/Insta360 都是典型出海品牌** | ⭐⭐⭐⭐⭐ |
| L4 | **AI Voice/Chat for Japan Enterprise** | "我是日本大企业，需要本土合规、敬语" | PKSHA, BEDORE, AI Messenger, commubo, KARAKURI | $200-500M | 邻近：Rakuten 在这里 | ⭐⭐⭐ |
| L5 | **AI Customer Service for SMB (Self-serve, English)** | "月营收 $50K-$500K，订阅 $99/mo AI 回 80% emails" | Tidio, Crisp, Drift, Chatbase, MyAskAI, Zowie | $500M-$1.5B | 邻近：vibe builder 形态可下沉 | ⭐⭐ |
| L6 | **Voice AI Infrastructure (Pickaxes)** | "给我 SIP+LLM+TTS 的 API，我自己拼" | Vapi, Retell, Bland, LiveKit Agents, Telnyx AI | $200-800M | **不是你的层** | ⭐ |
| L7 | **Vibe-coded AI Agent Builder (Horizontal)** | "自然语言搭跨 use case agent" | Lindy, Relevance AI, n8n + AI, Stack AI, Botpress | $300M-$1B | **借错心智——你不是 Lindy** | ⭐⭐ |
| L8 | **AI Co-pilot for Human CS Agents** | "保留人工，AI 做 suggest reply / summary / QA" | Cresta, Observe.AI, Forethought, ASAPP | $500M-$1.5B | 反向：你做替换，不是增强 | ⭐⭐ |

**关键 reads：**
- L1 / L3 是你**实际**在做的事情，L2 是你**说**自己在做的事情。这个 misalignment 比"市场不够大"更危险。
- L3 是这份 brief 找到的最大机会——你已有 PMF 痕迹但没在描述它，巨头看不上"中国出海"sub-segment。
- L7 是 marketing 心智借错的对象。"Vibe Builder" 让人想到 Lindy，但 Lindy 是横向 agent，你是垂直 voice/CS。

---

## 三、每条赛道详细卡片

### L1: AI CS Agent for E-commerce (Global) — TAM $5-10B

| 维度 | 数据 |
|---|---|
| 用户心智 | "10K+ tickets/day，AI 解决 60%+ 不升级人工。Resolution Rate 是核心 KPI" |
| 体量证据 | [需 CIA Step 2-8 真实数据]: Intercom Fin ARR $100M+；Decagon Series C $1.5B 估值；Sierra (Bret Taylor) $4.5B；Ada 累计 $250M+ |
| 头部已知竞品 | Intercom Fin, Decagon, Sierra, Ada, Forethought, Kustomer AI, Zendesk AI, Salesforce Agentforce |
| 切入角度 | 不正面对决巨头。差异化点：(a) 多语种深度（中→英/日/德/西/法）, (b) 中国出海特殊场景（海运 tracking, 跨境退换, 多平台 SKU 同步）, (c) per-resolved-ticket 定价 vs seat-based |
| 关键获客词种子 (20-dim) | **demand-core**: ai customer service, customer support automation, autonomous ai agent for support / **demand-audience**: shopify ai customer service, ecommerce ai support agent, dtc brand ai cs / **supply-competitor**: intercom fin alternative, decagon alternative, sierra ai alternative, ada alternative / **pain-quant**: reduce customer service costs, ai resolution rate, deflect support tickets, support ticket automation |
| 切入难度 | ⭐⭐⭐⭐⭐ |
| 关键风险 | 拼不过 Intercom 的 install base + native integration，正面打 = 在折扣单上当 footnote |

### L2: AI Voice Receptionist for US SMB — TAM $1-3B

| 维度 | 数据 |
|---|---|
| 用户心智 | "我接不过电话，每漏一个少 $200，请个 AI 几百块" |
| 体量证据 | [需 CIA Step 2-8]: Goodcall ~$5M ARR (2025), Rosie 据传 $3-8M, Synthflow YC W24 单客 $99-499/mo |
| 头部已知竞品 | Goodcall, Rosie, Synthflow, Bland, Air.ai, Hello Sunday, ServiceTitan AI Phone, Numa, Dialpad AI Receptionist |
| 切入角度 | 不建议主打——你没 US 本地 sales/marketing motion，单客 $200/mo × 巨大 churn 不适合你目前资本结构 |
| 关键获客词种子 (20-dim) | **demand-core**: ai phone receptionist, virtual receptionist ai, ai answering service / **demand-audience**: medspa phone answering, hvac call answering, law firm intake / **supply-competitor**: goodcall alternative, rosie ai alternative, synthflow alternative / **pain-quant**: missed calls cost, after hours phone coverage, voicemail conversion |
| 切入难度 | ⭐⭐⭐⭐⭐ |
| 关键风险 | marketing copy 在打这里但你不在这里赢——SMB 试用后跑去用更便宜的 Synthflow |

### L3: Cross-border E-commerce CS for Chinese-origin Global Brands ⭐ — TAM $300M-$1B

| 维度 | 数据 |
|---|---|
| 用户心智 | "我是 Anker/Insta360/ESR 这种出海全球品牌，需要 24/7 跨语种 (英/日/德/西/法) 客服，懂复杂 SKU、海运 tracking、Amazon/Shopify 多平台、跨时区接管，与中国总部知识库联动" |
| 体量证据 | [需 CIA Step 2-8]: Anker 2024 营收 $3B+, Insta360 ~$500M+, ESR ~$300M+, Dreame ~$1B+。中国出海品牌总数 ~10K 家具备规模化客服需求，年 CS 预算 $30K-$500K。**TAM 数学**：10,000 × $50K ACV × 30% 渗透 = $150-500M 现实可触达。Shulex 2024 ARR 估 $5-15M，验证 viability |
| 头部已知竞品 | Shulex, 美洽, 网易七鱼, Sobot, Salesmartly, Zoho SalesIQ + AI；西方巨头几乎没有针对中国出海的本地化 sales motion |
| 切入角度 | **这才是 Solvea 真正的 wedge。**核心 narrative："为出海中国品牌打造的 AI 客服——多语种、多平台、跨时区、与中国总部知识库联动"。不是 "10-min vibe builder" |
| 关键获客词种子 (20-dim) | **demand-core**: 出海客服 ai, cross-border ecommerce customer service ai, multilingual customer support ai for chinese brands / **demand-audience**: amazon seller customer service ai, shopify multilingual support, dtc brand 出海 cs / **supply-competitor**: shulex 替代品, 网易七鱼 国际版, 美洽 替代品, sobot alternative, zendesk for chinese brands / **pain-quant**: 出海客服成本, 多语种客服自动化, amazon 客服回复速度, 24/7 international customer support |
| 切入难度 | ⭐⭐ |
| 关键风险 | (a) Shulex 已先行 18-24 个月；(b) 此 ICP 中文采购决策快但**英文 inbound 进不来**——必须中文 GTM 团队；(c) 出海品牌总部对"AI 客服"有 trauma |

### L4: Japan Enterprise Voice/Chat — TAM $200-500M

| 维度 | 数据 |
|---|---|
| 用户心智 | "日本大企业，需要本土合规、敬语、PII 留境内、Salesforce/SAP 集成" |
| 体量证据 | [需 CIA Step 2-8]: PKSHA 2024 ¥17B (~$110M), BEDORE/PKSHA Comm ~$20-30M ARR, AI Messenger ~$13M |
| 头部已知竞品 | PKSHA, BEDORE, AI Messenger Voicebot, commubo, KARAKURI, MOBI BOT |
| 切入角度 | Rakuten 是 trojan horse。要正打必须有日语 native sales + 日本子公司 + 日本数据中心 |
| 关键获客词种子 (20-dim) | **demand-core**: ai チャットボット 企業, ai 顧客対応 自動化, ボイスボット / **demand-audience**: コンタクトセンター ai, カスタマーサポート ai 大企業 / **supply-competitor**: pksha 代替, bedore 比較, ai messenger 比較 / **pain-quant**: 顧客対応 コスト削減, ai 解決率, 24時間 サポート 自動化 |
| 切入难度 | ⭐⭐⭐⭐ |
| 关键风险 | 没本土团队不可能进，Rakuten 是个例外 |

### L5: SMB Self-serve English CS — TAM $500M-$1.5B

| 维度 | 数据 |
|---|---|
| 用户心智 | "月营收 $50K-$500K，付 $99-$499 让 AI 回 80% emails/chats" |
| 体量证据 | [需 CIA Step 2-8]: Tidio ~$50M ARR, Crisp ~$15M, Chatbase 增长快 |
| 头部已知竞品 | Tidio, Crisp, Drift, Intercom Starter, Chatbase, MyAskAI, Zowie |
| 切入角度 | "vibe builder" 形态可下沉，但需要 PLG motion (free trial → self-serve checkout)，目前 Solvea 没有 |
| 关键获客词种子 (20-dim) | **demand-core**: ai chatbot for website, ai customer support saas, conversational ai for small business / **demand-audience**: shopify chatbot ai, saas customer support ai, dtc brand chatbot / **supply-competitor**: tidio alternative, intercom alternative cheaper, chatbase alternative / **pain-quant**: reduce email response time, automated customer support saas, ai chatbot pricing |
| 切入难度 | ⭐⭐⭐⭐ |
| 关键风险 | SMB 单客经济模型对资本支持要求高 |

### L6: Voice AI Infrastructure — TAM $200-800M

| 维度 | 数据 |
|---|---|
| 用户心智 | "开发者要 SIP+LLM+TTS API, 按 minute 计费" |
| 体量证据 | [需 CIA Step 2-8]: Vapi ARR $5-15M, Bland 累计融资 $40M+ |
| 头部已知竞品 | Vapi, Retell AI, Bland AI, LiveKit Agents, Telnyx AI |
| 切入角度 | **不是 Solvea 的层**。底层用 Retell/Vapi/LiveKit 即可 |
| 关键获客词种子 (20-dim) | (略——非你赛道) |
| 切入难度 | ⭐⭐⭐⭐⭐ |
| 关键风险 | 跨层就死 |

### L7: Vibe-coded Horizontal Builders — TAM $300M-$1B

| 维度 | 数据 |
|---|---|
| 用户心智 | "自然语言搭跨 use case (邮件、电话、CRM、Slack) 的 agent" |
| 体量证据 | [需 CIA Step 2-8]: Lindy ARR $5-10M, Relevance AI Series B $24M |
| 头部已知竞品 | Lindy, Relevance AI, n8n + AI, Stack AI, Botpress, Voiceflow |
| 切入角度 | **你的"Vibe Builder" copy 让用户以为你是 Lindy——但你不是。**你是垂直 voice/CS 应用，借错心智 |
| 关键获客词种子 (20-dim) | (略——非真实定位赛道) |
| 切入难度 | ⭐⭐⭐⭐ |
| 关键风险 | 借错心智 = 用户进来发现产品不是他们想的那种 |

### L8: AI Co-pilot for Human Agents — TAM $500M-$1.5B

| 维度 | 数据 |
|---|---|
| 用户心智 | "保留人工，AI suggest reply / summarize / QA" |
| 体量证据 | [需 CIA Step 2-8]: Cresta $50M+, Observe.AI $30-50M, Forethought $20M+ |
| 头部已知竞品 | Cresta, Observe.AI, Forethought, ASAPP, Tymeshift |
| 切入角度 | 反向：Solvea 走"替换"，是 future expansion，不是当前 wedge |
| 关键获客词种子 (20-dim) | (略——expansion) |
| 切入难度 | ⭐⭐⭐⭐ |
| 关键风险 | 不同 ICP，强行做分散资源 |

---

## 四、市场时机判断（红绿灯）

- **Tech enabler**: 🟢 — GPT-4 / Claude / Gemini 多语种 2024-2026 跨过质量门槛；TTS (ElevenLabs / Cartesia) 接近真人；voice infra 商品化。**应用层窗口正在打开**
- **Buyer awareness**: 🟡 — E-com CS leader 已被 Intercom Fin / Decagon 教育；SMB (L2/L5) 仍在 trauma 期。**中国出海品牌 (L3) 是绿灯**——ROI 算得清
- **Competitive density**: 🔴 (L1/L2/L5) / 🟢 (L3) / 🟡 (L4) — Solvea 真正赛道 L3 仍稀薄
- **Capital/regulatory headwinds**: 🟡 — 全球数据驻留收紧 → 中国出海更需要既能在中国又能合规出海的玩家。**对 L3 顺风**

**Net 判断**：当前 12 个月是 L3 的窗口期。再过 18 个月，Shulex 进一步加固 + Decagon/Sierra 可能下场。**Solvea 的窗口在收紧**。

---

## 五、对用户原始假设的批判性评估

| 你假设 | 反向证据 (or 需 CIA 数据) | 调整建议 |
|---|---|---|
| **"AI Receptionist Vibe Builder. SMB owners (medspa/HVAC/law/restaurant)"** 是核心定位 | 你的 6 个公开客户全都不是 medspa/HVAC——而是中国出海大品牌 + 日本巨头。Marketing 描述的 ICP 和 sales 真实成单的 ICP 是两个完全不同的人群 | **重写 hero copy**：把 "Vibe Builder" 降级为辅助 feature，把 "Multilingual AI Customer Service for Cross-border Brands" 升级为主 narrative |
| **"10-min deploy" 是 differentiator** | [需 CIA 数据]: Synthflow / Vapi / Goodcall 都声称 5-10 分钟上线，"快"已经不是优势。**真正的 differentiator 是"上线后真的能 deflect 60%+ 而不掉 CSAT"** | 把核心 metric 从 "time to deploy" 换成 "resolution rate" + "CSAT delta" |
| **"per resolved ticket" 是反向打 $500/mo 人工** | [需 CIA 数据]: Decagon / Ada 也是 outcome-based。**你不是发明了这个模式，你是入场了已成型范式** | 保留定价，但 reframe：从 "vs $500/mo human" (SMB) → "vs $0.50-$2 per ticket human cost" (enterprise CS) |
| **"vs PKSHA / BEDORE / AI Messenger / commubo" 是对标** | 这三家都是日本本土玩家。把他们当对标 = mental model 把 Solvea 放在了"日本市场挑战者"位置——但你真实客户多在中国出海，对标错位 | 真正对标应该是 **Shulex (中国出海) + Intercom Fin (e-com) + Decagon (autonomous)** |
| **"100+ brands" 是 social proof** | 100+ 含糊。其中**真正在用 + 付费**的是哪几个？是 Anker 那种 logo 撑场？还是 medspa 散点？ | Step 4 必须区分 "logo wall" 和 "case study"。先选 1-2 个 enterprise（如 Insta360 或 Dreame）做深度 case study |

---

## 六、窗口与等待成本

### 6 个月（Now → 2026-11）
- **Act now**: 重写 positioning → 押 L3，配中文 + 多语种 GTM；用 Anker/Insta360/Dreame 做 anchor case study；定价收 enterprise tier ($30-100K ACV)；Q3-Q4 拿到 10-20 个新出海品牌付费客户
- **Wait 6mo**: Shulex 抢占心智 (ARR $5-15M → $15-30M)；Decagon 可能进军中国出海；6 logos 优势稀释；丢掉 "中国出海 AI 客服" mind-share leader 位

### 18 个月（Now → 2027-11）
- **Act now**: 锁定 L3 标杆 (~50-100 出海品牌客户, $5-15M ARR)，开始 expansion 到 L1 enterprise 段
- **Wait 18mo**: L3 窗口关闭——巨头进场 + Shulex 已成事实标准；Solvea 被迫在 L1 红海里和 Decagon 对碰，差距已成不可逾越

### 36 个月（Now → 2029-05）
- **Act now**: 成为 "Chinese Brand Going Global" CS 默认基础设施，可能 IPO / 战略收购 (Anker / Shopee 等)
- **Wait 36mo**: 大概率被边缘化

**Net**：等待成本极高。**6 个月内必须重新 anchor 定位**。

---

## 七、Key Assumptions

5 条 invalidation conditions——任何一条被证伪，brief 需推翻重做：

1. **Anker / Panasonic / ESR / Dreame / Insta360 / Rakuten 是真实付费客户（不是 logo wall / pilot only）**。如果 ≥ 4 家只是 free pilot，L3 假设崩塌
2. **中国出海品牌总数在 5-15K 区间（具备 $30K+ CS 预算者）**。如实测只有 1-2K 家，L3 TAM 缩水 70%
3. **Founder 团队具备中文 GTM 能力**。如果团队纯英文，L3 不可执行——必须先建团队
4. **Solvea 当前产品具备多语种深度 (中→英/日/德/西/法)**，且支持 Amazon/Shopify/独立站多平台 SKU 同步
5. **per-resolved-ticket 定价对 enterprise CS leader 有吸引力**。如调研表明 enterprise 仍偏好 seat-based / fixed contract，需要重设计 pricing

如果 **1 + 4 同时被证伪**，Solvea 实际上没有 wedge——需要 pivot。

---

## 八、Data Gaps (Founder Decision)

跑 CIA Python pipeline 会显著 refine 这份 brief：

1. **Ahrefs keyword volumes** for L3 candidate seeds: "出海客服 ai", "cross-border ecommerce customer service ai", "shulex alternative", "multilingual ai customer service", "chinese brand 客服 ai"
2. **App Store / Play Store SERP** for: "customer service ai", "ai receptionist", "ai phone agent", "出海 客服" — 看 Solvea / Shulex / 美洽 / Sobot 的 ASO 排位
3. **DataForSEO ASO + Reviews** for top-3: **Shulex** (L3 直接对手), **Intercom Fin** (L1 上限), **Goodcall / Synthflow** (L2 红海代表)
4. **Apify Reddit/X scraping**: r/ecommerce, r/AmazonSeller, r/shopify on "ai customer service"; X 上 "出海" + "客服 ai" 中文；中国出海卖家社群 (跨境者联盟, 跨境眼) 真实抱怨/需求语料
5. **LinkedIn / 脉脉 sales intel**: 中国出海 Top 100 品牌客服负责人 + 现用方案

如果 Founder 想跑真实数据，安装 CIA per `templates/contentos-agent/REFERENCE-cia-methodology.md`。

---

## ✦ 给 Hunter 的最后一段话

你现在的 messaging 在 L2 (US SMB voice receptionist) 那一片红海里讲故事，但你真实赚到钱的客户全部在 L3 (中国出海品牌 CS)。这种"说一套，做一套"会让两边的 buyer 都不买账：
- US medspa owner 来你网站，看见 Anker/Panasonic logo wall，会想"这不像给我用的"
- Insta360 客服总监来你网站，看见 "10-min vibe builder" 文案，会想"这是给小店用的"

**Step 2 (User Insight) 的核心任务应该是：调研 L3 真实 buyer (中国出海品牌客服总监)**，不是调研 medspa owner。如果你 Step 2 还按 medspa/HVAC 调研，Step 3、Step 4 全部会建在错的地基上。

如果想保留 SMB vibe builder 故事，可以做成 free / freemium 的 lead magnet，但**主战场必须是 L3**。这是 6 个月窗口期的判断。

—— ContentOS Agent · CIA Methodology v2 · 2026-05-11

---

Brief written to `projects/solvea/strategy/01-market-insight.md`. State advanced to Step 1 complete. Step 2 (User Insight) will need explicit Founder decision on which ICP to research — the brief argues for L3 (中国出海品牌客服总监), not the SMB medspa/HVAC profile in `project.yaml`.