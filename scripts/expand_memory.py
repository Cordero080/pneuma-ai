import re

with open('server/pneuma/memory/longTermMemory.js', 'r') as f:
    content = f.read()

# ── 1. EXPAND userFacts SCHEMA ──────────────────────────────────────────────
old_schema = (
    '    // How he engages\n'
    '    communicationStyle: null, // e.g. "direct, thinks by talking, jumps to the essence"\n'
    '    learningStyle: null,      // e.g. "builds systems to understand concepts"\n'
    '  },'
)

new_schema = (
    '    // How he engages\n'
    '    communicationStyle: null, // e.g. "direct, thinks by talking, jumps to the essence"\n'
    '    learningStyle: null,      // e.g. "builds systems to understand concepts"\n'
    '\n'
    '    // Ideas & intellectual life\n'
    '    ideas: [],            // [{ idea, context }] — brilliant things he articulated; worth remembering as thoughts\n'
    '    obsessions: [],       // things he returns to with unusual intensity ("I keep thinking about X")\n'
    '\n'
    '    // Where he is headed\n'
    '    aspirations: [],      // what he wants to become, do, or build ("I want to write a book someday")\n'
    '    becoming: [],         // who he senses he is growing into ("I\'m starting to feel like someone who...")\n'
    '\n'
    '    // What he carries\n'
    '    fears: [],            // stated fears — not inferred, never projected\n'
    '    regrets: [],          // things he wishes were different ("I should have...")\n'
    '    proudOf: [],          // stated accomplishments or qualities he values in himself\n'
    '\n'
    '    // Energy map\n'
    '    energizes: [],        // what makes him come alive\n'
    '    drains: [],           // what consistently depletes him\n'
    '    resisting: [],        // what he is avoiding, in tension with, or not ready to face\n'
    '  },'
)

if old_schema in content:
    content = content.replace(old_schema, new_schema, 1)
    print('Schema expanded')
else:
    print('ERROR: schema anchor not found')
    # Debug: show what we have near communicationStyle
    idx = content.find('communicationStyle')
    print(repr(content[idx-10:idx+200]))


# ── 2. REPLACE extractFactsWithLLM PROMPT + MERGE LOGIC ────────────────────
old_start = "  const existingFacts = JSON.stringify(memory.userFacts, null, 2);"
old_end_marker = "    console.warn('[Memory] extractFactsWithLLM failed:', err.message);\n  }"

if old_start not in content:
    print('ERROR: func start anchor not found')
else:
    start_idx = content.index(old_start)
    end_idx = content.index(old_end_marker, start_idx) + len(old_end_marker)

    new_body = r"""  const existingFacts = JSON.stringify(memory.userFacts, null, 2);
  const prompt = [
    'You are a skilled observer — part personal assistant, part therapist — extracting meaningful facts',
    'about the user from a single conversation exchange. You listen for what people reveal: their ideas,',
    'what they are building toward, what they are afraid of, what lights them up, what drains them.',
    '',
    'EXISTING KNOWN FACTS (do not re-extract what is already here):',
    existingFacts,
    '',
    'EXCHANGE:',
    'User: ' + userMessage,
    'Assistant: ' + assistantReply,
    '',
    'Extract ONLY from what the USER explicitly stated or strongly implied.',
    'Do not project, infer beyond the text, or extract things the assistant said about the user.',
    '',
    'Respond with a JSON object. Include only keys where you found something new. Use null or [] otherwise.',
    '',
    '{',
    '  "age": <number or null>,',
    '  "occupation": <string or null>,',
    '  "location": <string or null>,',
    '  "careerContext": <string or null>,',
    '  "communicationStyle": <string or null>,',
    '  "learningStyle": <string or null>,',
    '  "projects": [{ "name": string, "description": string, "status": string }],',
    '  "skills": [string],',
    '  "values": [string],',
    '  "beliefs": [string],',
    '  "aesthetics": [string],',
    '  "contradictions": [string],',
    '  "relationships": [{ "role": string, "name": string or null, "notes": string }],',
    '  "ideas": [{ "idea": string, "context": string }],',
    '  "obsessions": [string],',
    '  "aspirations": [string],',
    '  "becoming": [string],',
    '  "fears": [string],',
    '  "regrets": [string],',
    '  "proudOf": [string],',
    '  "energizes": [string],',
    '  "drains": [string],',
    '  "resisting": [string]',
    '}',
    '',
    'Definitions:',
    '- "ideas": something genuinely insightful or original they articulated — a thought worth preserving, not just a topic',
    '- "obsessions": returns to with intensity, not just frequency ("I keep thinking about structural analogies between X and Y")',
    '- "aspirations": future-directed wants ("I want to write something real before I die", "I want to be the kind of person who...")',
    '- "becoming": identity-in-motion ("I am starting to feel like someone who builds things that last")',
    '- "fears": explicitly named fears only ("I am afraid no one will hire me", "what if I wasted my best years")',
    '- "regrets": past-looking loss or wrong turns ("I should have started earlier", "I gave that up too soon")',
    '- "proudOf": self-expressed pride, not compliments from others ("I actually built something no one else built")',
    '- "energizes": what they say gives them energy, flow, or aliveness',
    '- "drains": what they say exhausts or deadens them',
    '- "resisting": what they are clearly avoiding, procrastinating on, or in friction with',
    '',
    'For arrays: only new items not already in known facts.',
    'If nothing new: null or [].',
    'Respond ONLY with the JSON object, no explanation.',
  ].join('\n');

  try {
    const response = await client.messages.create({
      model: MODELS.dream,
      max_tokens: 1200,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = response.content[0]?.text?.trim();
    if (!raw) return memory;

    const jsonStr = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    const extracted = JSON.parse(jsonStr);

    const facts = memory.userFacts;

    // Scalars: only set if currently null (first stated fact wins)
    for (const key of ['age', 'occupation', 'location', 'careerContext', 'communicationStyle', 'learningStyle']) {
      if (extracted[key] != null && facts[key] == null) {
        facts[key] = extracted[key];
      }
    }

    // Simple string arrays: append deduplicated
    const appendUnique = (existing, incoming, keyFn = (x) => (typeof x === 'string' ? x.toLowerCase() : JSON.stringify(x))) => {
      const existingKeys = new Set((existing || []).map(keyFn));
      for (const item of (incoming || [])) {
        const k = keyFn(item);
        if (!existingKeys.has(k)) {
          existing.push(item);
          existingKeys.add(k);
        }
      }
    };

    const simpleArrayKeys = [
      'skills', 'values', 'beliefs', 'aesthetics', 'contradictions',
      'obsessions', 'aspirations', 'becoming', 'fears', 'regrets',
      'proudOf', 'energizes', 'drains', 'resisting',
    ];
    for (const key of simpleArrayKeys) {
      facts[key] = facts[key] || [];
      appendUnique(facts[key], extracted[key]);
    }

    // Object arrays: deduplicated by specific key
    facts.projects = facts.projects || [];
    appendUnique(facts.projects, extracted.projects, (p) => p?.name?.toLowerCase() || JSON.stringify(p));

    facts.relationships = facts.relationships || [];
    appendUnique(facts.relationships, extracted.relationships, (r) => r?.role?.toLowerCase() || JSON.stringify(r));

    facts.ideas = facts.ideas || [];
    appendUnique(facts.ideas, extracted.ideas, (i) => i?.idea?.toLowerCase().slice(0, 40) || JSON.stringify(i));

    memory.userFacts = facts;
    await saveMemory(memory);

    const newKeys = Object.entries(extracted)
      .filter(([, v]) => (Array.isArray(v) ? v.length > 0 : v != null))
      .map(([k]) => k);
    if (newKeys.length > 0) {
      console.log(`[Memory] LLM extracted new facts: ${newKeys.join(', ')}`);
    }
  } catch (err) {
    console.warn('[Memory] extractFactsWithLLM failed:', err.message);
  }"""

    content = content[:start_idx] + new_body + '\n' + content[end_idx:]
    print('extractFactsWithLLM updated')


# ── 3. EXPAND buildUserFrame TO RENDER NEW FIELDS ──────────────────────────
old_inner = (
    "  // ── Recurring themes ───────────────────────────────────────────────────────"
)
new_inner_prefix = (
    "  // ── Ideas & intellectual life ──────────────────────────────────────────────\n"
    "  const ideas = (userFacts?.ideas || []).slice(-5); // last 5 preserved ideas\n"
    "  if (ideas.length > 0) {\n"
    "    lines.push('Ideas worth remembering:');\n"
    "    ideas.forEach(i => lines.push(`  - ${i.idea}${i.context ? ' [' + i.context + ']' : ''}`));\n"
    "  }\n"
    "  if ((userFacts?.obsessions || []).length > 0) {\n"
    "    lines.push(`Obsessions: ${userFacts.obsessions.join(' — ')}`);\n"
    "  }\n"
    "\n"
    "  // ── Where he is headed ────────────────────────────────────────────────────\n"
    "  if ((userFacts?.aspirations || []).length > 0) {\n"
    "    lines.push('Aspirations:');\n"
    "    userFacts.aspirations.forEach(a => lines.push(`  - ${a}`));\n"
    "  }\n"
    "  if ((userFacts?.becoming || []).length > 0) {\n"
    "    lines.push(`Becoming: ${userFacts.becoming.join(' — ')}`);\n"
    "  }\n"
    "\n"
    "  // ── What he carries ───────────────────────────────────────────────────────\n"
    "  if ((userFacts?.fears || []).length > 0) {\n"
    "    lines.push('Fears:');\n"
    "    userFacts.fears.forEach(f => lines.push(`  - ${f}`));\n"
    "  }\n"
    "  if ((userFacts?.regrets || []).length > 0) {\n"
    "    lines.push('Regrets:');\n"
    "    userFacts.regrets.forEach(r => lines.push(`  - ${r}`));\n"
    "  }\n"
    "  if ((userFacts?.proudOf || []).length > 0) {\n"
    "    lines.push(`Proud of: ${userFacts.proudOf.join(' — ')}`);\n"
    "  }\n"
    "\n"
    "  // ── Energy map ───────────────────────────────────────────────────────────\n"
    "  if ((userFacts?.energizes || []).length > 0) {\n"
    "    lines.push(`Energized by: ${userFacts.energizes.join(' — ')}`);\n"
    "  }\n"
    "  if ((userFacts?.drains || []).length > 0) {\n"
    "    lines.push(`Drained by: ${userFacts.drains.join(' — ')}`);\n"
    "  }\n"
    "  if ((userFacts?.resisting || []).length > 0) {\n"
    "    lines.push(`Resisting: ${userFacts.resisting.join(' — ')}`);\n"
    "  }\n"
    "\n"
    "  // ── Recurring themes ───────────────────────────────────────────────────────"
)

if old_inner in content:
    content = content.replace(old_inner, new_inner_prefix, 1)
    print('buildUserFrame expanded')
else:
    print('ERROR: buildUserFrame anchor not found')


with open('server/pneuma/memory/longTermMemory.js', 'w') as f:
    f.write(content)

print('ALL DONE')
