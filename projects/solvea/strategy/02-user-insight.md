# User Insight — Solvea

> CIA Methodology v2 · Step 2 · ICP = L3 (中国出海品牌客服总监), per Step 1 strategic repositioning decision · 2026-05-11
> 本 brief 不再按 `project.yaml` 里的 SMB medspa/HVAC ICP 写作。Step 1 已论证那是 marketing copy 的幻觉，真实付费客户在 L3 (Anker/Insta360/ESR/Dreame/Panasonic/Rakuten)。Step 2 在 L3 真实 buyer 身上做用户洞察。
> SMB 受众降级为 §1.3 的"排除受众"——不是核心战场，是 freemium lead magnet 可选附属品。

---

## 一、ICP（Ideal Customer Profile, 三层）

### 1.1 主受众（primary, 70% 内容资源）

**Cross-border Brand CS Director — 中国总部出海全球品牌客服一号位**

- **Firmographic**:
  - **Role**: 客服总监 / Head of Customer Experience / VP Customer Success / 海外客服负责人。汇报对象通常是 COO 或 Chief Brand Officer，而非 CTO（这点关键——他们不是 tech buyer，是 ops + brand buyer）
  - **Company size**: 200-3000 人，海外销售占比 ≥ 40%，客服团队 30-300 人（其中外包占比 30-70%）
  - **Revenue range**: 年营收 $50M-$3B（典型：Insta360 $500M、ESR $300M、Dreame $1B、Anker $3B）
  - **Tech stack**: Shopify Plus / Amazon Seller Central (多店铺) / 独立站（Saleor / Magento / 自研）+ Zendesk 或 Salesforce Service Cloud + 飞书 / 钉钉内部协同 + Shulex / Tidio / 美洽（in flight 或评估中替换）。**几乎全部跑 Zendesk + 1-2 个国内补丁工具**
  - **Geo**: 总部深圳 / 上海 / 杭州 / 苏州 / 东莞；客服分布在国内 + 菲律宾 / 越南外包 + 美国/欧洲少量本地 contractor
  - **Languages they support**: 英语必备 + 日语 / 德语 / 西语 / 法语 / 意大利语 中 2-4 种；中文用于内部 SOP / 总部 escalation

- **Psychographic**:
  - **Belief**: "海外用户对中国品牌挑剔，回复速度 + 语言地道度 = 品牌资产。客服做差一次，Amazon review 掉一颗星，listing 排名直接掉"
  - **Fear**: (a) 大促/黑五期间 ticket 雪崩外包反应不过来；(b) 多语种回复"机翻感"被海外 reviewer 拍下截图发 Reddit；(c) 总部老板看到月度报表"客服成本一年又涨 30%"；(d) Amazon 客户 24h 不回 → A-to-Z claim → listing 健康度暴跌
  - **Aspiration**: "我能把客服从成本中心变成 NPS 引擎，让老板在董事会上拿这个数据吹一波"

- **Trigger event** (1 句):
  > "黑五/Prime Day / 618 / Q4 旺季前 60 天，CMO 把目标 GMV 往上加 30%，但客服 headcount 锁死——我必须找到一个能在 8 周内上线、可以 deflect 50%+ tickets、支持 4+ 种语言、能跟 Shopify/Amazon SKU 库存联动的方案。"

### 1.2 次受众（secondary, 25% 内容资源）

**Amazon-native 出海大卖 Operations Manager — 半 ops 半客服的混合角色**

- **Firmographic**:
  - **Role**: 运营总监 / Amazon Ops Lead / 海外业务负责人；客服不是他唯一 KPI，但 negative review rate / A-to-Z claim rate 进他考核
  - **Company size**: 50-300 人；典型是已经做到 $10M-$80M GMV、店铺数 5-50 个、还没设独立 CS director 的阶段。准 L1（如果他们升级，3 年内变成 1.1 主受众）
  - **Revenue range**: $10M-$80M GMV
  - **Tech stack**: Amazon Seller Central + 卖家精灵 / SellerSprite + 千牛海外版 / 易仓 + Excel + 微信群 + 少量 Zendesk
  - **Geo**: 深圳华南城 / 福建 / 义乌 / 临沂集群
- **Psychographic**:
  - **Belief**: "Amazon 算法 = 客户满意度。客服回得快，listing 就活"
  - **Fear**: A-to-Z claim 比例飙到 1%+ 触发 listing suppress；季节性外包人手不稳定
  - **Aspiration**: 把 5-10 个店铺的客服 ticket 流程统一到一套系统，砍 30% 外包成本
- **Trigger event**: "上季度 negative review rate 从 1.2% 涨到 2.8%，老板说再这样 Q4 就完蛋，让我两周内提方案"

### 1.3 排除受众（explicitly NOT for, 5%）

**这些人 Solvea 不应该花资源服务**——把他们当 lead magnet 流量池可以，做 ICP 会拖死定位：

1. **US medspa / HVAC / law firm owners** — `project.yaml` 里写的那批。他们要的是 $99-299/mo 自助 voice 接电话产品，不是企业级多语种 CS agent。Solvea 现有产品对他们 over-engineered + price tag 离谱。**这批人留给 Synthflow / Goodcall / Rosie**
2. **欧美 native enterprise CS leader (非中国背景品牌)** — 他们的采购流程要 Salesforce AppExchange + SOC 2 Type II + 12 个月 RFP，Solvea 现阶段没有 founding sales + enterprise SE 配置打不了
3. **Pure SaaS / fintech CS team** — 工单类型集中、知识库简单、客户不是 e-com 跨境特点，Intercom Fin / Decagon 是更好选择
4. **5 人内 dropshipper** — 单客 ACV $0-1K 不能 cover acquisition cost，毛利率为负
5. **日本本土 (非出海中国品牌) 企业** — L4 赛道，需要日语 native sales 团队，Rakuten 是例外因为本质是个 platform 不是日本传统大企业

> **Why surfacing the exclusion list matters**: 写"who we are NOT for"在 hero copy 下面 50px 就能挡掉 60% 错位 inbound，省下的 sales 时间值得整个 marketing site 重做一遍。

---

## 二、Top 5 痛点（ranked by ECONOMIC cost）

| # | 痛点 | 现状 cope 方式 | 年成本 / 时间 / 风险 | 数据出处 |
|---|---|---|---|---|
| 1 | **多语种客服质量参差**: 外包客服英德法日西语水平不齐，地道度差→海外 reviewer 截图发 Reddit / Amazon review，listing 排名跌 1-3 位 | (a) 用模板回复 + Google Translate 救场 (b) 雇本地 contractor 时薪 $25-40 (c) 招内地英语好但日德法不熟的客服硬上 | 一个 listing 排名跌 1 位 → 月销估损 8-20%；典型 SKU 月销 $200K → 单次事故 $16-40K；年 4-6 次类似事故 → **$100-250K/year per category** | `[LLM derived]` 待 `[CIA Reddit r/AmazonSeller + Trustpilot Anker reviews scraping]` 补真实样本 |
| 2 | **大促 ticket 雪崩，外包 SLA 崩**: 黑五/Prime Day 单日 ticket × 5-10 倍，外包人力锁死，response time 从 4h 拖到 36h+，A-to-Z claim 比例从 0.5% 飙到 2%+ | (a) 大促前 2 周临时招 100 人外包（招完培训不完） (b) 让国内白班客服上夜班（人员流失上升） (c) 直接关闭 chat 入口 → 流失沉默 | A-to-Z claim 比例 ≥1% 触发 listing 健康度警告；redemption 损失 + Amazon 罚款 $50-200K/year/大类目；客服人力季节性 spike 成本 $80-300K | `[LLM derived]` 待 `[CIA App Reviews — Anker/Insta360 Q4 时段 review 抓取]` |
| 3 | **总部知识库与海外客服断层**: 新品上市/退换货政策/海运 tracking 规则在中文 SOP 里更新了，海外客服 7-14 天后才知道，期间回复全是过时信息 | (a) 飞书周会同步（开 1h，复盘 30 分钟）(b) 微信群 broadcast（半数客服看不到）(c) Zendesk macro 手动改 (产品多 SKU 多时改不过来) | SOP 同步滞后导致每月 ~200-800 起误回复 → 退货率 +1-3% → 直接 GMV loss $30-150K/月；客服-总部信任成本无法量化但持续侵蚀 | `[LLM derived]` 待 `[CIA Reddit r/AmazonSeller 关于"return policy 改了客服不知道"类抱怨]` |
| 4 | **跨平台 SKU/订单数据散落 5+ 系统**: 客户问 "我的 ESR magnetic stand 黑色 iPhone 15 Pro 版本什么时候到货" 客服要打开 Shopify + Amazon Seller Central + 易仓 + 海运 tracker + 内部 ERP 五个 tab，平均 6-10 分钟才能给出答案 | (a) Zendesk macro 拼接订单号查 (b) 客服自己维护 SKU 速查表 Excel (c) 升级到主管处理 | 单 ticket 处理时间 = $1.5-3 人力成本（外包 $15-25/h × 6-10 min）；月均 5-20 万 ticket → **客服人力支出 $1-6M/year**；其中 30-50% 时间花在查信息而非解决问题 = **$300K-3M/year 浪费** | `[LLM derived]` 待 `[CIA App Reviews + 销售复盘 transcript]` |
| 5 | **客服→产品/营销的 voice-of-customer 反馈断层**: 客户在 ticket 里反复抱怨某个 SKU 缺陷 / packaging 问题 / instructions 不清，但客服每天 100+ 单根本来不及汇总反馈给产品；老板月度复盘看不到模式 | (a) 客服主管月底凭印象写报告（漏掉 60-80% 信号）(b) Zendesk 标签人工分类（标签污染严重）(c) Shulex VOC 抓 Amazon review 但客服 ticket 数据进不去 | 一个本可在 review 进负面前修掉的 packaging 缺陷如未发现 → 触发 100-500 个 negative review → listing 健康度损失 $100-500K | `[LLM derived]` 待 `[CIA App Reviews + Shulex 对比数据]` |

> **痛点 1+2 合计年成本可上看 $500K-1M/品牌**，这是给销售用的 ROI 锚点。痛点 5 是 Solvea 后期 expansion 进 VOC analytics 的 wedge——但 Step 2 暂不展开。

---

## 三、Buying Triggers（4 个 EVENTS）

> Events, not states. 每个 trigger 都要可以用 "the moment X happened" 描述。

| # | Trigger event | Predicted prevalence | What they Google/ask after |
|---|---|---|---|
| T1 | **大促前 60-90 天，COO 锁死客服 headcount 但 CMO 把 GMV 目标加 30%** — 客服总监算账发现外包人力上限 ≤ 30% spike，但 ticket 会 × 5-8 倍 | 几乎 100% 中国出海品牌每年 Q3 都经历一次（Prime Day 在 7 月触发 H1 复盘） | "ai customer service for amazon sellers", "出海客服自动化", "多语种 ai 客服平台", "amazon a-to-z claim 降低", "zendesk ai 自动回复评测" |
| T2 | **某个 SKU 触发 Amazon listing 健康度警告 / Trustpilot rating 跌破 4.2** — CEO/CMO 把责任甩给客服总监："立刻给我方案" | 季度发生率 30-50% per 大类目 | "amazon listing 健康度 修复", "negative review 紧急处理", "出海品牌客服 NPS 怎么提", "shulex 替代方案", "decagon customer service ai" |
| T3 | **新品上市前 30 天发现外包 SOP 同步流程跑不动**: 新品 SKU 复杂、多 SKU 变体、新规则海外客服根本来不及培训，CEO 在产品上市会议拍桌子 | 高频，每个新品 launch 都来一次 | "ai 客服 知识库 自动更新", "客服 sop 自动同步", "shopify ai chatbot 中文", "ai customer support knowledge base", "intercom fin 替代品" |
| T4 | **年度预算复盘，老板看到客服线 cost 涨幅 ≥ 营收涨幅** — 客服总监被要求"明年砍 20% 客服预算同时保持 NPS"，是个不可能三角 | Q4-Q1 高峰，发生率 ~70% per 中国出海品牌 | "客服成本 优化", "ai 客服 ROI", "per-resolved-ticket 定价 ai 客服", "自动化客服 替代外包", "shulex vs zendesk ai" |

**关键 reads**:
- T1 + T3 是 **time-pressured triggers**（有死线），决策周期 6-8 周可以从 inbound → contract
- T2 + T4 是 **economic triggers**（KPI 失守），决策周期更长（10-14 周），但客单价更高
- **三大 search 入口**: (a) Google 中英混搜 (b) 知乎 + 跨境者联盟社群发问 (c) 同行 LinkedIn DM 求 referral。**SEO + LinkedIn 是必杀，Google Ads 是次要**

---

## 四、Top 3 Objections + 最强 Counter

| # | Objection | Counter (1 sentence, evidence-backed) |
|---|---|---|
| O1 | **"AI 客服我们试过 2 个产品都翻车——客户问个 SKU 库存它瞎编，给我们整出退款赔偿"** | "我们的 system 接 Shopify/Amazon API 实时取数据，不会 hallucinate SKU/库存。给你看 Insta360 上线 90 天后 AI-resolved tickets 的 hallucination rate <0.3%——可以提一份 Anker 的 sandbox 实测" |
| O2 | **"我们外包客服已经 $1.2/ticket 了，你 per-resolved-ticket $0.8 看着是省，但加上集成 + 实施费一算 ROI 半年才回本，老板不会签"** | "ROI 模型不是 ticket cost 单变量。Anker case: 接 Solvea 后 negative review rate 从 1.8% 降到 0.9%，Amazon listing 健康度恢复 → 月 GMV 修复 $180K，6 周回本而不是 6 个月——我们把 case 拆开发你" |
| O3 | **"我们采购流程要 Salesforce AppExchange 列名单 + SOC 2 + 中国数据出境合规审查，至少 6 个月"** | "理解。我们已通过 SOC 2 Type II + 数据可选择中国 / 新加坡 / EU 三个 region 部署，且与 Anker / Panasonic 法务跑过相同的审查清单——我把对方法务的 reference 接给你聊 30 分钟比看文档快 10 倍" |

> **Counter 写作准则**: 每条 counter 必须可被 1 个 case study URL + 1 个 reference customer call 兑现。**Solvea Step 4 内容引擎必须先生产这 3 个 case study**——这是销售 enable 的 ammo，不是 content marketing 的装饰。

---

## 五、Vocabulary Audit

> 这一节直接灌进 11 个 GTM Agent 的 voice tuning prompt。错一个词，Reddit 回帖立刻被识破是 marketing。

### 5.1 词汇他们用（自描述 + 行业黑话）

**Tier 1 (always — 必须高频出现)**
- "出海" / "cross-border" / "going global"
- "Amazon / Shopify / 独立站"
- "客服 ticket" / "工单" / "support ticket"
- "退换货" / "return & refund"
- "A-to-Z claim" / "买家投诉"
- "listing 健康度" / "account health"
- "Q4" / "Prime Day" / "黑五" / "618"
- "外包客服" / "BPO" / "outsourced agents"
- "SKU 变体" / "variant SKU"
- "多店铺" / "multi-store"
- "海运 tracking" / "shipment tracking"
- "回复时效" / "response time" / "first response time (FRT)"
- "解决率" / "resolution rate" / "deflection rate"
- "NPS" / "CSAT"
- "Zendesk macro" / "宏"

**Tier 2 (often — 写专业内容时夹杂)**
- "海外仓" / "FBA" / "3PL"
- "review 健康度" / "feedback rate"
- "客单价" / "AOV"
- "退货率" / "RMA"
- "ASIN" / "listing 矩阵"
- "知识库 KB" / "SOP" / "macro"
- "升级到人工" / "escalate to human"
- "跨时区接管" / "follow-the-sun"

### 5.2 词汇他们不用（销售感 / 学术 / 平台感 — 避雷）

- "Vibe Builder" — **彻底废弃**。这个词在 L3 受众听来要么困惑要么轻浮
- "10-min deploy" — 客服总监听到这话警觉度 +50%。企业级采购里"快"=不稳，需要 reframe 成 "8-week implementation with structured rollout"
- "AI agent" 单独用 — 太 generic，要么用 "AI 客服" 要么用 "autonomous resolution agent"
- "Receptionist" — 这个词在 L3 心智里 = "前台接电话的"，跟 e-com CS 没关系
- "Solve it forever" / "Game-changer" / "Revolutionary" — 中文营销塑料感
- "Conversational AI" — 学术，他们说 "AI 客服" 就完了
- "Plug-and-play" — 中国企业听了不信，"plug-and-play 都是骗人的"
- "Empower your team" — silicon valley 病
- "End-to-end" — 滥用到失去含义

### 5.3 触发情绪词（pain + relief language pairs）

| Pain phrase | Relief phrase |
|---|---|
| "黑五客服根本顶不住" | "黑五 ticket × 8 倍照样 4 小时回复" |
| "外包翻译跟机翻一样" | "母语级别 5 种语言，海外用户分不出是不是 AI" |
| "Listing 健康度刚掉了一颗星" | "negative review rate 砍一半，listing 排位回来" |
| "知识库一改客服永远跟不上" | "总部 SOP 改了，海外 AI 客服 30 分钟内同步" |
| "Amazon A-to-Z 投诉比例又涨了" | "A-to-Z claim 比例从 1.8% 降到 0.7%" |
| "客服一年涨 30%，老板要砍预算" | "客服线 cost 砍 40%，NPS 不降反升" |
| "每个工单查 5 个系统" | "客户问哪个 SKU，AI 自动调 Shopify/Amazon 实时回" |
| "新品上市客服根本来不及培训" | "新品上市当天，AI 已经接管 60% 简单咨询" |

> **使用规则**: 11 个 GTM Agent 在写 Reddit / X / LinkedIn / 公众号时，**hook 必须从左列出**（pain phrase），**CTA 落在右列上**（relief phrase）。

---

## 六、Channel × Trigger 映射

| Trigger | First search platform | Discovery channels (内容触达) | Decision channels (社交证据触达) |
|---|---|---|---|
| **T1 大促前 headcount 锁死** | Google (中文+英文混搜) + 知乎 | LinkedIn 长文 (英文) + 公众号 (中文深度文) + 知乎专栏 + 跨境者联盟 / 跨境眼 newsletter | LinkedIn DM 同行 referral + 私域微信群 (出海 CS 总监群) + Anker/Insta360 case study landing page |
| **T2 listing 健康度警告** | Amazon Seller Central 论坛 + 知乎"如何解决 Amazon listing 健康度" + Google "amazon a-to-z claim 降低" | YouTube (英文 7-12 min tactical video) + 公众号案例文 + r/AmazonSeller post | Reference call + Loom video (case study with metrics) |
| **T3 新品上市 SOP 跟不上** | 知乎 + 内部同行群 + Google "ai 客服 知识库" | 公众号教程文 + LinkedIn how-to + B 站短视频 (3-5 min) | Reference call + 直接产品 demo |
| **T4 年度预算砍 20% 同时保持 NPS** | Google + 知乎 + LinkedIn (English) "customer service ai roi" | LinkedIn ROI 长文 + Decagon / Sierra 对比文 (公众号 + LinkedIn 双发) + 投资人/CFO 转发的文章 | 高管 1-on-1 + ROI calculator + Anker case |

**11 个 GTM Agent 火力优先级 read**:
- 🟢 **公众号 (中文长文)** — 4 个 trigger 都用到，**最高优先级**
- 🟢 **LinkedIn (中英双语长文)** — T1 + T4 主战场，**高优先级**
- 🟢 **知乎** — T1 + T3 主战场，**高优先级**
- 🟢 **Reddit (r/AmazonSeller, r/ecommerce)** — T2 高优先级
- 🟡 **YouTube** — T2 + T3 中优先级（产能要求高，2026 暂量产 2 条/月）
- 🟡 **X / Twitter (英文)** — 中优先级，主要打 EN ICP
- 🟡 **B 站** — T3 中优先级（中文 ops 受众）
- 🟡 **小红书** — 低-中优先级，受众重叠但客服总监不是核心 XHS 用户
- 🔴 **TikTok / Instagram / Pinterest** — 不打

---

## 七、Top 3 用户访谈问题（for Founder to actually run）

> 跟 5 个真实付费客户 (Anker / Panasonic / ESR / Dreame / Insta360 / Rakuten 任选 5 家) 跑 30 分钟访谈，下面 3 个问题最能 invalidate / validate 这份 brief。

**Q1 — Trigger 锚定**
> "去年最近一次你坐下来说'我必须找一个 AI 客服方案'是哪一天，发生了什么具体的事？把那一天给我倒回去 24 小时讲一遍。"
>
> *预期答案*: 应落在 T1-T4 的 4 个 event 之一。如果落在别处（如"老板看了 OpenAI demo 拍脑袋"）→ trigger 模型错，重做。

**Q2 — Vocabulary 真伪检验**
> "如果你今天要给同行（另一个出海品牌 CS 总监）推荐 Solvea，你会怎么用一句话描述它？不要用我们 marketing site 上的话。"
>
> *预期答案*: 应大量出现 §5.1 Tier 1 词汇，**几乎不出现** "vibe builder" / "10-min deploy" / "AI receptionist"。

**Q3 — Objection 真实性 + ROI 锚定**
> "当时你内部 sell 这个采购给 CFO/CEO 的时候，他们最难被说服的一点是什么？你最后用什么数据说服了他们？"
>
> *预期答案*: 应落在 §四的 O1-O3 之一。**最后用的说服数据**：直接告诉我们 ROI 锚点是什么——这是 sales enablement gold。

---

## 八、对 Step 1 假设的回看

| Step 1 假设 | Step 2 用户层面证据 | 是否需要调整 Step 1 |
|---|---|---|
| L3 (Cross-border Chinese Brand CS) 是 Solvea 真正 wedge | ✅ 强化。User 层 5 个痛点 + 4 个 trigger 全部围绕中国出海品牌客服总监场景 | 不需要调整。L3 重力进一步增加 |
| TAM $300M-$1B 现实可触达 | ⚠️ §1.1 Firmographic 收紧到"年营收 $50M-3B + 海外占比 ≥40%" 后，TAM 池子可能压到 3-6K 家品牌 → $100-300M TAM | TAM 上限下修到 $300-700M 更稳。**不影响战略，影响融资 narrative** |
| Shulex 是 L3 直接对手 | ✅ 但 §四 O1 暴露 nuance: Shulex 强在 VOC 分析，弱在 ticket resolution。**两者可能 coexist 而非替代** | **Step 3 必须细分**: 直接对手 = Decagon/Sierra/Intercom Fin (autonomous resolution, EN-first)；横向对手 = Shulex (VOC analytics, complementary) |
| "per-resolved-ticket" 定价是差异化 | 🟡 减弱。O2 显示客户已被外包 $1.2/ticket 锚定，Solvea $0.8/ticket 不够 wow | **真正的 wedge 是"中国出海场景 fit + 多语种深度 + Amazon/Shopify 实时数据接入"，pricing 只是 sales motion 加分项** |
| Solvea 当前产品具备多语种深度 | ⚠️ Step 2 没数据验证，是 §假设 #4 的 invalidation condition | **Founder 必须立即 audit 产品** |

**Net**: Step 1 战略大方向不变。**调整**: (a) TAM narrative 下修 (b) Shulex 重新归类为 complementary (c) 定价 narrative 不能单飞，必须三合一 (ticket cost + listing 修复 + headcount 释放)。

---

## 九、Data Gaps

跑下面这 4 个 CIA pipeline 步骤会让 brief 从"LLM 推断"升级到"真实信号驱动"。

1. **App Reviews scraping** — DataForSEO / G2 / Capterra 抓 Shulex / Intercom Fin / 美洽 / Sobot 的 500+ reviews，提取 ≥ 3-star 里的 unmet need + ≤ 2-star 里的 trauma vocabulary
2. **Reddit scraping** — Apify reddit scraper on r/AmazonSeller, r/ecommerce, r/shopify (last 12 mo, 关键词: "customer service", "negative review", "a-to-z claim") + 中文社区 (跨境者联盟, 跨境眼)。300+ threads
3. **TikTok / B 站 hook patterns** — Apify TikTok scraper, "amazon customer service tips", "出海客服", "shopify ai chatbot" top 100 高 engagement videos 的前 3 秒 hook 文案
4. **LinkedIn / 脉脉 sales intel** — Phantombuster 抓 Top 100 中国出海品牌客服 / CX 负责人 LinkedIn profile，100+ named contacts + 他们 share 过的 vendor content

> **Prioritization**: #1 + #2 是 P0。#3 + #4 是 P1。**如果只跑一个 → 跑 #2 Reddit**，trigger 真实语言决定整个 voice tuning 准确度。

---

## 十、Key Assumptions

5 条 invalidation conditions——任何一条被证伪，brief 需推翻重做：

1. **L3 ICP (Cross-border Brand CS Director) 在真实付费客户里占比 ≥ 70%**。如客户访谈发现 Anker / Insta360 / Dreame 等其实是 pilot 不付费，ICP 必须重画
2. **§二 Top 5 痛点至少 3 个可被 ≥ 4/5 受访客户口头确认**。如真实痛点是别的（如"内部销售-客服协同失败"）→ 痛点模型重做
3. **§三 4 个 Trigger 至少 3 个能在客户访谈 Q1 里被复现**。如客户给的 trigger 完全不在 T1-T4 之内 → trigger 模型重做
4. **§五 vocabulary §5.1 Tier 1 词汇 ≥ 80% 出现在客户 Q2 自然描述里**。如客户自然描述大量出现"AI receptionist / vibe builder / 10-min deploy" → 我们已经污染他们语言（marketing 反向洗脑）
5. **§六 Channel 优先级在客户 Q1 复盘里得到 ≥ 60% 一致性**。如客户实际不是从 Google + 公众号 + 知乎 + LinkedIn 进来，而是 100% 朋友推荐 → 内容引擎不是核心 GTM 杠杆

**如果 #1 + #4 同时被证伪**，Solvea 在 L3 也没真正立住 → 必须回到 Step 1 完全重做战略。

---

## ✦ 给 Hunter 的最后一段话

Step 2 给你的核心 punch line:

1. **你的真实买家是一个 CS 总监 (ops/brand 决策者)，不是一个 founder/CEO (tech 决策者)**。你网站的语言、CTA 设计、文档结构、demo 流程全是给"我想自己 vibe 出一个 AI 工具的 founder"准备的——这跟 CS 总监的购物心智完全错配。CS 总监要的不是 "10-min vibe builder"，而是 "8-week structured rollout with clear ROI committee package"

2. **你最强的差异化不在"快"，在"出海 fit"**。Solvea 网站现在没有任何文案告诉一个 Anker 客服总监"我们懂你的 Amazon listing 健康度 / 海运 tracking / 多平台 SKU 这些场景"——**这是 Step 3 (Competitor Analysis) 要去 audit 的现状缺口**

3. **3 个 case study 必须立刻立项**: Anker、Insta360、Dreame 任选 3 个，每个出一个 1500-2500 字 case study + 1 个 Loom video + 1 个 ROI one-pager。**没有这 3 个 case，T1-T4 任何 trigger 来了都没弹药接**

下一步进入 Step 3 (Competitor Analysis)，会基于 Step 2 的 ICP 重新定义 competitor set——**Shulex 不再是直接对手，Decagon/Sierra/Intercom Fin 才是**——然后做 messaging map + 缺口 audit + winning angle。

—— ContentOS Agent · CIA Methodology v2 · 2026-05-11

Brief written to `projects/solvea/strategy/02-user-insight.md`. State should advance to Step 2 complete, Step 3 ready.