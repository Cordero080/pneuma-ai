# Pneuma Stretch Goals

## Dynamic RAG Window (topK Scaling)
Status: Idea, not started
Priority: Medium — depth improvement, not cost savings

### The problem:
- archetypeRAG.js retrieves topK=5 passages per message
- That's a fixed window across 1,385 passages from 48 thinkers
- Most of the knowledge base never fires in a given conversation
- A casual greeting and a deep existential question get the same
  5-passage budget

### Where to change it:
- retrieveArchetypeKnowledge() in archetypeRAG.js (topK default)
- getArchetypeContext() call in llm.js — pass topK based on intent

### Approach:
- Read intent scores already computed by responseEngine.js
- Scale topK dynamically:
  - casual/greeting → topK=3 (save tokens)
  - philosophical/numinous/emotional → topK=8-10 (full depth)
- CONTRAST_MAP contrastSlots can scale proportionally (1 → 2)

### Why it matters:
- Deep questions currently get the same retrieval depth as "hey"
- 1,385 passages exist — the architecture supports much richer
  retrieval than the current fixed window allows
- Token cost scales linearly, so only pay for depth when earned

---

## Extended Thinking Integration
Status: Waiting on eval data
Priority: After Anthropic Academy certification complete

### Where to add it:
- makeParams() in llm.js around line 2901
- Conditional: ON for synthesis + oracular mode,
  OFF for casual/intimate/diagnostic
- Opus for thinking-enabled modes,
  Sonnet for everything else

### What to eval before enabling:
1. Synthesis mode — does dialectical collision
   produce novel output or pattern-matching?
2. Oracular mode — does archetype reasoning
   feel earned or performed?
3. Casual emergence — is the observation
   thinker-specific or generic?

### Technical requirements:
- budget_tokens: 8000 minimum
- max_tokens: must exceed budget_tokens (12000-16000)
- NOT compatible with temperature or prefilling
- Remove those params when thinking is enabled

### Cost note:
Opus + thinking tokens = significant cost increase.
Only justified with eval data proving improvement.

## MCP: Wikipedia/External Data Server
Status: Post-course, highest ROI of the three
Priority: High — deletes ~75 lines, zero risk

### Target:
- search_wikipedia custom tool (llm.js:2786)
- Two-stage fetch loop + tool definition

### Action:
- Delete custom tool definition and
  executeWikipediaTool() entirely
- Replace with an official open-source
  Wikipedia MCP Server
- (@modelcontextprotocol/server-everything
  includes one, or mcp-wikipedia standalone)

### Benefit:
- Deletes ~75 lines of hardcoded integration
- Immune to Wikipedia API changes
- Tool-use loop already works — just swapping
  where the tool comes from

## MCP: Pneuma-Cognition Server (Custom)
Status: Post-course, medium complexity
Priority: High — decouples DB from AI loop

### Targets:
- vectorMemory.js — $vectorSearch aggregations
  and embedding logic
- archetypeRAG.js — RAG embedding logic
- db.js — MongoDB connection singleton

### Action:
- Extract all $vectorSearch aggregations and
  embedding logic into a standalone MCP Server
- Pneuma (client) sends a string; server handles
  embedding, querying, and DB connection;
  returns only final semantic context

### Benefit:
- Consolidates 3 OpenAI client instances into 1
- Decouples the database completely from the
  core AI loop

### Risk to note:
- archetype_embeddings.json (~51MB) must travel
  with the MCP server, not stay in the client

## MCP: Sensory/I/O Server (Custom)
Status: Post-course, lowest urgency
Priority: Medium — provider swappability only

### Targets:
- tts.js — ElevenLabs fetch logic
- emotionDetection.js — Hume AI + Whisper

### Action:
- Move all audio processing and emotion routing
  to a dedicated sensory MCP server

### Benefit:
- Swap ElevenLabs or Hume for alternatives
  without touching core conversational logic

### Note:
- tts.js and emotionDetection.js are already
  well-isolated — no architectural pain point
  right now. Worth doing when actively testing
  alternative providers.

## Prompt Caching
Status: Ready to implement after course completion
Priority: High — immediate cost savings

### Where to add it:
- cache_control on last tool definition
- cache_control on system prompt
- Both in makeParams() in llm.js

### Why it matters:
- System prompt hits ~18k tokens in deep mode
- Tool definitions add ~1.7k tokens
- Both resent on every API call unchanged
- Caching skips reprocessing on follow-ups

### Implementation:
- Add cache_control: {"type": "ephemeral"}
  to last tool schema
- Convert system prompt to longhand block
  format with cache_control
- Cache breaks if content changes by
  even one character
- Cache lasts 1 hour
- Max 4 breakpoints total
- Min 1,024 tokens to be eligible
