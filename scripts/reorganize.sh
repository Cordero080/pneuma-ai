#!/bin/bash
# ============================================================
# PNEUMA FOLDER REORGANIZATION SCRIPT
# Safe migration with import path updates
# Run from project root: ./scripts/reorganize.sh
# ============================================================

set -e  # Exit on any error

PNEUMA_DIR="server/pneuma"

echo "🔄 Starting Pneuma folder reorganization..."
echo ""

# ============================================================
# STEP 1: Create new folder structure
# ============================================================
echo "📁 Creating new folder structure..."

mkdir -p "$PNEUMA_DIR/core"
mkdir -p "$PNEUMA_DIR/intelligence"
mkdir -p "$PNEUMA_DIR/archetypes"
mkdir -p "$PNEUMA_DIR/memory"
mkdir -p "$PNEUMA_DIR/input"
mkdir -p "$PNEUMA_DIR/personality"
mkdir -p "$PNEUMA_DIR/behavior"
mkdir -p "$PNEUMA_DIR/state"
mkdir -p "$PNEUMA_DIR/services"
mkdir -p "$PNEUMA_DIR/utils"

echo "✅ Folders created"
echo ""

# ============================================================
# STEP 2: Move files to new locations
# ============================================================
echo "📦 Moving files..."

# CORE (Layer 4: Orchestration)
mv "$PNEUMA_DIR/fusion.js" "$PNEUMA_DIR/core/"
mv "$PNEUMA_DIR/responseEngine.js" "$PNEUMA_DIR/core/"
mv "$PNEUMA_DIR/modeSelector.js" "$PNEUMA_DIR/core/"

# INTELLIGENCE (Layer 2: Cognition)
mv "$PNEUMA_DIR/llm.js" "$PNEUMA_DIR/intelligence/"
mv "$PNEUMA_DIR/thinking.js" "$PNEUMA_DIR/intelligence/"
mv "$PNEUMA_DIR/thinkerDeep.js" "$PNEUMA_DIR/intelligence/"
mv "$PNEUMA_DIR/semanticRouter.js" "$PNEUMA_DIR/intelligence/"
mv "$PNEUMA_DIR/synthesisEngine.js" "$PNEUMA_DIR/intelligence/"

# ARCHETYPES
mv "$PNEUMA_DIR/archetypes.js" "$PNEUMA_DIR/archetypes/"
mv "$PNEUMA_DIR/archetypeDepth.js" "$PNEUMA_DIR/archetypes/"
mv "$PNEUMA_DIR/archetypeFusion.js" "$PNEUMA_DIR/archetypes/"
mv "$PNEUMA_DIR/archetypeMomentum.js" "$PNEUMA_DIR/archetypes/"
mv "$PNEUMA_DIR/associations.json" "$PNEUMA_DIR/archetypes/"

# MEMORY
mv "$PNEUMA_DIR/memory.js" "$PNEUMA_DIR/memory/"
mv "$PNEUMA_DIR/longTermMemory.js" "$PNEUMA_DIR/memory/"
mv "$PNEUMA_DIR/vectorMemory.js" "$PNEUMA_DIR/memory/"
mv "$PNEUMA_DIR/conversationHistory.js" "$PNEUMA_DIR/memory/"
mv "$PNEUMA_DIR/memory.json" "$PNEUMA_DIR/memory/"

# INPUT (Layer 1: Input Processing)
mv "$PNEUMA_DIR/synesthesia.js" "$PNEUMA_DIR/input/"
mv "$PNEUMA_DIR/rhythmIntelligence.js" "$PNEUMA_DIR/input/"
mv "$PNEUMA_DIR/emotionDetection.js" "$PNEUMA_DIR/input/"
mv "$PNEUMA_DIR/userContext.js" "$PNEUMA_DIR/input/"

# PERSONALITY (Layer 3: Voice)
mv "$PNEUMA_DIR/personality.js" "$PNEUMA_DIR/personality/"
mv "$PNEUMA_DIR/language.js" "$PNEUMA_DIR/personality/"
mv "$PNEUMA_DIR/domainVocabulary.js" "$PNEUMA_DIR/personality/"
mv "$PNEUMA_DIR/vocabularyExpansion.js" "$PNEUMA_DIR/personality/"
mv "$PNEUMA_DIR/artKnowledge.js" "$PNEUMA_DIR/personality/"
mv "$PNEUMA_DIR/language_palette.json" "$PNEUMA_DIR/personality/"

# BEHAVIOR
mv "$PNEUMA_DIR/uncertainty.js" "$PNEUMA_DIR/behavior/"
mv "$PNEUMA_DIR/disagreement.js" "$PNEUMA_DIR/behavior/"
mv "$PNEUMA_DIR/innerMonologue.js" "$PNEUMA_DIR/behavior/"
mv "$PNEUMA_DIR/reflectionEngine.js" "$PNEUMA_DIR/behavior/"
mv "$PNEUMA_DIR/dreamMode.js" "$PNEUMA_DIR/behavior/"

# STATE
mv "$PNEUMA_DIR/state.js" "$PNEUMA_DIR/state/"
mv "$PNEUMA_DIR/worldview.json" "$PNEUMA_DIR/state/"

# SERVICES
mv "$PNEUMA_DIR/tts.js" "$PNEUMA_DIR/services/"
mv "$PNEUMA_DIR/tokenTracker.js" "$PNEUMA_DIR/services/"

# UTILS
mv "$PNEUMA_DIR/mismatchLogger.js" "$PNEUMA_DIR/utils/"
mv "$PNEUMA_DIR/upgrade.js" "$PNEUMA_DIR/utils/"
mv "$PNEUMA_DIR/mismatch_log.json" "$PNEUMA_DIR/utils/"

# Keep these in root or move to appropriate places
# coherence.txt, reflections.txt - documentation files

echo "✅ Files moved"
echo ""

# ============================================================
# STEP 3: Update import paths in all files
# ============================================================
echo "🔗 Updating import paths..."

# Define the import mapping (old path -> new path relative to pneuma/)
# We'll use sed to update these

# Files in CORE need to import from sibling folders
# core/fusion.js imports from: state, core, input, behavior, memory, archetypes

# Update core/fusion.js
sed -i '' \
  -e 's|from "./state.js"|from "../state/state.js"|g' \
  -e 's|from "./responseEngine.js"|from "./responseEngine.js"|g' \
  -e 's|from "./rhythmIntelligence.js"|from "../input/rhythmIntelligence.js"|g' \
  -e 's|from "./uncertainty.js"|from "../behavior/uncertainty.js"|g' \
  -e 's|from "./longTermMemory.js"|from "../memory/longTermMemory.js"|g' \
  -e 's|from "./disagreement.js"|from "../behavior/disagreement.js"|g' \
  -e 's|from "./conversationHistory.js"|from "../memory/conversationHistory.js"|g' \
  -e 's|from "./archetypeFusion.js"|from "../archetypes/archetypeFusion.js"|g' \
  "$PNEUMA_DIR/core/fusion.js"

# Update core/responseEngine.js
sed -i '' \
  -e 's|from "./personality.js"|from "../personality/personality.js"|g' \
  -e 's|from "./llm.js"|from "../intelligence/llm.js"|g' \
  -e 's|from "./state.js"|from "../state/state.js"|g' \
  -e 's|from "./mismatchLogger.js"|from "../utils/mismatchLogger.js"|g' \
  "$PNEUMA_DIR/core/responseEngine.js"

# Update intelligence/llm.js
sed -i '' \
  -e 's|from "./userContext.js"|from "../input/userContext.js"|g' \
  -e 's|from "./archetypes.js"|from "../archetypes/archetypes.js"|g' \
  -e 's|from "./thinkerDeep.js"|from "./thinkerDeep.js"|g' \
  -e 's|from "./tokenTracker.js"|from "../services/tokenTracker.js"|g' \
  -e 's|from "./language.js"|from "../personality/language.js"|g' \
  -e 's|from "./state.js"|from "../state/state.js"|g' \
  -e 's|from "./archetypeDepth.js"|from "../archetypes/archetypeDepth.js"|g' \
  -e 's|from "./synthesisEngine.js"|from "./synthesisEngine.js"|g' \
  -e 's|from "./vectorMemory.js"|from "../memory/vectorMemory.js"|g' \
  -e 's|from "./semanticRouter.js"|from "./semanticRouter.js"|g' \
  -e 's|from "./archetypeFusion.js"|from "../archetypes/archetypeFusion.js"|g' \
  -e 's|from "./innerMonologue.js"|from "../behavior/innerMonologue.js"|g' \
  -e 's|from "./domainVocabulary.js"|from "../personality/domainVocabulary.js"|g' \
  -e 's|from "./archetypeMomentum.js"|from "../archetypes/archetypeMomentum.js"|g' \
  -e 's|from "./emotionDetection.js"|from "../input/emotionDetection.js"|g' \
  "$PNEUMA_DIR/intelligence/llm.js"

# Update intelligence/semanticRouter.js
sed -i '' \
  -e 's|from "./archetypes.js"|from "../archetypes/archetypes.js"|g' \
  -e 's|from "./vectorMemory.js"|from "../memory/vectorMemory.js"|g' \
  "$PNEUMA_DIR/intelligence/semanticRouter.js"

# Update intelligence/synthesisEngine.js
sed -i '' \
  -e 's|from "./archetypeDepth.js"|from "../archetypes/archetypeDepth.js"|g' \
  -e 's|from "./personality.js"|from "../personality/personality.js"|g' \
  -e 's|from "./reflectionEngine.js"|from "../behavior/reflectionEngine.js"|g' \
  -e 's|from "./memory.js"|from "../memory/memory.js"|g' \
  "$PNEUMA_DIR/intelligence/synthesisEngine.js"

# Update archetypes/archetypeFusion.js
sed -i '' \
  -e 's|from "./vectorMemory.js"|from "../memory/vectorMemory.js"|g' \
  "$PNEUMA_DIR/archetypes/archetypeFusion.js"

# Update memory/conversationHistory.js
sed -i '' \
  -e 's|from "./longTermMemory.js"|from "./longTermMemory.js"|g' \
  "$PNEUMA_DIR/memory/conversationHistory.js"

# Update behavior/dreamMode.js
sed -i '' \
  -e 's|from "./vectorMemory.js"|from "../memory/vectorMemory.js"|g' \
  -e 's|from "./archetypeMomentum.js"|from "../archetypes/archetypeMomentum.js"|g' \
  "$PNEUMA_DIR/behavior/dreamMode.js"

# Update behavior/innerMonologue.js
sed -i '' \
  -e 's|from "./archetypes.js"|from "../archetypes/archetypes.js"|g' \
  "$PNEUMA_DIR/behavior/innerMonologue.js"

# Update behavior/reflectionEngine.js
sed -i '' \
  -e 's|from "./thinking.js"|from "../intelligence/thinking.js"|g' \
  "$PNEUMA_DIR/behavior/reflectionEngine.js"

# Update personality/personality.js
sed -i '' \
  -e 's|from "./tokenTracker.js"|from "../services/tokenTracker.js"|g' \
  -e 's|from "./language.js"|from "./language.js"|g' \
  -e 's|from "./artKnowledge.js"|from "./artKnowledge.js"|g' \
  -e 's|from "./vocabularyExpansion.js"|from "./vocabularyExpansion.js"|g' \
  -e 's|from "./synesthesia.js"|from "../input/synesthesia.js"|g' \
  -e 's|from "./userContext.js"|from "../input/userContext.js"|g' \
  "$PNEUMA_DIR/personality/personality.js"

# Update state/state.js
sed -i '' \
  -e 's|from "./conversationHistory.js"|from "../memory/conversationHistory.js"|g' \
  "$PNEUMA_DIR/state/state.js"

# Update utils/upgrade.js
sed -i '' \
  -e 's|from "./state.js"|from "../state/state.js"|g' \
  "$PNEUMA_DIR/utils/upgrade.js"

# Update input/userContext.js
sed -i '' \
  -e 's|from "./language.js"|from "../personality/language.js"|g' \
  "$PNEUMA_DIR/input/userContext.js"

echo "✅ Import paths updated in pneuma modules"
echo ""

# ============================================================
# STEP 4: Update server/index.js imports
# ============================================================
echo "🔗 Updating server/index.js imports..."

sed -i '' \
  -e 's|from "./pneuma/fusion.js"|from "./pneuma/core/fusion.js"|g' \
  -e 's|from "./pneuma/tts.js"|from "./pneuma/services/tts.js"|g' \
  -e 's|from "./pneuma/semanticRouter.js"|from "./pneuma/intelligence/semanticRouter.js"|g' \
  -e 's|from "./pneuma/emotionDetection.js"|from "./pneuma/input/emotionDetection.js"|g' \
  -e 's|from "./pneuma/archetypeMomentum.js"|from "./pneuma/archetypes/archetypeMomentum.js"|g' \
  -e 's|from "./pneuma/dreamMode.js"|from "./pneuma/behavior/dreamMode.js"|g' \
  "server/index.js"

echo "✅ server/index.js updated"
echo ""

# ============================================================
# STEP 5: Move remaining text files to docs or keep in place
# ============================================================
echo "📄 Handling documentation files..."

# Move coherence.txt and reflections.txt to a logs folder
mkdir -p "$PNEUMA_DIR/logs"
if [ -f "$PNEUMA_DIR/coherence.txt" ]; then
  mv "$PNEUMA_DIR/coherence.txt" "$PNEUMA_DIR/logs/"
fi
if [ -f "$PNEUMA_DIR/reflections.txt" ]; then
  mv "$PNEUMA_DIR/reflections.txt" "$PNEUMA_DIR/logs/"
fi

echo "✅ Documentation files moved"
echo ""

# ============================================================
# DONE
# ============================================================
echo "🎉 Reorganization complete!"
echo ""
echo "New structure:"
echo "  pneuma/"
echo "  ├── core/          # Orchestration (fusion, response)"
echo "  ├── intelligence/  # LLM, thinking, semantic routing"
echo "  ├── archetypes/    # 23 archetype system"
echo "  ├── memory/        # Short/long-term, vector memory"
echo "  ├── input/         # Emotion, rhythm, synesthesia"
echo "  ├── personality/   # Voice, language, vocabulary"
echo "  ├── behavior/      # Dreams, uncertainty, reflection"
echo "  ├── state/         # State management"
echo "  ├── services/      # TTS, token tracking"
echo "  ├── utils/         # Utilities"
echo "  ├── logs/          # Text logs"
echo "  └── config/        # Configuration"
echo ""
echo "⚠️  Test your app now: npm run dev (or your start command)"
echo "If everything works, commit: git add -A && git commit -m 'refactor: reorganize pneuma folder structure'"
