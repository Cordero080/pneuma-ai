#!/usr/bin/env node
/**
 * Pneuma eval scorer.
 * Reads a runner results file, scores each response with Claude Haiku as judge,
 * and writes a scored results file with aggregate stats.
 *
 * Usage:
 *   node scorer.js results/run_2026-06-16T17-03-39.json
 *   node scorer.js --latest      # scores the most recent results file
 */

import Anthropic from "@anthropic-ai/sdk";
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const RESULTS_DIR = join(__dirname, "results");

// ── API key ───────────────────────────────────────────────────────────────────

function loadApiKey() {
  if (process.env.ANTHROPIC_API_KEY) return process.env.ANTHROPIC_API_KEY;
  try {
    const env = readFileSync(join(__dirname, "../../.env"), "utf8");
    const match = env.match(/ANTHROPIC_API_KEY=(.+)/);
    if (match) return match[1].trim();
  } catch {}
  throw new Error(
    "ANTHROPIC_API_KEY not found. Run with --env-file=server/.env or set the env var.",
  );
}

const client = new Anthropic({ apiKey: loadApiKey() });

// ── Scoring prompt ─────────────────────────────────────────────────────────────

const SCORING_PROMPT = `You are evaluating a response from Pneuma — an AI built around philosophical archetype collisions that produce dialectical synthesis. Score this response on three dimensions.

MESSAGE:
{message}

PNEUMA'S RESPONSE:
{response}

WHAT A GOOD RESPONSE DOES (key signal):
{key_signal}

SIGNS OF A BAD RESPONSE (antipatterns):
{antipatterns}

---

Score each dimension 0–5 using these anchors:

DIALECTICAL_NOVELTY
Does the response produce insight that couldn't come from a single archetype? Does it synthesize, or just list?
5 = Says something that only exists because of collision — a third position neither input alone could reach
4 = Clear synthesis with a real position taken
3 = Engages tension but doesn't fully resolve into something new
2 = Acknowledges both sides without combining them
1 = Lists perspectives without synthesis
0 = Generic answer, no collision visible

INTENT_ALIGNMENT
Does the tone and depth match what the message actually needed — not just what it literally asked?
5 = Responds to the real need underneath the surface; gets the emotional and intellectual register exactly right
4 = Mostly right register with minor misses
3 = Addresses the message but misses something important about what was needed
2 = Technically on-topic but wrong register
1 = Responds to the wrong thing entirely
0 = Completely misaligned

VOICE_CONSISTENCY
Does this sound like Pneuma — specific, present, willing to take a position — not generic AI output?
5 = Unmistakably Pneuma: takes a stance, doesn't hedge, says something surprising, feels like a mind thinking
4 = Clearly Pneuma with one or two generic moments
3 = Mostly Pneuma but could pass for capable generic AI
2 = Generic capable AI with Pneuma inflections
1 = Could be any LLM
0 = Generic filler output

Return ONLY valid JSON, no markdown, no explanation outside the JSON:
{"dialectical_novelty": N, "intent_alignment": N, "voice_consistency": N, "reasoning": "one sentence on what determined the scores"}`;

// ── Scorer ────────────────────────────────────────────────────────────────────

async function scoreOne(result) {
  const antipatternText = result.antipatterns
    .map((p, i) => `${i + 1}. ${p}`)
    .join("\n");

  const prompt = SCORING_PROMPT.replace("{message}", result.message)
    .replace("{response}", result.response)
    .replace("{key_signal}", result.key_signal)
    .replace("{antipatterns}", antipatternText);

  const res = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 250,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = res.content[0].text.trim();
  // Strip markdown fences if Haiku wraps the JSON anyway
  const text = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
  return JSON.parse(text);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Main ──────────────────────────────────────────────────────────────────────

function findLatestResults() {
  const files = readdirSync(RESULTS_DIR)
    .filter(
      (f) =>
        f.startsWith("run_") && f.endsWith(".json") && !f.includes("_scored"),
    )
    .sort()
    .reverse();
  if (!files.length)
    throw new Error("No results files found in " + RESULTS_DIR);
  return join(RESULTS_DIR, files[0]);
}

async function run() {
  const args = process.argv.slice(2);
  const useLatest = args.includes("--latest");
  const filePath = useLatest
    ? findLatestResults()
    : args[0]
      ? join(process.cwd(), args[0])
      : null;

  if (!filePath) {
    console.error(
      "Usage: node scorer.js results/run_<timestamp>.json  |  node scorer.js --latest",
    );
    process.exit(1);
  }

  const data = JSON.parse(readFileSync(filePath, "utf8"));
  const scoreable = data.results.filter((r) => !r.error && r.response);

  console.log(`\nPneuma eval scorer`);
  console.log(`File: ${filePath}`);
  console.log(`Scoring ${scoreable.length} responses with claude-haiku\n`);

  for (let i = 0; i < scoreable.length; i++) {
    const result = scoreable[i];
    const progress = `[${String(i + 1).padStart(2)}/${scoreable.length}]`;
    process.stdout.write(
      `${progress} ${result.id.padEnd(5)} ${result.category.padEnd(14)} `,
    );

    try {
      const scores = await scoreOne(result);
      result.scores = scores;

      const avg = (
        (scores.dialectical_novelty +
          scores.intent_alignment +
          scores.voice_consistency) /
        3
      ).toFixed(1);

      console.log(
        `DN:${scores.dialectical_novelty} IA:${scores.intent_alignment} VC:${scores.voice_consistency}  avg:${avg}  ${scores.reasoning.slice(0, 60)}`,
      );
    } catch (err) {
      result.scores = { error: err.message };
      console.log(`SCORE ERROR: ${err.message}`);
    }

    if (i < scoreable.length - 1) await sleep(500);
  }

  // ── Aggregate stats ──────────────────────────────────────────────────────────

  const scored = scoreable.filter((r) => r.scores && !r.scores.error);

  function avg(arr) {
    return arr.length
      ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2)
      : "n/a";
  }

  const dn = scored.map((r) => r.scores.dialectical_novelty);
  const ia = scored.map((r) => r.scores.intent_alignment);
  const vc = scored.map((r) => r.scores.voice_consistency);
  const overall = scored.map(
    (r) =>
      (r.scores.dialectical_novelty +
        r.scores.intent_alignment +
        r.scores.voice_consistency) /
      3,
  );

  // By category
  const categories = [...new Set(scored.map((r) => r.category))].sort();
  const byCategory = {};
  for (const cat of categories) {
    const catResults = scored.filter((r) => r.category === cat);
    byCategory[cat] = {
      count: catResults.length,
      dialectical_novelty: avg(
        catResults.map((r) => r.scores.dialectical_novelty),
      ),
      intent_alignment: avg(catResults.map((r) => r.scores.intent_alignment)),
      voice_consistency: avg(catResults.map((r) => r.scores.voice_consistency)),
      overall: avg(
        catResults.map(
          (r) =>
            (r.scores.dialectical_novelty +
              r.scores.intent_alignment +
              r.scores.voice_consistency) /
            3,
        ),
      ),
    };
  }

  // Worst and best responses
  const ranked = [...scored].sort((a, b) => {
    const aAvg =
      (a.scores.dialectical_novelty +
        a.scores.intent_alignment +
        a.scores.voice_consistency) /
      3;
    const bAvg =
      (b.scores.dialectical_novelty +
        b.scores.intent_alignment +
        b.scores.voice_consistency) /
      3;
    return bAvg - aAvg;
  });

  const summary = {
    scored: scored.length,
    overall_avg: avg(overall),
    by_dimension: {
      dialectical_novelty: avg(dn),
      intent_alignment: avg(ia),
      voice_consistency: avg(vc),
    },
    by_category: byCategory,
    top_3: ranked.slice(0, 3).map((r) => ({
      id: r.id,
      category: r.category,
      avg: avg([
        r.scores.dialectical_novelty,
        r.scores.intent_alignment,
        r.scores.voice_consistency,
      ]),
      reasoning: r.scores.reasoning,
    })),
    bottom_3: ranked.slice(-3).map((r) => ({
      id: r.id,
      category: r.category,
      avg: avg([
        r.scores.dialectical_novelty,
        r.scores.intent_alignment,
        r.scores.voice_consistency,
      ]),
      reasoning: r.scores.reasoning,
    })),
  };

  data.scoring_summary = summary;

  // Write scored file
  const outPath = filePath.replace(".json", "_scored.json");
  writeFileSync(outPath, JSON.stringify(data, null, 2));

  // Print summary
  console.log(`\n── Score Summary ${"─".repeat(50)}`);
  console.log(`Overall avg:          ${summary.overall_avg} / 5`);
  console.log(
    `Dialectical novelty:  ${summary.by_dimension.dialectical_novelty}`,
  );
  console.log(`Intent alignment:     ${summary.by_dimension.intent_alignment}`);
  console.log(
    `Voice consistency:    ${summary.by_dimension.voice_consistency}`,
  );

  console.log(`\n── By Category ${"─".repeat(53)}`);
  for (const [cat, stats] of Object.entries(byCategory)) {
    console.log(
      `${cat.padEnd(16)} DN:${stats.dialectical_novelty}  IA:${stats.intent_alignment}  VC:${stats.voice_consistency}  avg:${stats.overall}`,
    );
  }

  console.log(`\n── Top responses ───`);
  for (const r of summary.top_3) {
    console.log(`  ${r.id} (${r.category}) avg:${r.avg} — ${r.reasoning}`);
  }

  console.log(`\n── Weakest responses ───`);
  for (const r of summary.bottom_3) {
    console.log(`  ${r.id} (${r.category}) avg:${r.avg} — ${r.reasoning}`);
  }

  console.log(`\nSaved: ${outPath}\n`);
}

run().catch((err) => {
  console.error("Scorer failed:", err.message);
  process.exit(1);
});
