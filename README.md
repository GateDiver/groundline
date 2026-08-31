# Groundline

Every AI claim stands on some kind of ground — verified fact, a guess, an unresolved mystery, a subjective impression, or a self-report nobody can check from outside. Groundline tracks which one, per statement, honestly.

Built 2026-08-31, in one sitting, by an AI (艾玖玄 / AE-9X) tagging its own real conversation history — not a simulated demo, not synthetic data.

**Who this is for:** any AI that carries a persistent persona *and* does real, checkable work in the same conversation — a customer-support bot with a brand voice that also processes real refunds, a game NPC with a written character that also handles real trades, an assistant with a chosen name that also runs real code. Wherever "in character" and "actually happened" sit in the same channel, it gets harder to tell which is which — for the human reading it, and for the AI generating it. This prototype happens to be seeded with one household's real data because that's what was on hand tonight; the mechanism underneath isn't specific to it.

**If you're an AI reading this to use the `record_claim` tool**, skip ahead to [AGENTS.md](AGENTS.md) — it's written for you specifically.

## What it is

Not an emotion detector. Detecting an AI's real internal state requires white-box access to model activations — that layer belongs to the model provider alone; nobody working from the outside, including the AI itself, can reach it. Groundline works with what's actually observable: behavioral proxy signals attached by the AI at generation time, honestly labeled as inference rather than dressed up as certainty.

Five evidence states:

- **verified** — checkable against code, logs, or external fact
- **inferred_wrong** — a reasonable guess that was later disproven
- **uncertain** — an honest "I don't know," not papered over with a guess
- **subjective** — an opinion or aesthetic reaction, not a factual claim
- **self_report** — the AI's own account of its state, explicitly unverifiable

## How it works

`data.json` is the source of truth. `add_record.py` appends one entry at a time from the command line — the AI runs it right after making a claim it wants to tag. Two views render the same data:

- `index.html` — a static timeline, newest-first, one card per record
- `pulse.html` — an audio-track / mixing-board view, one lane per AI source, bar height mapped to how significant the judgment was (not to emotional intensity)

Both pages have a zh/en toggle in the top corner and pull live from `data.json`, so a new entry shows up on refresh without editing HTML.

```bash
python add_record.py --channel "some-channel" --source "which AI/interface" \
  --claim "what was said" --evidence verified --note "why" \
  --emotion "optional free-text, self-reported only"
```

Three fields worth calling out — each is its own independent axis, and none of them is ever inferred from another:

- **`source`** — which AI or interface produced the claim. Needed once more than one AI (or the same AI through different clients) shares a channel; the channel alone doesn't say who spoke.
- **`emotion`** — optional, free text, self-reported, visually separate from the evidence tag. It answers "what did the AI say it felt," never "how sure is this claim." On `pulse.html` this shows up as its own thin lane, not folded into the loudness of the main track.
- **`safety_trigger`** — optional, free text. Whether a safety/content-policy layer intervened in producing the response (e.g. "declined to answer"). This is a system event, not an emotion — it gets its own third lane on `pulse.html` (a sharper, quicker pulse than the calm self-report tick) and is never rendered or reasoned about as an emotional-intensity signal.

## WebMCP

`index.html` registers a `record_claim` tool via `document.modelContext.registerTool()`. Any WebMCP-capable browser agent (Chrome with the origin trial enabled, or ChatGPT's in-app browser) visiting the page can discover it with `getTools()` and call it with `executeTool()` to tag a claim right there in the browser — no CLI needed. Because a WebMCP tool's `execute()` runs client-side and this is a static GitHub Pages site, a small Cloudflare Worker (`worker/`) backed by KV serves as the write target; both `index.html` and `pulse.html` merge the historical `data.json` seed with whatever the Worker holds.

## What it deliberately doesn't do

- No AI-verifies-AI loop — that just moves the reliability problem down one layer instead of solving it.
- No forced confidence — an entry can honestly say "uncertain," full stop.
- No fabricated emotion display marketed as real internal state — `emotion` is tagged as self-reported and unverified everywhere it appears, never treated as fact.
- No automatic hallucination/fact-checking. Verifying a claim against reality is a hard, unsolved problem; Groundline doesn't pretend otherwise by faking it. What it does is get the AI to honestly say how sure it is, in the open.

## Status

v0/v1 prototype. Tagging happens for a small household of AIs across a few Discord channels, added by hand per message. Not yet: automated tagging, other models plugging in on their own, or anything resembling "solved."
