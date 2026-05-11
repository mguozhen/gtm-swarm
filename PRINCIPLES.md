# GTM Agent Swarm — 5 Principles

Verbatim from Solvea Founder Mix Party deck (`~/Downloads/Founder_Mix_Party_—_Solvea_(PDF_Style).pdf`), section "GTM Agent Swarm · Building Principles".

## 01 · Execution Model — Agents Execute. Humans Manage Agents.

The fundamental shift: humans no longer do the work — **humans manage the agents that do the work**. Every GTM function is owned by an Agent, every Agent is owned by a human.

## 02 · Builder's Mission — Builder = Stable · Good · Long-Running

Builder makes agents run stable, run well, and run long. Reviewer manages and empowers agents to deliver business results. Each role is distinct — **never conflate building with reviewing**.

## 03 · Org Structure — The Iron Triangle: Agent + Builder + Reviewer

The minimum viable unit of a GTM Agent Swarm. **No triangle = no agent.** Every deployed agent must have all three roles assigned. This rule is enforced by `scripts/new-agent.sh` — agents with empty `builder` or `reviewer` fields in `agent.yaml` cannot be deployed.

## 04 · North Star — What You Sell Doesn't Matter. Traffic + Revenue Is the Only Goal.

The GTM Agent Swarm's job is to **build GTM capability at scale** — not to be tied to any single product or channel. Traffic-driven and revenue-oriented. The swarm adapts to whatever you need to sell.

## 05 · Content Strategy — Content Is King. Build Content That Spreads & Delivers Value.

Thin AI content is everywhere — **the differentiator is depth.** Build content with real research data, benchmarks, interactive demos, and multi-format distribution (blog → video → social). Virality comes from genuine user value.

---

## The Iron Triangle, in motion

```
Brief (Goal · Budget · KPI)
   ↓ brief
Builder (define · configure · iterate)
   ↓ ① create · equip
Agents (produce · invoke · run)
   ↓ ② submit
Reviewer (judge · edit · set standard)
   ↓ ③ approve
Output (Content · Ads · Outbound)

Memory + Taste (反馈沉淀 / feedback distilled)
   ↑ ④ feedback (from Reviewer)
   ↓ ⑤ recall · evolve (back to Builder)
```

Every agent must implement this 5-step loop and write each Reviewer feedback into `playbook.md` (Memory) and `anti-patterns.md` (Taste).

## Concrete rules

- **Builder writes** `agents/<n>/SKILL.md` and `agents/<n>/agent.yaml`.
- **Agent runs** `agents/<n>/runner.py|sh`, drops drafts into `agents/<n>/content-bank/draft/`.
- **Reviewer pulls queue** with `./scripts/review-queue.sh <name>`; approves move drafts to `bank/` then `published/`; rejects write to `agents/<n>/anti-patterns.md`.
- **Memory loop** — every Friday a reviewer scans the week's approvals and updates `agents/<n>/playbook.md` + the appropriate `engines/<brand>/engine/hooks.md`. This is Ronin's "weekly update hooks.md" rule and the deck's Memory + Taste flywheel — same thing.
- **Cross-product**: each draft carries a `product:` field (`solvea | voc-ai | cnapi | shulex-cn`). Runner reads `engines/<product>/` for that draft.
