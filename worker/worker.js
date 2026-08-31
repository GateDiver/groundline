/**
 * Groundline live WebMCP backend.
 * Accepts new records from the record_claim WebMCP tool registered in
 * index.html/pulse.html and stores them in KV. data.json in the repo stays
 * the historical seed; this worker holds everything submitted live.
 */

const VALID_EVIDENCE = new Set(["verified", "inferred_wrong", "uncertain", "subjective", "self_report"]);
const RECORDS_KEY = "live_records";
const MAX_RECORDS = 500;

function cors(resp) {
  resp.headers.set("Access-Control-Allow-Origin", "*");
  resp.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  resp.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return resp;
}

async function readRecords(env) {
  const raw = await env.GROUNDLINE_KV.get(RECORDS_KEY);
  return raw ? JSON.parse(raw) : [];
}

async function writeRecords(env, records) {
  await env.GROUNDLINE_KV.put(RECORDS_KEY, JSON.stringify(records.slice(-MAX_RECORDS)));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return cors(new Response(null, { status: 204 }));
    }

    if (url.pathname === "/records" && request.method === "GET") {
      const records = await readRecords(env);
      return cors(Response.json({ records }));
    }

    if (url.pathname === "/records" && request.method === "POST") {
      let body;
      try {
        body = await request.json();
      } catch {
        return cors(Response.json({ error: "invalid JSON body" }, { status: 400 }));
      }

      const { channel, source, claim, evidence, note, emotion } = body;

      if (!channel || typeof channel !== "string") {
        return cors(Response.json({ error: "channel is required" }, { status: 400 }));
      }
      if (!claim || typeof claim !== "string") {
        return cors(Response.json({ error: "claim is required" }, { status: 400 }));
      }
      if (!VALID_EVIDENCE.has(evidence)) {
        return cors(Response.json({
          error: `evidence must be one of: ${[...VALID_EVIDENCE].join(", ")}`
        }, { status: 400 }));
      }

      const record = {
        ts: new Date().toISOString(),
        message_id: "",
        channel,
        source: (typeof source === "string" && source.trim()) || "unknown (via WebMCP)",
        claim,
        evidence,
        note: typeof note === "string" ? note : "",
      };
      if (typeof emotion === "string" && emotion.trim()) {
        record.emotion = emotion.trim();
      }

      const records = await readRecords(env);
      records.push(record);
      await writeRecords(env, records);

      return cors(Response.json({ ok: true, record }));
    }

    return cors(new Response("Not found", { status: 404 }));
  }
};
