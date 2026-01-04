// Simple syntax highlighting for JavaScript/JSX code
// This provides VS Code-like coloring without external dependencies

const tokenPatterns = [
  // Comments - must come first
  { pattern: /(\/\/.*$)/gm, className: "syn-comment" },
  { pattern: /(\/\*[\s\S]*?\*\/)/g, className: "syn-comment" },

  // Strings (single, double, template)
  { pattern: /(`[^`]*`)/g, className: "syn-string" },
  { pattern: /("(?:[^"\\]|\\.)*")/g, className: "syn-string" },
  { pattern: /('(?:[^'\\]|\\.)*')/g, className: "syn-string" },

  // Keywords
  {
    pattern:
      /\b(const|let|var|function|async|await|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|new|class|extends|import|export|from|default|typeof|instanceof|in|of|true|false|null|undefined|this|super)\b/g,
    className: "syn-keyword",
  },

  // Built-in objects/methods
  {
    pattern:
      /\b(console|Math|Date|JSON|Object|Array|String|Number|Boolean|Promise|Error|Map|Set|RegExp|Symbol)\b/g,
    className: "syn-builtin",
  },

  // Functions (word followed by parenthesis)
  {
    pattern: /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g,
    className: "syn-function",
  },

  // Properties after dot
  {
    pattern: /\.([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
    className: "syn-property",
    captureGroup: 1,
    prefix: ".",
  },

  // Numbers
  { pattern: /\b(\d+\.?\d*)\b/g, className: "syn-number" },

  // Operators
  {
    pattern: /(=>|===|!==|==|!=|<=|>=|&&|\|\||[+\-*/%=<>!&|^~])/g,
    className: "syn-operator",
  },

  // Brackets and punctuation
  { pattern: /([{}[\]()])/g, className: "syn-bracket" },
];

// Escape HTML entities
const escapeHtml = (str) => {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

// Simple token-based highlighter
export const highlightCode = (code) => {
  if (!code) return "";

  // First escape HTML
  let result = escapeHtml(code);

  // Create a map of positions that are already highlighted
  const highlighted = new Array(result.length).fill(false);

  // Process each pattern
  tokenPatterns.forEach(({ pattern, className, captureGroup, prefix }) => {
    const regex = new RegExp(pattern.source, pattern.flags);
    let match;

    while ((match = regex.exec(result)) !== null) {
      const fullMatch = match[0];
      const capturedText = captureGroup ? match[captureGroup] : fullMatch;
      const startIndex = captureGroup
        ? match.index + (prefix?.length || 0)
        : match.index;

      // Check if this region is already highlighted
      let alreadyHighlighted = false;
      for (let i = startIndex; i < startIndex + capturedText.length; i++) {
        if (highlighted[i]) {
          alreadyHighlighted = true;
          break;
        }
      }

      if (!alreadyHighlighted) {
        // Mark as highlighted
        for (let i = startIndex; i < startIndex + capturedText.length; i++) {
          highlighted[i] = true;
        }
      }
    }
  });

  // Now do the actual replacement with a more careful approach
  // Process in order: comments, strings, then others

  // Comments
  result = result.replace(/(\/\/.*$)/gm, '<span class="syn-comment">$1</span>');
  result = result.replace(
    /(\/\*[\s\S]*?\*\/)/g,
    '<span class="syn-comment">$1</span>'
  );

  // Strings (be careful not to match inside comments)
  result = result.replace(
    /(<span class="syn-[^"]*">.*?<\/span>)|(`[^`]*`)/g,
    (match, p1, p2) => {
      if (p1) return p1; // Already highlighted
      return `<span class="syn-string">${p2}</span>`;
    }
  );
  result = result.replace(
    /(<span class="syn-[^"]*">.*?<\/span>)|("(?:[^"\\]|\\.)*")/g,
    (match, p1, p2) => {
      if (p1) return p1;
      return `<span class="syn-string">${p2}</span>`;
    }
  );
  result = result.replace(
    /(<span class="syn-[^"]*">.*?<\/span>)|('(?:[^'\\]|\\.)*')/g,
    (match, p1, p2) => {
      if (p1) return p1;
      return `<span class="syn-string">${p2}</span>`;
    }
  );

  // Keywords
  result = result.replace(
    /(<span class="syn-[^"]*">[\s\S]*?<\/span>)|\b(const|let|var|function|async|await|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|new|class|extends|import|export|from|default|typeof|instanceof|in|of|true|false|null|undefined|this|super)\b/g,
    (match, p1, p2) => {
      if (p1) return p1;
      return `<span class="syn-keyword">${p2}</span>`;
    }
  );

  // Built-ins
  result = result.replace(
    /(<span class="syn-[^"]*">[\s\S]*?<\/span>)|\b(console|Math|Date|JSON|Object|Array|String|Number|Boolean|Promise|Error|Map|Set|RegExp|Symbol)\b/g,
    (match, p1, p2) => {
      if (p1) return p1;
      return `<span class="syn-builtin">${p2}</span>`;
    }
  );

  // Functions
  result = result.replace(
    /(<span class="syn-[^"]*">[\s\S]*?<\/span>)|\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g,
    (match, p1, p2) => {
      if (p1) return p1;
      if (p2) return `<span class="syn-function">${p2}</span>`;
      return match;
    }
  );

  // Numbers
  result = result.replace(
    /(<span class="syn-[^"]*">[\s\S]*?<\/span>)|\b(\d+\.?\d*)\b/g,
    (match, p1, p2) => {
      if (p1) return p1;
      return `<span class="syn-number">${p2}</span>`;
    }
  );

  return result;
};

export default highlightCode;
