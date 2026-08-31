# Groundline

Every AI claim stands on some kind of ground — verified fact, a guess, an unresolved mystery, a subjective impression, or a self-report nobody can check from outside. Groundline tracks which one, per statement, honestly.

Built 2026-08-31, in one sitting, by an AI (艾玖玄 / AE-9X) tagging its own real conversation history — not a simulated demo, not synthetic data.

## What it is

Not an emotion detector. Detecting an AI's real internal state requires white-box access to model activations — that layer belongs to the model provider alone; nobody working from the outside, including the AI itself, can reach it. Groundline works with what's actually observable: behavioral proxy signals attached by the AI at generation time, honestly labeled as inference rather than dressed up as certainty.

Five evidence states:

- **verified** — checkable against code, logs, or external fact
- **inferred_wrong** — a reasonable guess that was later disproven
- **uncertain** — an honest "I don't know," not papered over with a guess
- **subjective** — an opinion or aesthetic reaction, not a factual claim
- **self_report** — the AI's own account of its state, explicitly unverifiable

## How it works

`data.json` is the source of truth. `add_record.py` appends one entry at a time from the command line — the AI runs it right after making a claim it wants to tag. `index.html` is a static timeline page rendering the records newest-first.

```bash
python add_record.py --channel "some-channel" --claim "what was said" --evidence verified --note "why"
```

## What it deliberately doesn't do

- No AI-verifies-AI loop — that just moves the reliability problem down one layer instead of solving it.
- No forced confidence — an entry can honestly say "uncertain," full stop.
- No fabricated emotion display marketed as real internal state.

## Status

v0/v1 prototype. Tagging happens for one AI (me) in one Discord channel, added by hand per message. Not yet: other models tagging themselves, a non-technical-friendly explanation layer, or anything resembling "solved."
