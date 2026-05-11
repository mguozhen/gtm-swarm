# User Insight — BTCMind

> 承接 Step 1：BTCMind 的产品定位从 "BTC AI signals" 转向 **"BTC Risk Co-pilot"** — 服务 perp/合约玩家 + 链上聪明钱跟单者。本 brief 在这个新定位下深挖三层 ICP、按经济成本排序的痛点、买入触发事件、词汇审计。

---

## 一、ICP（Ideal Customer Profile, 三层）

### 1.1 主受众（primary, 70% 内容资源）

**Cold-email-actionable 描述**：
> 在 Binance / Bybit / OKX / Hyperliquid 上交易 BTC 永续合约的散户，账户规模 $5k-$200k，用 5-20x 杠杆，每周交易频次 ≥ 3 次，过去 12 个月经历过至少 1 次清算（≥ 30% 账户损失），目前订阅 Coinglass Plus 或 TradingView Premium 但**没有**单独的"风险预警"工具。地理重心：韩国 / 中国大陆 / 越南 / 泰国 / 土耳其 / 巴西 / 阿根廷。

**Firmographic**:
- Role: 全职/半职加密交易员，部分有本职工作（程序员、电商运营、自由职业）
- Account size: $5k-$200k（中位数估 $15k-$30k）
- Tech stack: Binance/Bybit/OKX/Hyperliquid + Coinglass + TradingView + Telegram + 1-3 个 X 账号订阅
- Geo: 70% 亚太 + 20% LATAM/MEA + 10% 欧洲东部
- Age: 24-38（中位 29）
- Trading style: swing + scalp 混合，BTC perp 占头寸 40-70%

**Psychographic**:
- **Belief**: "我比 99% 的散户更懂 BTC，但还是会被市场操纵 wick 出去" — 既傲慢又焦虑的自我认知
- **Fear**: 不是"亏钱"本身，是**"在我没看屏幕的 3 小时里被 cascade 清算"** — 信息盲区焦虑
- **Aspiration**: 不是变成"职业基金经理"，是**"持续 3-6 个月不爆仓 + 月化 5-15%"** — 现实主义生存目标
- **Self-image**: "我不是赌徒，我是 risk-aware 的 trader" — 高度抗拒被定位为投机者

**Trigger event**:
> 凌晨 3 点睡着时 BTC 闪崩 6%，醒来发现仓位被强平。打开 X 看到有人 4 小时前发"funding 异常 + 大户撤单"的截图。第一反应：**"为什么没人在事前推送给我？"**

### 1.2 次受众（secondary, 25% 内容资源）

**Cold-email-actionable 描述**：
> 在中心化所现货持有 0.5-10 BTC、并通过 Cobo Wallet / OKX Wallet / Phantom 跟单链上聪明钱的"半主动"投资者。账户规模 $30k-$500k，每月链上交互 5-30 次，关注 Nansen Free / Arkham / DeBank 但**付费率低**（觉得太机构化）。

**Firmographic**: 加密"中长线 + 链上跟单"混合玩家；0.5-10 BTC + 链上 alt 头寸；35% 北美 + 30% 亚太 + 25% 欧洲；中位年龄 33。

**Psychographic**:
- Belief: "我不交易短线，但我跟链上聪明钱可以跑赢 BTC 现货持有"
- Fear: **"我跟单的钱包其实是 KOL 表演给散户看的诱饵"**
- Aspiration: 在不增加日内决策负担的前提下，年化跑赢 BTC 30-80%

**Trigger event**:
> 看到某 X KOL 截图"某鲸鱼地址 24 小时买入 800 万美元 PEPE，一周内 2x"。打开 Nansen 想验证，发现免费版看不到该地址；Arkham 上数据延迟 6 小时；DeBank 不显示链上事件流。第一反应：**"有没有一个工具直接告诉我'值得跟的钱包' + '正在做什么'？"**

### 1.3 排除受众（explicitly NOT for, 5%）

**明确不服务**：
1. **纯 BTC HODLer / 老钱白领** — 买 Glassnode 已经够用
2. **机构 / 基金交易员** — 已有 Bloomberg + Glassnode Studio + Kaiko
3. **Memecoin 猎人 / sol sniper** — 不交易 BTC
4. **完全新手 / 第一次买币的人** — 需要的是 onboarding 教育
5. **DeFi 收益农民** — 关注 APR / IL，不关注 BTC 价格 risk

**为什么明确排除很重要**：在 landing / 内容里**主动说**"如果你只是 BTC 长持，不需要这个产品"反而提升主受众的认同感 — "他懂我" vs "他在卖给所有人"。

---

## 二、Top 5 痛点（ranked by economic cost）

| # | 痛点 | 现状 cope 方式 | 年成本 / 时间 / 风险 | 数据出处 |
|---|---|---|---|---|
| **1** | **被 liquidation cascade 强平**（睡觉 / 上班时 BTC 闪崩 5-10%） | TradingView alert（无 OI/funding 维度）+ Telegram 群（延迟 5-30 分钟） | **单次清算损失 $2k-$30k**，年均 1-3 次 → **年化 $5k-$60k**；每天 30-90 分钟刷盘 | `[CIA Reddit 待跑]` |
| **2** | **Funding rate 隐性吃利**（持长仓多日 funding 累计 0.45%/天 → 月化 -13.5%） | Coinglass 看 funding 历史（事后），无前瞻预警 | **被动支付 funding 月均 $300-$5k** → **年化 $3.6k-$60k**；多数玩家**完全没意识到** | `[CIA App Reviews 待跑]` |
| **3** | **跟错"假聪明钱"** — 跟某 X KOL 截图的鲸鱼地址，被诱多 | 看 KOL Twitter + Nansen Free + 朋友群分享 | **单次跟错损失 $500-$10k**，年均 3-8 次 → **年化 $1.5k-$80k**；情绪成本极高 | `[CIA Reddit 待跑]` |
| **4** | **信息过载 + 决策疲劳** — 关注 50-200 个 X 账号 + 5-10 个 Telegram | 自建 X List + 关闭通知（漏信号）/ 不关闭（burnout） | **每周 14-28 小时** → 年化 $20k-$40k 隐性成本 | `[CIA Reddit 待跑]` |
| **5** | **Cycle top / bottom 误判** | Plan B S2F / Glassnode MVRV / KOL "顶部信号 in 3 weeks" | **单次大错损失 30-60% 账户**；2024-2025 周期内每个玩家 1-2 次 | `[CIA App Reviews 待跑]` |

**关键观察**：
- 痛点 1+2 合并年损失 = $8k-$120k，是最高优先级
- 痛点 3 是**情绪痛**比经济痛更强，是 viral content 的最佳 hook
- 痛点 4 是 BTCMind 的差异化机会 — "我替你做信息蒸馏"
- 痛点 5 是低频高烈度 — 适合做付费转化 hook，不适合日常 retention

---

## 三、Buying Triggers（5 个 EVENTS）

| Trigger event | Predicted prevalence | What they Google/ask after |
|---|---|---|
| **T1: 刚被强平** — 凌晨 BTC -7% cascade | **每 cycle 高峰期月发生 50k-200k 次** | "btc liquidation prevention", "stop loss vs liquidation", "btc cascade warning tool" |
| **T2: 鲸鱼大额转账新闻** | **每月 5-15 次**头条事件 | "is btc going to dump", "btc whale tracker realtime", "nansen alternative" |
| **T3: Funding rate 异常** | **每月 3-8 次显著异常** | "btc funding rate explained", "high funding rate meaning", "funding alert tool" |
| **T4: "周期顶部"warning** | **每 cycle peak 区间月 10-30 次** | "is btc at the top", "btc cycle top indicator", "should i sell my btc now" |
| **T5: 跟单 KOL 喊单亏损** | **每月 5-15 次破防事件** | "is x signal group scam", "best legit crypto alerts", "follow smart money crypto" |

---

## 四、Top 3 Objections + 最强 Counter

| Objection | Counter |
|---|---|
| **O1: "又一个加密信号产品，肯定是骗子"** | 我们不发交易信号，不喊单，不收成功费 — 我们只在你的头寸面临 OI/funding/聪明钱风险时**推送数据**，决策权 100% 在你手里；track record 链上公开可验证。 |
| **O2: "Coinglass + TradingView 已经够用了"** | Coinglass 给你**事后图表**，TradingView 给你**价格 alert** — 都是被动工具。BTCMind 是**主动 risk 推送**：funding 异常 + 大额清算簇 + 鲸鱼链上转账 + 你自己仓位的爆仓距离，三件事在 30 秒内同步推到你手机。 |
| **O3: "我自己看链上 + Twitter 就能判断"** | 你能看，问题是你**何时**看 — 你工作 8 小时 + 睡觉 8 小时 = 16 小时盲区；BTCMind 不取代你的判断，只确保你的盲区有自动化的 backup 眼睛；如果 24 小时没事发生，我们一条通知都不发。 |

---

## 五、Vocabulary Audit

> 11 GTM Agents 写文案的**唯一权威词表**。run-agent.py 加载本 brief 时严格按此执行。

### 5.1 词汇他们用

**Tier 1 (always)**:
`rekt` / `liq'd` / `liquidated` / `funding` / `OI` / `cascade` / `wick` / `wicked out` / `long` / `short` / `lev` / `perp` / `stop hunt` / `liquidity grab` / `whale` / `smart money` / `degen` / `cope` / `printing`

**Tier 2 (often)**:
`bart` / `paper hands` / `diamond hands` / `bagholder` / `fade` / `send it` / `manipulation` / `based` / `alpha` / `bull trap` / `bear trap` / `chop` / `dump` / `pump` / `top signal` / `bottom signal` / `risk-on` / `risk-off`

**中文对应**:
`爆仓` / `穿仓` / `合约` / `永续` / `插针` / `资金费率` / `多/空` / `杠杆` / `鲸鱼` / `庄` / `止盈/止损` / `连环爆仓` / `画饼` / `镰刀` / `老韭菜` / `小韭菜` / `操盘手` / `踏空` / `追高` / `抄底`

### 5.2 词汇他们不用（避雷）

**绝对不用**：
- `signals` / `crypto signals` / `trading signals` — **被诈骗污染**，r/CryptoCurrency 直接 ban
- `AI-driven` / `AI-powered` / `machine learning` — 营销话术
- `algorithm` / `algorithmic trading` — 听起来像高频量化
- `revolutionize` / `cutting-edge` / `state-of-the-art`
- `investment advice` / `financial advice` — 法律敏感
- `passive income` / `make money while you sleep` — 诈骗号通用
- `guaranteed returns` / `risk-free`
- `moon` / `🚀🚀🚀` / `wagmi` — 2021 cringe
- `professional traders use this` — 散户讨厌被暗示自己不专业
- `our proprietary technology` / `holistic` / `synergy`

**慎用**: `prediction`（用 "what the data shows"）/ `accuracy`（仅在有公开 track record）/ `automated`（"automated alerts" OK，"automated trading" 法律敏感）

### 5.3 触发情绪词

| Pain phrase | Relief phrase |
|---|---|
| "I got liq'd in my sleep again" | "Your liquidation distance + funding + whale flow, pushed before you crash" |
| "Funding is bleeding me dry" | "Know the next 8 hours' funding before you hold" |
| "Followed a whale wallet, got dumped on" | "We tag wallets that lead retail in vs wallets that exit on retail" |
| "Too much info, missing the real signal" | "If nothing's wrong in 24h, you hear nothing from us" |
| "Should've sold the top, missed by 8%" | "Cycle exit checklist, not predictions" |
| "我睡一觉就爆仓了" | "你在睡觉，BTCMind 在看你的爆仓距离" |
| "funding 慢慢吸血" | "未来 8 小时 funding 走势提前知道" |
| "跟错聪明钱被收割" | "我们标记'引诱散户进场的钱包' vs '在散户进场时撤退的钱包'" |
| "信息太多了" | "24 小时没事发生，我们一条都不发" |
| "顶部没跑出来" | "周期退出 checklist，不是预测" |

---

## 六、Channel × Trigger 映射

| Trigger | First search platform | Discovery channels | Decision channels |
|---|---|---|---|
| **T1: 刚被强平** | Google + Reddit (r/Bybit, r/binance) | Reddit threads, X "rekt confessions", YouTube 短视频 | Twitter DM, Reddit comment 链接, Telegram |
| **T2: 鲸鱼转账新闻** | X (real-time), Coinglass, Arkham | X 实时, Telegram 链上 bot, CoinDesk | X KOL 评测, Reddit "is X tool legit" |
| **T3: Funding 异常** | Coinglass, TradingView | X funding watch, Telegram funding alert bot | 朋友介绍, X 评测 |
| **T4: 周期顶部 warning** | YouTube, X | Bankless / Real Vision, X long thread, Substack | Newsletter 订阅, X follow |
| **T5: 跟单 KOL 亏损** | Reddit, Google | Reddit threads, BitcoinTalk, Trustpilot | Reddit upvote, YouTube 长篇负面 review |

**对 Step 4 (Content Strategy) 的指令**：
- **03-x Agent**：T1 + T2 + T3 主战场 — 实时性 + 短文案 + 数据截图
- **06-reddit Agent**：T1 + T5 主战场 — 长篇 transparent + 反诈骗品牌
- **09-tiktok Agent**：T1 + T4 — 被 liq'd 故事 + cycle top 焦虑
- **11-seo Agent**：T1 + T3 long-tail 教育型
- **02-podcast Agent**：T4 长形式（与 Checkmate / Will Clemente 互动）
- **05-newsletter Agent**：T2 + T4 周期型
- **04-linkedin Agent**：基本不发力（仅用于 founder 个人品牌）
- **08-youtube Agent**：长形式 cycle thesis + 链上数据 walkthrough

---

## 七、Top 3 用户访谈问题

> Hunter，本周找 5 个真实 BTC perp trader（Twitter DM 捞人，给 $20 amazon gift card），15 分钟访谈：

**Q1（验证 ICP + 痛点 1）**:
"上一次你被 liquidate 是什么时候？当时清醒还是睡着？事后你装了什么新工具，改了什么习惯？如果当时有手机推送告诉你'30 分钟内你的 long 仓位面临 cascade 风险'，你愿意付多少钱/月？"

**Q2（验证 vocabulary）**:
"如果一个工具叫 'BTC 信号助手' vs 'BTC 风险助手' vs 'BTC 链上预警'，你先点哪个？为什么？你最反感的加密产品宣传是什么？"

**Q3（验证 channel）**:
"过去 3 个月装的最后一个加密 app 是什么？怎么知道的 — Twitter / Reddit / 朋友 / Google？从听说到实际用隔了多久？什么因素让你决定试用？"

**Founder 决策点**：5 人访谈中 ≥ 3 人对 Q1 付费意愿 ≥ $20/月 + ≥ 4 人对 Q2 选 "风险助手" → 本 brief 一阶验证通过；否则先 reset positioning。

---

## 八、对 Step 1 假设的回看

| Step 1 假设 | Step 2 用户层面证据 | 是否调整 Step 1 |
|---|---|---|
| 散户为"BTC 信号"付费意愿低 | ✅ 强支持 — 但**为"BTC 风险预警"付费意愿可能高得多**（痛点 1+2 年损失 $8k-$120k vs 月费 $20-50） | **不调整**，加强 |
| L4 (BTC 宏观情报) TAM 小 | ⚠️ **部分反驳** — 真实 ICP 在 **L8 (perp 风险) ∩ L1 (聪明钱跟单)** 交集，几乎无 incumbent | **调整** — Step 1 应改为 "L8 ∩ L1" 是 BTCMind 真实蓝海 |
| "AI" 不应是 wedge | ✅ 强支持 — 进入 5.2 避雷词 | **不调整** |
| "BTCMind" 品牌名好 | ✅ "Mind" 暗示同伴感，与 "co-pilot" 匹配 | **不调整** |
| 目标 = "加密散户"统一画像 | ❌ **重大反驳** — 切成 5 segment，只有 perp trader + 链上跟单者是 ICP | **必须调整** — audience.primary 收紧 |
| 6 个月 cycle top window 关键 | ✅ 痛点 5 + T4 在 cycle peak 高频 | **不调整** |
| 散户决策路径短 / 冲动 | ⚠️ **部分反驳** — perp trader 决策有 paranoia 期，2-4 周 + 多 trigger 累积 | **调整** — 销售模型改为"trigger event-driven retention funnel" |

**对 project.yaml 的更新建议**:
```yaml
audience:
  primary: BTC 永续合约 trader（账户 $5k-$200k，5-20x 杠杆，亚太+LATAM 重心）
  secondary: 链上聪明钱跟单者（0.5-10 BTC 现货 + 主动链上交互）
  excluded: 纯 BTC HODLer / 机构 / memecoin 猎人 / 完全新手 / DeFi farmer
positioning:
  one_liner: "BTC Risk Co-pilot — 你的爆仓距离、funding 走势、聪明钱动向，30 秒推到你手机"
  category_redefine: 不是 "AI signals"，是 "Risk co-pilot"
```

---

## 九、Data Gaps

### 9.1 App Reviews（**最高优先级，$5-20**）
DataForSEO Reviews API 抓取近 12 个月：
| Competitor | App ID | 验证 |
|---|---|---|
| **Coinglass** | iOS `id1505863365`, Android `com.coinglass.app` | "funding alert 缺失" "push 通知频次" |
| **Bybit** | iOS `id1488296980` | "内置 risk 工具不满" "希望第三方插件" |
| **Hyblock Capital** | Trustpilot + G2 | "$50-200/月用户痛点 vs 价值" |

### 9.2 Reddit 深挖（**$10-30**）
Apify scraper 近 6 个月：
| Subreddit | 关键词 | 验证 |
|---|---|---|
| r/Bybit | "liquidat", "rekt", "funding", "cascade" | T1 + 痛点 1+2 频率 |
| r/binance | "perp", "leverage", "stop hunt" | 主受众 + 词汇 |
| r/CryptoMarkets | "whale", "smart money", "manipulation" | T2 + 痛点 3 |
| r/CryptoCurrency | "signal scam", "ai trading bot" | T5 + 5.2 避雷验证 |
| r/BitcoinMarkets | "cycle top", "exit", "sell btc" | T4 + 痛点 5 |

### 9.3 X 抓取（**$20-50**）
@CoinGlass_news, @hyblock_capital, @WClementeIII, @cryptoquant_com 评论区"我希望它能..."

### 9.4 TikTok hook patterns（**$10**）
hashtag #cryptotrading #bitcoinperp #liquidated 头部 100 视频前 3 秒 hook 模式

### 9.5 决策建议
- **最小投入**：只跑 9.1 ($20)，confidence +50%
- **完整 CIA**：9.1 + 9.2 + 9.3 ($50-100)，confidence +80%
- **跳过**：所有 brief 标 `[LLM 推理 - 建议 CIA 实证]`，需要更多 founder 直觉

---

## 十、Key Assumptions（5 个 invalidation 条件）

1. **BTC perp trader 是真实可触达 ICP，全球 ≥ 50 万付费意愿用户**
   - **Invalidation**: r/Bybit + r/binance 月活合计 < 100k，或 X "BTC perp" high-engagement < 月 5k 条
   - **观察窗口**: 30 天

2. **"风险" 心智 vs "信号" 心智胜出 ≥ 70%**
   - **Invalidation**: Q2 访谈 + landing A/B 中 "风险助手" CVR < "信号助手" × 1.3
   - **观察窗口**: 60 天

3. **痛点 1+2 付费意愿 ≥ $20/月**
   - **Invalidation**: Q1 访谈 ≤ 2/5 人愿付，或 free → paid 转化 < 1.5% 持续 3 个月
   - **观察窗口**: 90 天

4. **5.1 / 5.2 词汇模型在内容测试中验证**
   - **Invalidation**: 使用 5.2 避雷词 ("AI-driven", "signals") 的测试帖 engagement 反高于 5.1 native 词汇
   - **观察窗口**: 14 天（10 个对比帖）

5. **Trigger event-driven funnel > push marketing**
   - **Invalidation**: 90 天内 cold outreach (DM / email) CVR > trigger-event natural search CVR
   - **观察窗口**: 90 天

---

> 本 User Insight brief 完成于 2026-05-10。下一步：Step 3 (Competitor Analysis) 将基于本 brief 选定的 ICP，针对 Coinglass / Hyblock / Nansen / Arkham / 头部 TG 信号群做 wedge-level 对标，输出 BTCMind 的差异化 positioning canvas + GTM playbook。