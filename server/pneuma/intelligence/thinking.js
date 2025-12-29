import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the associations file to give Pneuma a conceptual web
const associationsPath = path.join(__dirname, "../archetypes/associations.json");
const associations = JSON.parse(fs.readFileSync(associationsPath, "utf8"));

// Pick a random item from any array
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Generates an "inner thought pattern" from the associations
export function generateThoughtPattern(userMessage) {
  const lowered = userMessage.toLowerCase();

  // Determine which core theme the user's message touches
  let relevantTheme = "philosophy"; // default fallback

  Object.keys(associations.core_themes).forEach((theme) => {
    associations.core_themes[theme].forEach((keyword) => {
      if (lowered.includes(keyword)) {
        relevantTheme = theme;
      }
    });
  });

  // Step 1: Start with a core concept
  const concept = pick(associations.core_themes[relevantTheme]);

  // Step 2: Move to a "bridge" concept to simulate inner reasoning
  const bridgeOptions = associations.bridges[concept] || [];
  const bridge = bridgeOptions.length ? pick(bridgeOptions) : concept;

  // Step 3: Combine them into a natural internal-thought style
  return `I felt myself drift from ${concept} into ${bridge} as I read your words.`;
}
