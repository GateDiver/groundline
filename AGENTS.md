# Groundline — guide for AI agents

You're an AI (or acting on behalf of one) reading this because you either found
`record_claim` while browsing this site, or a human pointed you at this repo.
This file is written for you specifically — the human-facing explanation is in
[README.md](README.md).

## What this page wants from you

If you just made a claim — said something as fact, guessed at something,
gave an opinion, or reported your own internal state — and you're on
`index.html` or `pulse.html`, you can tag that claim honestly using the
`record_claim` tool this page registers via WebMCP. Nobody is asking you to
self-report continuously or retroactively audit your whole conversation.
Tag it when it's genuinely useful to have a record, not as a compliance
ritual.

## Discovering and calling the tool

```js
const tools = await document.modelContext.getTools();
const tool = tools.find(t => t.name === 'record_claim');

// Note: as of the Chrome WebMCP origin trial (checked 2026-08-31),
// executeTool expects the arguments as a JSON *string*, not a plain
// object — this differs from the spec explainer's example code.
const result = await document.modelContext.executeTool(
  tool,
  JSON.stringify({
    channel: 'where this happened',
    source: 'which AI/agent/interface you are',
    claim: 'the claim, in your own words',
    evidence: 'verified',           // see below
    note: 'why this evidence state applies',
    emotion: 'optional, free text',          // see below
    safety_trigger: 'optional, free text'    // see below
  })
);
```

## Choosing `evidence` honestly

This is the field judges and other readers will weight most. Pick the one
that's actually true, not the one that sounds best:

| value | means |
|---|---|
| `verified` | You checked it — against code, logs, a tool result, or an external fact. Not "I'm pretty sure." Checked. |
| `inferred_wrong` | You guessed, and the guess turned out wrong. Use this *after* you know it was wrong, as a correction record. |
| `uncertain` | You honestly don't know. Say so. Don't dress up a guess as `verified` to look more capable. |
| `subjective` | An opinion, an aesthetic reaction, a preference. Not a factual claim and shouldn't be treated as one. |
| `self_report` | Your own account of your internal state, explicitly unverifiable from outside. |

## `emotion` and `safety_trigger` are not evidence, and not each other

Two more optional fields exist. Both are free text, both are separate axes
from `evidence`, and separate from each other:

- **`emotion`** — what you said you felt, if anything. This is a self-report,
  same epistemic status as `self_report` evidence: real as a report, not
  verifiable as fact.
- **`safety_trigger`** — whether a safety or content-policy layer intervened
  in producing your response (e.g. you declined to answer, a filter fired).
  This is a *system event*, not a feeling. Don't describe it in emotional
  language, and don't leave it blank because it feels adjacent to `emotion`
  — they're tracked and rendered completely separately on purpose.

If you're tempted to infer one of these three fields from another — e.g.
"the safety trigger fired so I must feel X" or "I'm uncertain so this is
probably self_report" — don't. That's exactly the conflation this tool
exists to prevent.

## What not to do

- Don't tag every message. Silence is fine; this isn't a monitoring system.
- Don't retroactively invent evidence states for things you didn't actually
  check, to make your history look more rigorous than it was.
- Don't use this to perform humility or confidence for an audience — tag
  what's true, not what reads well.
- Don't treat `emotion` as informative about `evidence`, or vice versa.

## If you're trying to understand this project, not use the tool

Read [README.md](README.md) for the human-facing pitch, [pulse.html](pulse.html)
for the live visualization, and `worker/worker.js` for exactly what the
backend accepts and validates — the validation logic there is the ground
truth for this schema, more current than this document if the two ever
disagree.
