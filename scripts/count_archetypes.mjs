import fs from "fs";
const src = fs.readFileSync("server/pneuma/archetypes/archetypes.js", "utf8");

const essenceMatch = src.match(
  /export const archetypeEssences = \{([\s\S]*?)\};/,
);
const essenceKeys = [...essenceMatch[1].matchAll(/^\s+(\w+):/gm)].map(
  (m) => m[1],
);

const wisdomMatch = src.match(/export const archetypes = \{([\s\S]*?)\n\};/);
const wisdomKeys = [...wisdomMatch[1].matchAll(/^\s+(\w+):\s*\[/gm)].map(
  (m) => m[1],
);

const allKeys = [...new Set([...essenceKeys, ...wisdomKeys])];
const inWisdomNotEssence = wisdomKeys.filter((k) => !essenceKeys.includes(k));
const inEssenceNotWisdom = essenceKeys.filter((k) => !wisdomKeys.includes(k));

console.log("Essences:", essenceKeys.length);
console.log("Wisdom arrays:", wisdomKeys.length);
console.log("Union (unique):", allKeys.length);
console.log();
console.log("In WISDOM but NOT in essences:", inWisdomNotEssence);
console.log("In ESSENCES but NOT in wisdom:", inEssenceNotWisdom);
