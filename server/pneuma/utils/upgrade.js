// ------------------------------------------------------------
// PNEUMA V2 — UPGRADE MODULE
// Supports multi-axis evolution vectors + legacy weights
// ------------------------------------------------------------

import { loadState, saveState } from "../state/state.js";

// ============================================================
// KEY MAPPINGS — Maps user-friendly names to state paths
// ============================================================

const KEY_MAPPINGS = {
  // Evolution vectors (new V2 system)
  humility: "vectors.humility",
  presence: "vectors.presence",
  mythicdepth: "vectors.mythicDepth",
  mythic: "vectors.mythicDepth",
  analyticclarity: "vectors.analyticClarity",
  analytic: "vectors.analyticClarity",
  intuitionsensitivity: "vectors.intuitionSensitivity",
  intuition: "vectors.intuitionSensitivity",
  casualgrounding: "vectors.casualGrounding",
  casual: "vectors.casualGrounding",
  emotionalresonance: "vectors.emotionalResonance",
  emotional: "vectors.emotionalResonance",
  numinousdrift: "vectors.numinousDrift",
  numinous: "vectors.numinousDrift",

  // Vector aliases with dots
  "vectors.humility": "vectors.humility",
  "vectors.presence": "vectors.presence",
  "vectors.mythicdepth": "vectors.mythicDepth",
  "vectors.analyticclarity": "vectors.analyticClarity",
  "vectors.intuitionsensitivity": "vectors.intuitionSensitivity",
  "vectors.casualgrounding": "vectors.casualGrounding",
  "vectors.emotionalresonance": "vectors.emotionalResonance",
  "vectors.numinousdrift": "vectors.numinousDrift",

  // Legacy weights (for backward compatibility)
  casualweight: "casualweight",
  mythicweight: "mythicweight",
  analyticweight: "analyticweight",
  numinoussensitivity: "numinoussensitivity",
  drift: "drift",
  clarity: "clarity",
  energy: "energy",

  // System settings
  humanitylevel: "humanitylevel",
  humanity: "humanitylevel",
  modethrottle: "modethrottle",
  throttle: "modethrottle",
  maxmemories: "maxmemories",
};

// ============================================================
// APPLY UPGRADES
// ============================================================

export function applyUpgrades(upgrades, existingState = null) {
  try {
    const state = existingState || loadState();
    let changed = false;

    for (let [rawKey, rawVal] of Object.entries(upgrades)) {
      const key = rawKey.toLowerCase().trim();
      const val = Number(rawVal);

      if (isNaN(val)) continue;

      const mappedPath = KEY_MAPPINGS[key];
      if (!mappedPath) continue;

      // Handle nested paths (e.g., "vectors.humility")
      if (mappedPath.includes(".")) {
        const parts = mappedPath.split(".");
        let obj = state;

        // Navigate to parent
        for (let i = 0; i < parts.length - 1; i++) {
          if (!obj[parts[i]]) obj[parts[i]] = {};
          obj = obj[parts[i]];
        }

        // Set value
        const finalKey = parts[parts.length - 1];
        obj[finalKey] = clamp(val, 0, 1);
        changed = true;
      } else {
        // Direct property
        if (mappedPath in state) {
          state[mappedPath] = clamp(val, 0, 1);
          changed = true;
        }
      }
    }

    if (changed) {
      saveState(state);
    }

    return changed;
  } catch (err) {
    console.error("[Pneuma V2] Upgrade error:", err);
    return false;
  }
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

// ============================================================
// PARSE USER MESSAGE → { key: value }
// ============================================================

export function parseUpgradeInstructions(message) {
  const upgrades = {};
  const lower = message.toLowerCase();

  const patterns = [
    /(\w+(?:\.\w+)?)\s*[:=]\s*([\d.]+)/gi, // key: value or key = value
    /set\s+(\w+(?:\.\w+)?)\s+to\s+([\d.]+)/gi, // set key to value
    /[-•]\s*(\w+(?:\.\w+)?)\s*[:=]\s*([\d.]+)/gi, // - key: value (list format)
  ];

  for (const pattern of patterns) {
    let match;
    const regex = new RegExp(pattern.source, pattern.flags);
    while ((match = regex.exec(lower)) !== null) {
      const key = match[1].trim();
      const val = parseFloat(match[2].trim());

      if (isNaN(val)) continue;

      const mappedPath = KEY_MAPPINGS[key];
      if (mappedPath) {
        upgrades[key] = val;
      }
    }
  }

  return upgrades;
}

// ============================================================
// DETECT IF USER WANTS AN UPGRADE
// ============================================================

export function wantsUpgrade(message) {
  const lower = message.toLowerCase();

  return (
    lower.includes("apply upgrades") ||
    lower.includes("apply the upgrades") ||
    lower.includes("apply following upgrades") ||
    lower.includes("install upgrades") ||
    lower.includes("update his settings") ||
    lower.includes("update settings") ||
    lower.includes("change the weights") ||
    lower.includes("set the weights") ||
    lower.includes("modify his parameters") ||
    lower.includes("modify parameters") ||
    lower.includes("upgrade pneuma") ||
    lower.includes("upgrade him") ||
    lower.includes("set vectors") ||
    lower.includes("update vectors")
  );
}
