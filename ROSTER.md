# GTM Agent Roster (11 Agents)

Verbatim Platform / Reviewer / Builder / Goal from deck "GTM Agent Swarm · Project Roster" slide.

Categories: 🟪 Foundation · 🟩 Content · 🟦 Distribution · 🟧 Revenue·Leads

| # | Agent | Platform | Reviewer | Builder | Goal | Reuse | Status |
|---|---|---|---|---|---|---|---|
| 01 | 🟪 GTM Foundation | Internal Dashboard | Boyuan | 钟石龙 | All agents connected. Execution monitoring, version mgmt, cost mgmt | `~/agent-teams` schema, this repo's dashboard | ✅ deployable |
| 02 | 🟦 KOL / KOC | YouTube · TikTok · Instagram | Ivy | 张基琳 | KOC outreach, publish XX videos/week by 5/30 | `~/MKT/TiktokAutoUploader` | ✅ deployable |
| 03 | 🟩 Blog | Official Website | 彭静 | 张基琳 | SEO blogs all product lines, monthly topic map | `~/solvea-content-engine` | ✅ deployable |
| 04 | 🟩 Backlink | Official Website | 彭静 | **TBD** | Quality backlinks, domain authority | greenfield | 🚫 blocked (no Builder) |
| 05 | 🟩 Video | YouTube · TikTok | 庄可欣 | 张基琳 | Auto-gen videos, Reviewer owns likes/views | `~/MKT` (ShortGPT/CosyVoice/MoneyPrinterTurbo) | ✅ deployable |
| 06 | 🟦 Reddit | Reddit | Ivy Chen | Wayne | Auto-publish at scale, inbound traffic | greenfield | ✅ **PILOT** |
| 07 | 🟦 Social Media | X · GitHub · LinkedIn | Ivy Chen | Wayne | Cross-platform native publishing, Ivy owns brand voice | `~/solvea-content-engine` platform rewrite + LinkedIn API memo | ✅ deployable |
| 08 | 🟧 Ads | Google · iOS · Android | **TBD** | 高博远 | App Store + Google Search, optimize CAC/conversion | `~/google-ads` (most mature reuse) | 🚫 blocked (no Reviewer) |
| 09 | 🟧 EDM | Email | **TBD** | **TBD** | Email pipeline, owned audience | `~/google-ads/dropin` + `crm/` | 🚫 blocked (double TBD) |
| 10 | 🟧 Yelp | Yelp | **TBD** | **TBD** | Auto-find leads from reviews/complaints | greenfield (295 TX leads pilot exists) | 🚫 blocked (double TBD) |
| 11 | 🟧 Poster | WeChat | **TBD** | **TBD** | WeChat 公众号 auto-publish | greenfield | 🚫 blocked (double TBD) |

## Deployment status (live count)

- ✅ Deployable: **6** (01 02 03 05 06 07)
- 🚫 TBD-blocked: **5** (04 08 09 10 11)
- Pilot: **06 Reddit**

## TBD slots — forcing function for hiring

Per Principle 3 (No Triangle = No Agent), the 5 blocked agents stay non-deployed until people are named:

- **04 Backlink** needs a **Builder**
- **08 Ads** needs a **Reviewer**
- **09 EDM** needs **both**
- **10 Yelp** needs **both**
- **11 Poster** needs **both**

Sum: 8 named slots to fill (3 Builders + 5 Reviewers).

## Per-agent products

Each draft tags `product: solvea | voc-ai | cnapi | shulex-cn`. Default per-agent product is in `agents/<n>/agent.yaml`.
