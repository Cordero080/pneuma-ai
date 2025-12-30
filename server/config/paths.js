// ============================================================
// PNEUMA — CENTRALIZED PATH CONFIGURATION
// Purpose: Single source of truth for all file paths
// Why: Prevents bugs from relative path miscalculations
// ============================================================

import path from "path";
import { fileURLToPath } from "url";

// Get the directory of THIS config file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Calculate project root: from server/config/ go up 2 levels
// server/config/paths.js → server/config → server → [ROOT]
export const ROOT_DIR = path.resolve(__dirname, "../..");

// Data directory at project root
export const DATA_DIR = path.join(ROOT_DIR, "data");

// ============================================================
// DATA FILE PATHS
// All JSON files that persist state
// ============================================================

export const CONVERSATIONS_FILE = path.join(DATA_DIR, "conversations.json");
export const LONG_TERM_MEMORY_FILE = path.join(
  DATA_DIR,
  "long_term_memory.json"
);
export const VECTOR_MEMORY_FILE = path.join(DATA_DIR, "vector_memory.json");
export const PNEUMA_STATE_FILE = path.join(DATA_DIR, "pneuma_state.json");
export const TOKEN_USAGE_FILE = path.join(DATA_DIR, "token_usage.json");
export const ARCHETYPE_MOMENTUM_FILE = path.join(
  DATA_DIR,
  "archetype_momentum.json"
);
export const ARCHETYPE_FUSIONS_FILE = path.join(
  DATA_DIR,
  "archetype_fusions.json"
);
export const PNEUMA_DREAMS_FILE = path.join(DATA_DIR, "pneuma_dreams.json");

// Temporary files
export const TEMP_AUDIO_FILE = path.join(DATA_DIR, "temp_audio.webm");

// Knowledge base directory (for RAG)
export const ARCHETYPE_KNOWLEDGE_DIR = path.join(
  DATA_DIR,
  "archetype_knowledge"
);

// ============================================================
// HELPER: Ensure data directory exists
// Call this at startup to prevent write errors
// ============================================================

import fs from "fs";

export function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log(`[Paths] Created data directory: ${DATA_DIR}`);
  }
}

// Log paths on import (helpful for debugging)
console.log(`[Paths] ROOT_DIR: ${ROOT_DIR}`);
console.log(`[Paths] DATA_DIR: ${DATA_DIR}`);
