# User Insight — Solvea

> CIA Methodology v2 · LLM-only synthesis · Real-data gaps marked `[需 CIA Step 7/9 真实数据]`
> Step 1 (Market Insight) 强烈建议把主战场从 L2 (US SMB voice receptionist) 切到 L3 (中国出海品牌 CS)。本份 Step 2 **按 L3 ICP 来调研**，并把 L2 SMB 作为次受众保留，把 L5 SMB self-serve 标记为排除。如果 Founder 在 Step 1 决定不 pivot，这份 brief 需要重做。

---

## 一、ICP（Ideal Customer Profile, 三层）

### 1.1 主受众（primary, 70% 内容资源）

**Cold-email-actionable 描述：**
> **中国出海品牌（已在 Amazon US/EU/JP 或自建 Shopify 站做到 $30M-$500M 年营收）的客服总监 / VP Customer Experience / 全球客服负责人。**总部多在深圳 / 杭州 / 上海，客服团队混合编制：国内 BPO 30-150 人（中文 + 英文初级） + 海外远程小团队 5-20 人（多语种 native，分布美西、欧洲、东南亚）。已用 Zendesk / Salesforce Service Cloud / Freshdesk，工单量 5K-50K/月，正在被高人力成本、海外时差、多语种质量、Amazon 政策风暴和大促爆量四面夹击。

**Firmographic（5 维硬过滤条件）：**
- **Role**: 客服总监 / Head of Global CS / VP Customer Experience / COO（小一点公司是 COO 直管）
- **Company size**: 200-2000 人；客服团队 30-200 人
- **Revenue range**: $30M-$500M 年营收（再小没预算上系统，再大 in-house build）
- **Tech stack**: Zendesk / Salesforce SC / Freshdesk + ERP（领星 / 店小秘 / 通途）+ Amazon Seller Central + Shopify + 1-2 个 BI 工具
- **Geo**: 总部中国（深圳 / 杭州 / 上海 / 广州 / 厦门 / 苏州）；销售市场 US + EU + JP + AU
- **典型品类**: 3C 配件、智能家居、储能、清洁电器、户外、宠物、美妆个护、Apparel

**Psychographic：**
- **Belief**: "我们的产品在海外比国内品牌强，但客服永远是短板。海外消费者投诉一次就是 1-star，1-star 一多 listing 就死。AI 客服早晚要做，问题是怎么不翻车。"
- **Fear**: (1) AI 回错话被截图发到 Reddit / Twitter → 品牌公关事故 → 老板叫去解释；(2) Amazon listing 因为 response time 不达标被 suppress；(3) 大促爆量时人工顶不住，CSAT 跌破 4.5 → 内部 OKR 红灯；(4) 选错 AI 供应商被锁死，迁移成本高于现状成本
- **Aspiration**: 在公司内部从"backstage 成本中心"变成"能讲数据故事的战略部门"；能在年终述职时拿出"AI deflect 60%，节省 $1.2M，CSAT +0.3"这种 number

**Trigger event（核心一句）：**
> "上个月 Amazon Prime Day / Q4 holiday / 双 11 期间，工单量翻 3x，BPO 加班到顶不住，1-star 评论涨了 40%，CEO 在 OKR 复盘会上点名问'我们的 AI 客服计划进展如何'。"

### 1.2 次受众（secondary, 25% 内容资源）

**Cold-email-actionable 描述：**
> **日本企业 / 大型 BPO 服务商**（如 Rakuten / Recruit / TransCosmos / Bell System 24）的 AI 转型负责人 / 客户成功部部长（カスタマーサクセス部 部長）。被本土 PKSHA / BEDORE / AI Messenger 报价吓到（5000 万日元 + 起步），同时被全球客户（在日中国卖家、亚洲电商）逼着上多语种方案，正在评估"日本本土 + 中国出海双品牌都能用"的替代选项。

**Firmographic：**
- **Role**: AI 推進室 室長 / カスタマーサクセス部 部長 / DX 推進担当役員
- **Company size**: 500-50,000 人
- **Revenue**: ¥10B+
- **Tech stack**: Salesforce JP + Mobicom + PKSHA / BEDORE PoC 中
- **Geo**: 东京 / 大阪本社，需要中国 + 东南亚多 region 覆盖

**Psychographic：**
- **Belief**: "本土玩家贵且封闭，海外玩家没日语 native 团队，需要找'懂日语合规 + 懂中国成本结构'的第三方"
- **Fear**: 数据合规（PII 出境）、敬语崩塌、社内 IT 不批
- **Aspiration**: 拿一个亚洲多 region 标杆案例升职

**Trigger event：**
> "PKSHA 报了 5,000 万円年费 PoC，社内 budget 砍到 1,500 万，IT 部门让团队 30 天内找 3 个替代方案做 RFP。"

### 1.3 排除受众（explicitly NOT for, 5%）

明确**不服务**：
- **US SMB（medspa / HVAC / law firm / restaurant）单店或 1-3 门店**：单客 ACV 太低（$50-200/mo），churn 高，需要 PLG + self-serve 漏斗，Solvea 当前 GTM 不匹配。Synthflow / Goodcall / Rosie 已占满该层
- **纯英文 DTC < $5M ARR**：付费意愿弱，更适合 Tidio / Chatbase 这类 self-serve SaaS
- **Enterprise SaaS 公司客服（如 Snowflake、Datadog 这种 B2B SaaS）**：他们的 ticket 类型偏 technical incident，Resolution 需深度产品集成，不是 Solvea 的 wedge
- **金融 / 医疗 highly-regulated 行业**：合规栏太高，sales cycle 18 个月起，资源消耗不对等
- **纯国内（内销）品牌**：阿里 / 美洽 / 网易七鱼 + 客服宝已经卡死该市场

**为什么要明确排除？**
内容生产的最大杀手是"什么人都想转化"。明确排除让 11 个 GTM Agent 的 voice 一致——避免在小红书发"医美 AI 接电话"同时在 LinkedIn 发"cross-border CS"。两个故事互相稀释。

---

## 二、Top 5 痛点（ranked by economic cost）

| # | 痛点 | 现状 cope 方式 | 年成本 / 时间 / 风险 | 数据出处 |
|---|---|---|---|---|
| 1 | **大促 / 政策风暴期人力顶不住** — 4-6 个高峰期（Prime Day、黑五、双 11、Q4 Holiday、新品发布）工单翻 3-5x，海外 BPO 招不到人，国内调人语言不够 | (a) 临时加 BPO 班次 1.5-2x 工资 / (b) 砍 SLA 接受 CSAT 下滑 / (c) 押宝产品质量"少出问题" | 单次大促临时人力溢价 $80K-$300K × 4-6 次/年 = **$320K-$1.8M/年**；CSAT 跌破 4.5 触发 Amazon listing suppress 风险 = 直接 GMV 损失 5-15% | [LLM derived] + [需 CIA Reddit r/AmazonSeller 真实数据] |
| 2 | **多语种 native 客服招聘 + 留存难** — 西班牙语、德语、日语、法语 native 在中国境内招聘成本是英语 5-10 倍，离职率 35%+/年 | (a) 国内招 B2 级二线 native 凑数 → 质量低 / (b) 海外远程招 → 时差 + 管理半径炸 / (c) Google Translate 兜底 → 笑话频出被截图 | 单个多语种坐席年成本 $35K-$60K（含管理 overhead），10 人团队 = **$350K-$600K/年**，且 turnover 一次成本 $8K-$15K | [LLM derived] + [需 CIA App Reviews Shulex/Salesmartly 中文吐槽] |
| 3 | **Amazon Buyer-Seller Messaging 24h 回复 SLA 不达标 → listing 被降权** — Amazon 政策要求 24h 内回复，海外时差 + 周末 + 节假日是结构性洞 | (a) 招东南亚远程客服守夜 / (b) 模板自动回复触发 Amazon 反垃圾 / (c) 干脆放弃部分 marketplace | 单 listing 被压制收入跌 30-60%，TOP listing 一旦掉权恢复需 2-3 个月 → 单产品年损失可达 **$500K-$2M**；BSR rank 下滑连锁 | [LLM derived] + [需 CIA Reddit r/AmazonSeller + Helium10 论坛] |
| 4 | **客服知识库与中国总部研发 / 售后 / 物流脱节** — 海外客服回复时不知道国内最新 SOP、新品 FW 升级、退货政策更新；信息靠企业微信 / 钉钉群转发，时差导致海外客服永远滞后 2-3 天 | (a) 海外客服 Notion 自建非官方知识库 / (b) 升级率高（30-40% 都得转人工）/ (c) 错误信息回给客户后续 Refund | 升级率每高 10%，人工 cost 增 $80K-$200K/年；错误信息触发的 chargeback / refund = **$150K-$400K/年** | [LLM derived] + [需 CIA App Reviews 出海客服 SaaS] |
| 5 | **CS 数据无法 close-loop 到产品 / 营销 / 供应链** — 客户抱怨"包装坏"、"FW Bug"、"配件不全"散落在 ticket 文本里，没人聚合，3 个月后产品又出同样问题 | (a) 客服总监手动按月 review 200 ticket 抽样 / (b) 跨部门会议靠记忆 / (c) 完全忽略 | 隐性 cost：研发返工 + 物流换包装 + 复购率下滑。10-25% 复购率劣化 = **$1-5M/年 GMV 损失**（按 $50M revenue 基准） | [LLM derived] + [需 CIA Founder 访谈] |

**痛点排序逻辑：**
按年化经济成本排序（最高优先级 = 影响 GMV 的，第二级 = 直接人力成本，第三级 = 隐性 / 战略层）。Solvea 的核心 wedge 应该 anchor 在 #1 + #2 + #3——这三个是**可量化、可对比 BPO 现状、可在 6 个月内出 ROI 数据**的痛点。#4 和 #5 是 expansion narrative，留给 case study 和 thought leadership 内容。

---

## 三、Buying Triggers（5 个 EVENTS）

> Events, not states. 不是"想降本"，是"刚刚发生的某件具体事让 CEO 在 OKR 复盘会上敲桌子"。

| # | Trigger event | Predicted prevalence | What they Google / ask after |
|---|---|---|---|
| 1 | **大促刚结束，工单积压未清，CSAT 跌破内部红线**（Q4 复盘会议、双 11 后两周、Prime Day 后 10 天） | ⭐⭐⭐⭐⭐（一年触发 4-6 次，全行业共振） | "AI 客服 出海"、"amazon customer service automation"、"shulex vs 美洽"、"自动回复 amazon 24 小时" |
| 2 | **CFO 砍 BPO 预算 15-25%，要求"用 AI 顶一半工单"**（年初 budget revision 或融资后 burn 审视期） | ⭐⭐⭐⭐ | "ai customer service cost saving"、"deflection rate benchmark"、"per resolved ticket pricing ai" |
| 3 | **新进 / 新晋 CS 总监入职，3 个月内必须出"数字化路线图"汇报老板** | ⭐⭐⭐⭐ | "全球客服 AI 化 roadmap"、"customer service AI vendor RFP template"、"intercom fin vs decagon vs ada" |
| 4 | **被 Amazon / Shopify 警告 response time 不达标，listing 被降权一次**（高度突发，恢复焦虑期 72h） | ⭐⭐⭐ | "amazon response time policy"、"24 hour reply automation amazon"、"buyer seller messaging ai" |
| 5 | **进入新市场（如从 US 扩 EU，从 Amazon 扩 TikTok Shop / 独立站），多语种 + 多平台一次性炸开** | ⭐⭐⭐ | "shopify multilingual customer service"、"tiktok shop customer support automation"、"独立站 客服 ai" |

**关键 read：**
- Trigger #1 是**季节性高潮**，内容日历必须押在 Prime Day / 双 11 / 黑五 / Q4 这四个节点前 30-45 天密集发声
- Trigger #2 是**财务驱动**，决策快但要 ROI 数据——Step 4 必须准备 **"BPO vs Solvea TCO calculator"** 这种 lead magnet
- Trigger #3 是**新人焦虑驱动**，预算大但 cycle 长（3-6 个月）；需要 "Vendor Comparison Buyer's Guide" 内容形态
- Trigger #4 是**紧急消防**，72h 内决策，付费意愿最高——这是 sales hand-raise 的最强信号；落地页 + Google Ads 必须直接接这类长尾词
- Trigger #5 是**扩张 momentum**，profitable 公司主动找方案，sales cycle 短

---

## 四、Top 3 Objections + 最强 Counter

| # | Objection | Counter (1 sentence, evidence-backed) |
|---|---|---|
| 1 | **"AI 回错话被截图传到 Reddit / 微博，我担不起公关责任"** | "我们对前 30 天部署的每条 AI 回复做 100% sample 审核，AI 不确定 (confidence < 0.85) 自动转人工；可以从 5% traffic 灰度起，你的 CSAT 跌 0.1 分我们 24h 内 rollback——这是 Anker / Insta360 同样的上线 protocol。" |
| 2 | **"Shulex / 美洽 / 网易七鱼已经在出海客服赛道做了好几年，你为啥比他们好？"** | "Shulex 的强项是 VOC 分析（review mining），客服 deflection 是延伸；我们 day-one 就是 autonomous resolution，不靠人工搭话术树。Decagon / Sierra 在英文市场也是这个路线，但他们不做中国总部知识库联动 + Amazon Seller Central 深集成——我们做。" |
| 3 | **"per resolved ticket 定价听起来好，但财务部门不接受'浮动成本'，他们要可预测的 SaaS 月费"** | "可以混合：base subscription（覆盖系统 + 50% 工单）+ overage（per resolved ticket）。Anker / Dreame 都是这种合同结构，财务部签字流程和传统 SaaS 一样，但 ROI 上 CFO 能给老板讲"我们浮动那部分只有解决了才付钱"——这是他们的 CFO 喜欢的故事。" |

**真实 objection list（CIA Step 8/9 应跑销售录音）：**
- "中文工程师团队我们海外子公司能不能直接 ticket 给你们？" → support hours / SLA 透明化文档
- "我们用的是 Salesforce Service Cloud，集成需要多久？" → 标准 connector + 14 天 POC
- "数据出境 / GDPR / 个保法怎么处理？" → 多 region 部署 + 数据驻留承诺
- "如果我们退出，知识库带走吗？" → exit-clause 必须 day-1 写进合同模板
- "CSAT 跌了你赔吗？" → SLA 条款写明 CSAT delta，违约 prorate credit

---

## 五、Vocabulary Audit

> 这一节是 run-agent.py 写 Reddit / X / LinkedIn / 小红书内容时的语料底座。Solvea 11 个 GTM Agent 的 voice 一致性靠这张表。

### 5.1 词汇他们用（自描述 + 行业黑话）

**Tier 1（always — 100% 出现在客户嘴里）：**
- **中文圈**: 出海、跨境、Amazon / 亚马逊、Listing、买家信息（Buyer-Seller Messaging）、A-to-Z claim、差评、Review、CSAT、坐席、工单、退换货、海运 / 头程、知识库、SOP、转人工、升级率、SLA、大促、Prime Day、双 11、黑五（黑色星期五）、Q4 旺季、出海 BPO、菲律宾 / 越南客服、深圳 / 杭州、独立站、TikTok Shop、Shopify
- **English-side**: ticket, deflection rate, resolution rate, escalation, CSAT, NPS, BSR, ASIN, marketplace, listing suppression, response time, after-hours coverage, multilingual support, knowledge base, BPO, agent, conversation, intent, sentiment

**Tier 2（often — 高频出现）：**
- 中文: 智能客服、AI 助理、机器人、话术树、转化率、复购、爆品、SKU、产品经理（PM）、运营（OPS）、客户成功
- English: agent assist, contact center, omnichannel, intent classification, sentiment analysis, autonomous, copilot, augmentation, ROI

### 5.2 词汇他们不用（销售感 / 学术 / 平台感 — 避雷）

**严禁出现：**
- "Vibe Builder" — 客户不知道是啥（这是 Step 1 强烈批评的点）
- "10-min deploy" — 客户不 care 部署速度，care upper-bound 工单解决率
- "AI Receptionist" — 听起来像 medspa SMB，enterprise CS leader 会立刻关页面
- "Conversational AI Platform" — 太 buzzword，VC 风
- "End-to-end Customer Engagement Suite" — Gartner 体；客户内部说"客服系统"
- "Cognitive Agent" / "Agentic AI" — 学术圈词；客户说"AI 客服"或"自动化客服"
- "Empower your team" — 翻译腔，中文圈一看就是机翻
- "Transform your customer experience" — Salesforce 体，过敏免疫
- "Revolutionary" / "Game-changing" — 中文圈听起来像微商
- 用拼音"Kefu"代替"客服"（在英文内容里）— 让人觉得本地化能力差

### 5.3 触发情绪词（pain + relief language pairs）

| Pain phrase | Relief phrase |
|---|---|
| "大促人手顶不住" / "Q4 工单爆了" | "高峰期不掉链子" / "峰值自动弹性" |
| "海外客服招不到人" / "时差永远填不平" | "24/7 native 多语种自动覆盖" / "时差自动接管" |
| "Amazon 24h 回复 SLA 跟不上" / "listing 又被降权了" | "Amazon SLA 100% 达标" / "Buyer message 自动 60 秒内回复" |
| "差评一来就是 1-star" / "公关事故担不起" | "差评前置拦截" / "上线前先做 30 天 confidence 灰度" |
| "客服永远是成本中心" / "老板不重视" | "客服变成数据引擎" / "ticket 反哺产品 / 营销" |
| "AI 回错被截图" / "翻车风险" | "confidence-based handoff" / "100% sample 审核" |
| "升级率 30%+ 转人工太多" / "AI 没用" | "60%+ autonomous resolution" / "复杂工单也能 close-loop" |
| "迁移成本高于现状成本" / "锁死风险" | "知识库可导出" / "exit-clause day-1 透明" |

**voice tone：** 同行同行（peer-to-peer）口吻，**不是**乙方推销口吻。文案中要有"我们 / 你们 / 兄弟"这种**同业人感**，避免"贵司 / 您"过度正式。中文内容掺合英文专有名词（CSAT、SLA、BSR、ASIN）是 ICP 真实状态，不要全翻译。

---

## 六、Channel × Trigger 映射

> 这一节驱动 Step 4 的 11 GTM Agents 中哪几个要重火力。

| Trigger | First search platform | Discovery channels | Decision channels |
|---|---|---|---|
| #1 大促后 CSAT 跌破红线 | Google + 知乎（中文）+ 微信搜一搜 | 公众号长文、知乎专栏、跨境者联盟 / 跨境眼资讯、Amazon 卖家社群 | LinkedIn 私信 + 同行 referral + sales call |
| #2 CFO 砍预算 | Google + LinkedIn 搜索 | LinkedIn thought leadership、Gartner / Forrester 报告、ROI 计算器 lead magnet | RFP + multi-vendor demo + reference call |
| #3 新 CS 总监出 roadmap | Google + LinkedIn + 公众号 | "买家指南" / "vendor 对比"内容、行业白皮书、招聘网站对手客户 logo | 邀请下线咖啡 / DemoDay、vendor advisory call |
| #4 Amazon 警告 listing 降权 | Google + Helium10 / Jungle Scout 论坛 + Reddit r/AmazonSeller | YouTube "Amazon listing recovery"、Reddit 详细帖子、Solvea blog 长尾 SEO | 落地页 → 自助 trial → sales pop-up |
| #5 进新市场 / 扩独立站 | Google + Shopify App Store + Reddit r/shopify | Shopify App Store integration listing、Shopify Plus partner ecosystem、独立站圈微信群 | Shopify 集成 demo + 多语种 case study |

**Agent 强度分配建议（给 Step 4 参考）：**
- **高火力（>70% 资源）**：02-blog（长尾 SEO + buyer's guide）、03-linkedin（thought leadership for CS leaders）、08-wechat（公众号长文）、06-reddit（r/AmazonSeller + r/shopify + r/ecommerce）
- **中火力（20-25%）**：04-x（英文 thought leadership + 出海大佬互动）、07-zhihu（中文搜索 SEO + 知乎专栏）、10-xiaohongshu（出海 KOL 互动 + 跨境者社区）
- **低火力（5-10%）**：01-tiktok（hook 实验 + 短视频获客）、05-youtube（深度 case study）、09-newsletter（订阅养鱼）、11-podcast（嘉宾 outreach）

**关键非对称机会：**
- **微信公众号长文**在中国出海圈影响力 = LinkedIn 在欧美 = 2x discovery 渠道。多数西方对手不发中文，是 Solvea 结构性优势
- **Reddit r/AmazonSeller** 是 Trigger #4 最大 inbound 来源，每周 50-100 个 "listing suppressed because response time" 真实帖；Solvea 应**自养 1-2 个真实身份账号**做 1 年长线社区贡献，不发广告

---

## 七、Top 3 用户访谈问题（for Founder to actually run this week）

Founder 应该这周 cold email 5 个真实出海品牌 CS 总监（建议从 Anker / Insta360 / Dreame / ESR 已有 contact 升级问 + 4 个 cold outreach 跨境者联盟里的 head of CS），每人问下面 3 个问题：

1. **过去 12 个月，你们客服部门最大的"翻车事件"是什么？造成的具体损失？复盘后做了什么改变？**
   *目的：验证痛点排序。如果 5 人中 ≥ 3 人提到大促 / Amazon SLA / 多语种翻车，痛点 #1 #3 #2 优先级确认。*

2. **如果你要在 6 个月内给老板讲"客服 AI 化"的成功故事，你会用什么 metric？为啥这个 metric 是老板会被打动的那个？**
   *目的：捕捉真实的 success metric vocab + 老板视角。Solvea sales deck 应该完全用这套词。*

3. **如果今天给你 200 万人民币 / 30 万美金 budget 必须 3 个月内花在客服上，你会怎么花？为啥？**
   *目的：测试 Solvea $30K-$100K ACV 在真实预算分配中的位置。如果他们的回答是"招 5 个 native"而不是"上 AI 系统"，意味着 Solvea 还要 reframe 价值主张。*

**反模式（不要问的问题）：**
- "你们觉得 AI 客服 important 吗？" → 100% 答 yes，0 信号
- "你们会买 Solvea 这种产品吗？" → 用户不知道自己会不会买，问到的全是 social desirability bias

---

## 八、对 Step 1 假设的回看

| Step 1 假设 | Step 2 用户层面证据 | 是否需要调整 Step 1 |
|---|---|---|
| L3（中国出海 CS）是真正 wedge | ✅ 强化——5 个真实痛点 4 个都是 L3 独有（大促、Amazon SLA、多语种、知识库联动），SMB receptionist 痛点无法承载这些 narrative | 保持 L3 主战场判断 |
| "10-min deploy" 不是真正 differentiator | ✅ 强化——客户嘴里完全没出现"快"这个词，他们关心 confidence + rollback + CSAT delta | Step 1 关于换 metric 的建议（resolution rate + CSAT delta）正确，Step 3 必须按这个 reframe |
| per-resolved-ticket 定价已被 Decagon / Ada 验证 | ⚠️ 部分弱化——L3 客户的财务部门更接受**混合**（base + overage），纯 per-ticket 浮动让 CFO 难批 | Step 3/4 需把定价 narrative 改为"hybrid: base sub + outcome overage" |
| Anker / Panasonic / ESR / Dreame / Insta360 / Rakuten 是 anchor case study | ⚠️ 假设它们是真实付费 + 深度使用客户。如有 ≥ 2 家只是 pilot/free，case study narrative 强度会折半。**Founder 必须确认状态**——这是 Step 3/4 内容生死线 | 不调整 Step 1，但 Step 4 case study 须基于真实付费/深度使用客户 |
| 12 个月窗口期 | ✅ 强化——Trigger #1 / #4 都是季节性 / 突发性，Solvea 在 Q3 2026 抢占 Prime Day + 双 11 内容窗口可以一战定段位；错过 Q4 2026 后 Shulex 内容护城河加深 | 保持 |
| 排除 US SMB medspa/HVAC | ✅ 强化——Step 2 的痛点和 vocabulary 与 SMB 完全不重叠，强行做就是分裂 voice | 保持，并在落地页主图 / hero copy 立刻去除 medspa/HVAC 暗示 |

**新增 Step 1 应补充的洞察（递给 Step 3 Competitor Analysis）：**
- Shulex 强在 VOC 分析（review mining），弱在 autonomous resolution → Solvea 的差异化锚点
- 美洽 / 网易七鱼 强在国内电商，弱在出海多语种 SLA → Solvea 的真实对手是 Shulex + Salesmartly，不是美洽
- Decagon / Sierra 强在英文 native + Resolution Rate，弱在中国总部知识库联动 + Amazon Seller Central 深集成 → Solvea 的护城河锚点
- Intercom Fin 强在 install base + native chat 集成，弱在跨平台（Amazon / 独立站 / TikTok Shop）+ 中文 → Solvea 不正面打，做 wedge

---

## 九、Data Gaps

可让这份 brief 从"LLM 推理"升级到"真实数据"的 CIA pipeline 调用清单：

1. **App Reviews / G2 Reviews**:
   - Shulex (app_id 待查 + G2 listing) — 取近 200 条 review，找抱怨 cluster
   - Salesmartly / Sobot / 美洽 (G2 + Capterra) — 同上
   - Zendesk Suite + Salesforce Service Cloud — 来自出海卖家的负面 review（"too expensive"、"poor multilingual"、"no Amazon integration"）
2. **Reddit scrape**:
   - r/AmazonSeller × ["customer service AI", "response time policy", "buyer seller messaging automation", "ai listing suppressed", "amazon CS BPO"]
   - r/shopify × ["customer support AI", "multilingual support", "chatbot for Shopify", "Tidio alternative"]
   - r/ecommerce × ["customer service automation", "AI customer service vendor", "Intercom Fin review"]
3. **TikTok hook patterns**:
   - 中文 hashtag #跨境电商 #亚马逊卖家 #出海卖家 高 share 视频前 50，提取 hook 前 3 秒文本模板
   - 英文 #amazonseller #ecommerce 高 share 视频 customer service 主题
4. **LinkedIn Sales Navigator scrape**:
   - 中国出海 Top 200 品牌（按 Tracxn / 海豚智库 / 易观出海 list）的 "Head of Customer Service" / "VP Customer Experience" / "客服总监"
   - 现有 tech stack（Zendesk / Salesforce / Freshdesk）+ 已发 LinkedIn 内容主题
5. **知乎 / 公众号 scrape**:
   - 知乎 "出海 客服"、"亚马逊 客服 SLA"、"AI 客服 出海" 高赞回答 + 评论区
   - 跨境者联盟 / 卖家精灵 / 出海笔记 / 浪潮新消费 公众号近 12 个月相关长文 + 留言
6. **Sales call recordings**（Founder 内部数据）:
   - 过去 12 个月 Top 20 sales call transcript → CIA 跑 objection clustering + price reaction pattern
   - 失败 deal 复盘的 lost reason → 是真 product gap 还是 sales motion 问题
7. **Founder structured customer interview**:
   - Top 5 付费客户结构化访谈（用第七节 3 个问题）+ 5 个 lost deal 后续访谈

如果只能跑一个：**Reddit r/AmazonSeller + 沙利文 / 海豚智库出海品牌 list LinkedIn scrape**。前者给 vocabulary + 痛点真实分布，后者给 cold outreach target list。

---

## 十、Key Assumptions

5 条 invalidation conditions——任何一条被证伪，brief 需推翻重做：

1. **L3 ICP 真实可触达**：中国出海品牌 $30M-$500M 营收段 ≥ 2,000 家具备 $30K+ 年客服系统预算 + 客服总监决策权。如实测只有 500-800 家（远小于 Step 1 预估的 10K），TAM 缩水至 $50-150M，需要再下沉到 $5-30M 营收段重做 ICP（但那一段付费意愿 / 决策周期 / ACV 全部不同）
2. **大促 / Amazon SLA / 多语种是真实 Top-3 痛点（而非 Founder / agent LLM 一厢情愿）**：5 个 Founder 访谈中 ≥ 3 人主动提到这三个痛点之一。如他们的 Top 1 是"客服离职率" / "知识库找不到东西"这类内部 ops 问题，wedge narrative 须重排
3. **Decagon / Sierra / Ada 不会在 12 个月内做中国总部知识库联动 + Amazon Seller Central 深集成**：如 Decagon 2026 Q4 发布 Amazon 集成 + 中文 console，Solvea L3 护城河瞬间 50% 蒸发
4. **混合定价（base + outcome）能被 ≥ 60% L3 buyer CFO 接受**：如调研发现 ≥ 60% CFO 仍然只签固定年度合同，Solvea 的差异化定价 narrative 失效，需要回退到传统 SaaS 定价 + outcome SLA 罚则的形态
5. **Solvea 团队具备中文 + 英文 + 日文 GTM 双语 sales motion 能力**：如团队中无人能跑深圳 / 杭州面对面 sales call + 同时在 LinkedIn 写英文 thought leadership，L3 + L4 双线 GTM 不可执行——需要先建团队（3-6 个月延迟）

**如果 #1 + #2 同时被证伪**：Solvea 实际 ICP 模型错误，必须重做 Step 1 + Step 2，不能继续到 Step 3。

**如果只是 #3 被证伪**：Solvea 的窗口期从 12 个月压缩到 6 个月，必须在 Q3 2026 之前抢占内容心智 + 标杆 case study 公开化。

---

## ✦ 给 Hunter 的最后一段话

Step 1 说"你的 marketing 在说 A，sales 在做 B"。Step 2 把 B 这个用户摸清楚了：他们不是 medspa 老板，他们是深圳 / 杭州那栋写字楼 18 层的客服总监，刚开完一场把椅子坐穿的 Q4 复盘会，老板让她 30 天内出"AI 客服路线图"，她的 LinkedIn 收藏夹里塞着 Decagon / Sierra 的 demo 录屏，但她真正在 Slack DM 里问同行的是"你们 Amazon Buyer Message 24h SLA 怎么搞？"。

这个人不需要"Vibe Builder"，她需要的是**一个让她在述职会上有 number 可讲、且 24h 内可以 rollback 的安全方案**。Solvea 的 voice、定价、case study、content 全部要按这个人来组织。

Step 2 落定后，Step 3（Competitor Analysis）就要 anchor 在三组对标：
- **真正的 L3 直接对手**：Shulex + Salesmartly + Sobot（中国出海 CS SaaS）
- **L1 上限标杆**：Intercom Fin + Decagon + Sierra（autonomous resolution 范式）
- **L3 客户当前 cope 替代品**：Zendesk + Salesforce SC + 自建 + 海外 BPO（真实 budget 流向的对手）

不要再在 Step 3 里出现 PKSHA / BEDORE / commubo——那是日本市场对标，不是 Solvea 的核心战场。

—— ContentOS Agent · CIA Methodology v2 · 2026-05-11
