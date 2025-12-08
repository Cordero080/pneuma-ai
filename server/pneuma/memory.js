import fs from "fs";
import path from "path";

const memoryPath = path.resolve("pneuma/memory.json");

// Default memory structure
const defaultMemory = {
  shortTerm: [],
  longTerm: [],
};

// Load memory from file with error handling
export function loadMemory() {
  try {
    if (!fs.existsSync(memoryPath)) {
      console.warn("[Memory] File not found, creating default");
      saveMemory(defaultMemory);
      return { ...defaultMemory };
    }
    const raw = fs.readFileSync(memoryPath, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("[Memory] Failed to load:", err.message);
    return { ...defaultMemory };
  }
}

// Save memory to file with error handling
export function saveMemory(memory) {
  try {
    fs.writeFileSync(memoryPath, JSON.stringify(memory, null, 2));
  } catch (err) {
    console.error("[Memory] Failed to save:", err.message);
  }
}

// Add a short-term memory entry (last 10 messages)
export function addShortTermMemory(userMessage, pneumaReply) {
  const mem = loadMemory();

  mem.shortTerm.push({
    user: userMessage,
    pneuma: pneumaReply,
    timestamp: Date.now(),
  });

  // Keep only last 10
  if (mem.shortTerm.length > 10) {
    mem.shortTerm = mem.shortTerm.slice(-10);
  }

  saveMemory(mem);
}

// Add long-term memory if important
export function addLongTermMemory(insight) {
  const mem = loadMemory();

  // Don't store duplicates
  if (!mem.longTerm.includes(insight)) {
    mem.longTerm.push(insight);
  }

  // Cap at 50 items
  if (mem.longTerm.length > 50) {
    mem.longTerm = mem.longTerm.slice(-50);
  }

  saveMemory(mem);
}
