import fs from "fs";

const old = JSON.parse(fs.readFileSync("/tmp/old_conversations.json", "utf8"));
const current = JSON.parse(fs.readFileSync("data/conversations.json", "utf8"));

console.log("Old backup:", old.conversations.length, "conversations");
console.log("Current:", current.conversations.length, "conversations");

// Get all conversation IDs from old
const oldIds = new Set(old.conversations.map((c) => c.id));

// Add any conversations from current that aren't in old
for (const conv of current.conversations) {
  if (!oldIds.has(conv.id)) {
    old.conversations.push(conv);
    console.log("Added new conversation:", conv.id);
  } else {
    // Update if current has more exchanges
    const oldConv = old.conversations.find((c) => c.id === conv.id);
    if (conv.exchanges.length > oldConv.exchanges.length) {
      Object.assign(oldConv, conv);
      console.log(
        "Updated conversation:",
        conv.id,
        "with",
        conv.exchanges.length,
        "exchanges"
      );
    }
  }
}

// Sort by startedAt
old.conversations.sort((a, b) => new Date(a.startedAt) - new Date(b.startedAt));

fs.writeFileSync("data/conversations.json", JSON.stringify(old, null, 2));
console.log("Total conversations saved:", old.conversations.length);
