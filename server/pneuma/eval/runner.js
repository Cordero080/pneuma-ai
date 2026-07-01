#!/usr/bin/env node
/**
 * Pneuma eval runner.
 * Sends each test message to /chat, collects the SSE stream, and saves results.
 *
 * Usage:
 *   node runner.js                        # run all 35 messages
 *   node runner.js --ids=P01,E02,CF01     # run specific messages
 *   node runner.js --delay=3000           # 3s between requests (default: 2000)
 *   node runner.js --category=philosophical
 *
 * Output: server/pneuma/eval/results/run_<timestamp>.json
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CHAT_URL = "http://localhost:3001/chat";
const DATASET_PATH = join(__dirname, "test_dataset.json");
const RESULTS_DIR = join(__dirname, "results");

// ── CLI args ──────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const getArg = (flag) => {
  const hit = args.find((a) => a.startsWith(`--${flag}=`));
  return hit ? hit.split("=").slice(1).join("=") : null;
};

const filterIds = getArg("ids")?.split(",") ?? null;
const filterCategory = getArg("category") ?? null;
const delayMs = parseInt(getArg("delay") ?? "2000", 10);

// ── SSE fetch ─────────────────────────────────────────────────────────────────

async function chatRequest(message, sessionId, timeoutMs = 90_000) {
  const startTime = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let res;
  try {
    res = await fetch(CHAT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, sessionId }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  // Read full SSE body then parse line by line
  const raw = await res.text();
  let fullResponse = "";
  let mode = null;
  let engine = null;

  for (const line of raw.split("\n")) {
    if (!line.startsWith("data: ")) continue;
    try {
      const event = JSON.parse(line.slice(6));
      if (event.type === "chunk") fullResponse += event.text;
      if (event.type === "done") {
        mode = event.mode;
        engine = event.engine;
      }
    } catch {
      // malformed SSE line — skip
    }
  }

  return {
    response: fullResponse.trim(),
    mode,
    engine,
    duration_ms: Date.now() - startTime,
  };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Main ──────────────────────────────────────────────────────────────────────

async function run() {
  const dataset = JSON.parse(readFileSync(DATASET_PATH, "utf8"));
  let messages = dataset.messages;

  if (filterIds) {
    messages = messages.filter((m) => filterIds.includes(m.id));
  }
  if (filterCategory) {
    messages = messages.filter((m) => m.category === filterCategory);
  }

  if (messages.length === 0) {
    console.error("No messages matched the given filters.");
    process.exit(1);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const runId = `run_${timestamp}`;

  console.log(`\nPneuma eval runner — ${runId}`);
  console.log(`Messages: ${messages.length}  |  Delay: ${delayMs}ms\n`);

  mkdirSync(RESULTS_DIR, { recursive: true });

  const results = [];

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    const progress = `[${String(i + 1).padStart(2)}/${messages.length}]`;
    process.stdout.write(
      `${progress} ${msg.id.padEnd(5)} ${msg.category.padEnd(14)} `,
    );

    // Dot spinner so it's clear something is happening
    const spinner = setInterval(() => process.stdout.write("."), 3000);

    try {
      // Fresh session per message — eval should be independent of history
      const sessionId = `eval_${msg.id}_${Date.now()}`;
      const result = await chatRequest(msg.message, sessionId);
      clearInterval(spinner);

      const toneMatched =
        result.mode !== null && msg.expected_tones.includes(result.mode);

      results.push({
        id: msg.id,
        category: msg.category,
        difficulty: msg.difficulty,
        message: msg.message,
        response: result.response,
        mode: result.mode,
        engine: result.engine,
        duration_ms: result.duration_ms,
        expected_tones: msg.expected_tones,
        tone_matched: toneMatched,
        key_signal: msg.key_signal,
        antipatterns: msg.antipatterns,
        // placeholders — filled in by scorer.js
        scores: null,
      });

      const tone =
        result.mode === null
          ? "no tone"
          : toneMatched
            ? `✓ ${result.mode}`
            : `✗ ${result.mode} (expected: ${msg.expected_tones.join("/")})`;

      console.log(`${result.duration_ms}ms   ${tone}`);
    } catch (err) {
      clearInterval(spinner);
      console.log(`ERROR: ${err.message}`);
      results.push({
        id: msg.id,
        category: msg.category,
        message: msg.message,
        error: err.message,
        scores: null,
      });
    }

    if (i < messages.length - 1) await sleep(delayMs);
  }

  // ── Summary ─────────────────────────────────────────────────────────────────

  const completed = results.filter((r) => !r.error);
  const errors = results.filter((r) => r.error);
  const toneMatches = completed.filter((r) => r.tone_matched).length;
  const toneMatchRate =
    completed.length > 0 ? (toneMatches / completed.length).toFixed(2) : "n/a";

  const output = {
    run_id: runId,
    timestamp: new Date().toISOString(),
    dataset_version: dataset.version,
    filters: { ids: filterIds, category: filterCategory },
    summary: {
      total: messages.length,
      completed: completed.length,
      errors: errors.length,
      tone_match_rate: toneMatchRate,
      tone_matches: toneMatches,
    },
    results,
  };

  const outPath = join(RESULTS_DIR, `${runId}.json`);
  writeFileSync(outPath, JSON.stringify(output, null, 2));

  console.log(`\n── Results ─────────────────────────────────────────`);
  console.log(
    `Completed: ${completed.length}/${messages.length}  |  Errors: ${errors.length}`,
  );
  console.log(
    `Tone match rate: ${toneMatchRate} (${toneMatches}/${completed.length})`,
  );
  console.log(`Saved: ${outPath}\n`);
}

run().catch((err) => {
  console.error("\nRunner failed:", err.message);
  process.exit(1);
});
