#!/usr/bin/env python3
"""
ingest_passages.py — Generate passages.json from source texts

Reads source texts from docs/interview/text-prompt-ref/[Thinker]/
Writes curated passages to data/archetype_knowledge/[thinker]/passages.json
Invalidates stale embeddings from data/archetype_embeddings.json

Usage:
  python3 scripts/ingest_passages.py                     # all eligible thinkers
  python3 scripts/ingest_passages.py nietzsche otto      # specific thinkers
  python3 scripts/ingest_passages.py --dry-run           # show plan, no writes
"""

import argparse
import json
import os
import re
import sys
from pathlib import Path

import anthropic
from dotenv import load_dotenv

# ── Paths ─────────────────────────────────────────────────────────────────────
PROJECT_ROOT = Path(__file__).parent.parent
DOCS_DIR     = PROJECT_ROOT / "docs/interview/text-prompt-ref"
KNOWLEDGE_DIR= PROJECT_ROOT / "data/archetype_knowledge"
EMBEDDINGS_FILE = PROJECT_ROOT / "data/archetype_embeddings.json"

load_dotenv(PROJECT_ROOT / "server/.env")

# ── Config ────────────────────────────────────────────────────────────────────
TARGET_PASSAGES   = 35
MAX_CANDIDATE_CHUNKS = 180   # max paragraphs sent to LLM per thinker
MIN_CHUNK_CHARS   = 120      # ignore fragments shorter than this
MAX_CHUNK_CHARS   = 1200     # truncate runaway paragraphs
MIN_SOURCE_BYTES  = 30_000   # skip source files smaller than this (stubs)
MODEL             = "claude-sonnet-4-6"

# ── Thinker → source file mapping ─────────────────────────────────────────────
# (docs_subfolder, [filenames])  — None filenames = auto-detect all .txt in folder
THINKER_MAP = {
    "blake":         ("Blake",            ["marriage-of-heaven-and-hell.txt"]),
    "bohm":          ("Bohm",             ["wholeness-and-the-implicate-order.txt"]),
    "borges":        ("TheBook/borges",   None),
    "breton":        ("Breton",           ["placeholder.txt"]),
    "buber":         ("Buber",            ["placeholder.txt"]),
    "camus":         ("Camus",            ["the-myth-of-sisyphus.txt"]),
    "carlin":        ("Carlin",           ["placeholder.txt"]),
    "dostoevsky":    ("Dostoevsky",       ["notes-from-underground.txt"]),
    "eckhart":       ("Eckhart",          ["light-life-love-german-mystics.txt"]),
    "feynman":       ("Feynman",          ["placeholder.txt"]),
    "frankl":        ("Frankl",           ["mans-search-for-meaning.txt"]),
    "gibran":        ("Gibran",           ["placeholder.txt"]),
    "hafiz":         ("Hafiz",            ["the-gift.txt"]),
    "heraclitus":    ("Heraclitus",       ["placeholder.txt"]),
    "jesus":         ("Jesus",            ["placeholder.txt"]),
    "jung":          ("the red book",     ["liber-primus.txt", "liber-primus-2.txt", "liber-primus-3.txt"]),
    "kafka":         ("Kafka",            ["placeholder.txt"]),
    "kastrup":       ("Kastrup",          ["why-materialism-is-baloney.txt"]),
    "kierkegaard":   ("Kierkegaard",      ["either-or.txt"]),
    "krishnamurti":  ("Krishnamurti",     ["the-first-and-last-freedom.txt"]),
    "laotzu":        ("LaoTzu",           ["placeholder.txt"]),
    "leguin":        ("LeGuin",           ["placeholder.txt"]),
    "mcgilchrist":   ("McGilchrist",      ["the-master-and-his-emissary.txt", "part-2.txt", "part-3.txt"]),
    "musashi":       ("Musashi",          ["placeholder.txt"]),
    "nietzsche":     ("Nietzsche",        ["gay-science.txt"]),
    "otto":          ("TheIdeaOfTheHoly", ["text.txt"]),
    "padmasambhava": ("Padmasambhava",    ["placeholder.txt"]),
    "pema":          ("PemaChodron",      ["when-things-fall-apart.txt"]),
    "ramana":        ("Ramana",           ["placeholder.txt"]),
    "rilke":         ("Rilke",            ["letters-to-a-young-poet.txt"]),
    "schopenhauer":  ("Schopenhauer",     ["essays.txt"]),
    "spinoza":       ("Spinoza",          ["placeholder.txt"]),
    "suntzu":        ("TheBook/sun-tzu",  None),
    "vervaeke":      ("Vervaeke",         ["placeholder.txt"]),
    "weil":          ("Weil",             ["waiting-for-god.txt"]),
    "wilber":        ("Wilber",           ["placeholder.txt"]),
    "zhuangzi":      ("Zhuangzi",         ["chuang-tzu-giles.txt"]),
    # Thich, Aurelius, Hillman, McKenna, Watts — stubs/empty, skipped by MIN_SOURCE_BYTES
}

AUTHOR_NAMES = {
    "blake": "William Blake", "bohm": "David Bohm", "borges": "Jorge Luis Borges",
    "breton": "André Breton", "buber": "Martin Buber", "camus": "Albert Camus",
    "carlin": "George Carlin", "dostoevsky": "Fyodor Dostoevsky", "eckhart": "Meister Eckhart",
    "feynman": "Richard Feynman", "frankl": "Viktor Frankl", "gibran": "Kahlil Gibran",
    "hafiz": "Hafiz", "heraclitus": "Heraclitus", "jesus": "Jesus of Nazareth",
    "jung": "Carl Jung", "kafka": "Franz Kafka", "kastrup": "Bernardo Kastrup",
    "kierkegaard": "Søren Kierkegaard", "krishnamurti": "Jiddu Krishnamurti",
    "laotzu": "Lao Tzu", "leguin": "Ursula K. Le Guin", "mcgilchrist": "Iain McGilchrist",
    "musashi": "Miyamoto Musashi", "nietzsche": "Friedrich Nietzsche", "otto": "Rudolf Otto",
    "padmasambhava": "Padmasambhava", "pema": "Pema Chödrön", "ramana": "Ramana Maharshi",
    "rilke": "Rainer Maria Rilke", "schopenhauer": "Arthur Schopenhauer",
    "spinoza": "Baruch Spinoza", "suntzu": "Sun Tzu", "vervaeke": "John Vervaeke",
    "weil": "Simone Weil", "wilber": "Ken Wilber", "zhuangzi": "Zhuangzi",
}


# ── Text loading ───────────────────────────────────────────────────────────────

def load_source_text(thinker: str) -> tuple[str, str]:
    """Return (raw_text, book_title). Raises if source is missing or too small."""
    if thinker not in THINKER_MAP:
        raise FileNotFoundError(f"No source mapping defined for '{thinker}'")

    docs_subfolder, filenames = THINKER_MAP[thinker]
    folder = DOCS_DIR / docs_subfolder

    if not folder.exists():
        raise FileNotFoundError(f"Docs folder not found: {folder}")

    # Auto-detect: collect all .txt files in folder
    if filenames is None:
        filenames = [f.name for f in folder.glob("*.txt")]
        if not filenames:
            raise FileNotFoundError(f"No .txt files in {folder}")

    combined = []
    found_title = docs_subfolder.split("/")[-1]  # fallback title from folder name

    for fname in filenames:
        fpath = folder / fname
        if not fpath.exists():
            print(f"  [skip] {fpath.name} not found", file=sys.stderr)
            continue
        text = fpath.read_text(encoding="utf-8", errors="replace")
        # Strip placeholder header (lines before "Drop the text" marker and below)
        if "Drop the text here and rename this file." in text:
            # Header is before this line — strip it and the marker itself
            idx = text.index("Drop the text here and rename this file.")
            text = text[idx + len("Drop the text here and rename this file."):].strip()
        combined.append(text)

        # Try to extract title from first meaningful non-empty line after header cleanup
        first_lines = [l.strip() for l in text.splitlines() if l.strip()]
        if first_lines:
            # Use first substantial line as title hint (up to 80 chars)
            candidate = first_lines[0][:80]
            if len(candidate) > 10 and not candidate.startswith("{"):
                found_title = candidate

    full_text = "\n\n".join(combined)

    if len(full_text.encode()) < MIN_SOURCE_BYTES:
        raise ValueError(
            f"Source text for '{thinker}' is only {len(full_text.encode())} bytes "
            f"(minimum {MIN_SOURCE_BYTES}). Likely a stub — add the real text first."
        )

    return full_text, found_title


# ── Chunking ───────────────────────────────────────────────────────────────────

def clean_and_chunk(text: str) -> list[str]:
    """
    Split text into passage-sized chunks.

    Handles two common formats:
    - Double-newline separated paragraphs (standard)
    - Single-newline per line (PDF extraction, most of our files)
    """
    text = text.replace("\r\n", "\n").replace("\r", "\n")

    # Detect format: if fewer than 5% of newlines are double, it's single-newline format
    double_newlines = len(re.findall(r"\n{2,}", text))
    single_newlines = len(re.findall(r"\n", text))
    is_single_newline_format = double_newlines < max(single_newlines * 0.05, 5)

    if is_single_newline_format:
        # Join lines into a continuous stream, then split into sentence groups
        # First, collapse multiple newlines and join lines with a space
        flat = re.sub(r"\n+", " ", text)
        flat = re.sub(r" {2,}", " ", flat).strip()

        # Split into sentences (end of sentence = . ! ? followed by space+capital or end)
        sentences = re.split(r"(?<=[.!?])\s+(?=[A-Z\"\'])", flat)

        # Group sentences into chunks of roughly MIN_CHUNK_CHARS–MAX_CHUNK_CHARS
        chunks = []
        current = []
        current_len = 0
        for sent in sentences:
            sent = sent.strip()
            if not sent:
                continue
            current.append(sent)
            current_len += len(sent)
            if current_len >= MIN_CHUNK_CHARS * 2:
                chunk = " ".join(current)
                if len(chunk) > MAX_CHUNK_CHARS:
                    chunk = chunk[:MAX_CHUNK_CHARS].rsplit(" ", 1)[0]
                chunks.append(chunk)
                current = []
                current_len = 0
        if current and current_len >= MIN_CHUNK_CHARS:
            chunks.append(" ".join(current))
    else:
        # Standard double-newline paragraphs
        raw_chunks = re.split(r"\n{2,}", text)
        chunks = []
        for chunk in raw_chunks:
            chunk = re.sub(r"\n", " ", chunk).strip()
            if len(chunk) < MIN_CHUNK_CHARS:
                continue
            if len(chunk) > MAX_CHUNK_CHARS:
                cutoff = chunk[:MAX_CHUNK_CHARS].rfind(". ")
                chunk = chunk[:cutoff + 1] if cutoff > MIN_CHUNK_CHARS else chunk[:MAX_CHUNK_CHARS]
            chunks.append(chunk)

    # Final filter: drop OCR noise (less than 50% alphabetic)
    chunks = [
        c for c in chunks
        if sum(ch.isalpha() for ch in c) / max(len(c), 1) >= 0.5
    ]

    return chunks


def sample_chunks(chunks: list[str], target: int) -> list[str]:
    """Evenly sample chunks across the full text so LLM sees the whole range."""
    if len(chunks) <= target:
        return chunks
    step = len(chunks) / target
    return [chunks[int(i * step)] for i in range(target)]


# ── LLM passage selection ──────────────────────────────────────────────────────

SELECTION_PROMPT = """\
You are curating philosophical passages for an AI system that blends multiple thinkers' voices.
Your job: select the {n} passages from {author} that are most useful for VOCABULARY CROSS-WIRING —
passages where this author's specific language, rhythm, and conceptual moves are so distinctive
that when they appear alongside other traditions, they produce collision and unexpected synthesis.

Criteria (in order of importance):
1. LEXICALLY DISTINCTIVE — sentences only this author could have written. Prefer rare terminology,
   unusual syntax, characteristic metaphors. Avoid generic wisdom.
2. PHILOSOPHICALLY DENSE — multiple ideas compressed. One sentence does three things.
3. COLLISION POTENTIAL — phrasing that would produce unexpected friction or spark when placed
   next to Nietzsche, or Rumi, or Feynman, or Marcus Aurelius.

From the numbered chunks below, select the {n} best. For each, return EXACTLY this JSON structure:
{{
  "id": "{thinker}-NNN",
  "text": "<exact text, no paraphrase, cut as-is from source>",
  "source": "<author name, book title>",
  "themes": ["theme1", "theme2", "theme3"],
  "context": "<one sentence: what makes this passage philosophically or linguistically distinctive>"
}}

Return a single JSON array. No commentary. No markdown. Just the array.

CHUNKS:
{chunks}
"""


def select_passages(
    client: anthropic.Anthropic,
    thinker: str,
    chunks: list[str],
    book_title: str,
    dry_run: bool = False,
) -> list[dict]:
    """Call LLM to select and annotate the best passages."""
    author = AUTHOR_NAMES.get(thinker, thinker.title())
    sampled = sample_chunks(chunks, MAX_CANDIDATE_CHUNKS)

    numbered = "\n\n".join(f"[{i+1}] {c}" for i, c in enumerate(sampled))

    prompt = SELECTION_PROMPT.format(
        n=TARGET_PASSAGES,
        author=author,
        thinker=thinker,
        chunks=numbered,
    )

    if dry_run:
        print(f"  [dry-run] Would send {len(sampled)} chunks to LLM ({len(prompt)} chars)")
        # Return stub passages for dry-run
        return [{"id": f"{thinker}-DRY", "text": "dry run", "source": book_title,
                 "themes": [], "context": "dry run"}]

    print(f"  Sending {len(sampled)} candidate chunks to {MODEL}...")

    response = client.messages.create(
        model=MODEL,
        max_tokens=8000,
        messages=[{"role": "user", "content": prompt}],
    )

    raw = response.content[0].text.strip()

    # Strip markdown code fences if present
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)

    passages = json.loads(raw)

    # Enforce sequential IDs and validate structure
    clean = []
    for i, p in enumerate(passages):
        if not isinstance(p, dict) or "text" not in p:
            continue
        clean.append({
            "id":      f"{thinker}-{str(i+1).zfill(3)}",
            "text":    p.get("text", "").strip(),
            "source":  p.get("source", f"{author}, {book_title}"),
            "themes":  p.get("themes", [])[:5],
            "context": p.get("context", ""),
        })

    return clean


# ── Embeddings invalidation ────────────────────────────────────────────────────

def invalidate_embeddings(thinker: str, dry_run: bool = False) -> int:
    """Remove all embedding entries for this thinker. Returns count removed."""
    if not EMBEDDINGS_FILE.exists():
        return 0

    try:
        data = json.loads(EMBEDDINGS_FILE.read_text())
    except Exception:
        return 0

    if not isinstance(data, list):
        return 0

    prefix = f"{thinker}-"
    before = len(data)
    filtered = [e for e in data if not e.get("id", "").startswith(prefix)]
    removed = before - len(filtered)

    if removed > 0 and not dry_run:
        EMBEDDINGS_FILE.write_text(json.dumps(filtered, indent=2))

    return removed


# ── Main ───────────────────────────────────────────────────────────────────────

def process_thinker(
    client: anthropic.Anthropic,
    thinker: str,
    dry_run: bool = False,
) -> bool:
    """Ingest one thinker. Returns True on success."""
    print(f"\n{'─'*60}")
    print(f"  {AUTHOR_NAMES.get(thinker, thinker.title())}  [{thinker}]")
    print(f"{'─'*60}")

    # 1. Load source text
    try:
        raw_text, book_title = load_source_text(thinker)
    except (FileNotFoundError, ValueError) as e:
        print(f"  [SKIP] {e}")
        return False

    print(f"  Source: {len(raw_text):,} chars")

    # 2. Chunk
    chunks = clean_and_chunk(raw_text)
    print(f"  Chunks: {len(chunks)} candidate paragraphs")

    if len(chunks) < 10:
        print(f"  [SKIP] Too few clean chunks ({len(chunks)}) — source text may be corrupted")
        return False

    # 3. LLM selection
    try:
        passages = select_passages(client, thinker, chunks, book_title, dry_run=dry_run)
    except json.JSONDecodeError as e:
        print(f"  [ERROR] LLM returned invalid JSON: {e}")
        return False
    except Exception as e:
        print(f"  [ERROR] LLM call failed: {e}")
        return False

    print(f"  Selected: {len(passages)} passages")

    # 4. Write passages.json
    out_path = KNOWLEDGE_DIR / thinker / "passages.json"
    if not dry_run:
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(json.dumps(passages, indent=2, ensure_ascii=False))
        print(f"  Written: {out_path}")
    else:
        print(f"  [dry-run] Would write to {out_path}")

    # 5. Invalidate stale embeddings
    removed = invalidate_embeddings(thinker, dry_run=dry_run)
    if removed > 0:
        action = "[dry-run] Would remove" if dry_run else "Removed"
        print(f"  {action} {removed} stale embeddings from cache")
    else:
        print(f"  No stale embeddings to remove")

    return True


def main():
    parser = argparse.ArgumentParser(description="Ingest source texts → passages.json")
    parser.add_argument("thinkers", nargs="*", help="Specific thinker names (default: all)")
    parser.add_argument("--dry-run", action="store_true", help="Show plan without writing files")
    args = parser.parse_args()

    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key or api_key == "your_anthropic_api_key_here":
        print("ERROR: ANTHROPIC_API_KEY not set in server/.env", file=sys.stderr)
        sys.exit(1)

    client = anthropic.Anthropic(api_key=api_key)

    targets = args.thinkers if args.thinkers else sorted(THINKER_MAP.keys())

    # Validate thinker names
    unknown = [t for t in targets if t not in THINKER_MAP]
    if unknown:
        print(f"ERROR: Unknown thinkers: {', '.join(unknown)}", file=sys.stderr)
        print(f"Available: {', '.join(sorted(THINKER_MAP.keys()))}", file=sys.stderr)
        sys.exit(1)

    if args.dry_run:
        print("DRY RUN — no files will be written\n")

    successes, skips, errors = [], [], []

    for thinker in targets:
        try:
            ok = process_thinker(client, thinker, dry_run=args.dry_run)
            (successes if ok else skips).append(thinker)
        except KeyboardInterrupt:
            print("\nInterrupted.")
            break
        except Exception as e:
            print(f"  [ERROR] Unexpected: {e}")
            errors.append(thinker)

    print(f"\n{'═'*60}")
    print(f"  Done: {len(successes)} updated | {len(skips)} skipped | {len(errors)} errors")
    if skips:
        print(f"  Skipped: {', '.join(skips)}")
    if errors:
        print(f"  Errors:  {', '.join(errors)}")
    if not args.dry_run and successes:
        print(f"\n  Embeddings will rebuild automatically on next server request.")
    print(f"{'═'*60}")


if __name__ == "__main__":
    main()
