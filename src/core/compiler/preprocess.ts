import type { Diagnostic } from "@/core/types";

export interface PreprocessResult {
  code: string;
  diagnostics: Diagnostic[];
}

const IMPORT_RE = /^[ \t]*import\s+([\s\S]*?)\s*from\s*["']([^"']+)["'];?[ \t]*$/gm;
const BARE_IMPORT_RE = /^[ \t]*import\s*["']([^"']+)["'];?[ \t]*$/gm;
const REACT_MODULES = new Set(["react", "react-dom", "react-dom/client", "react/jsx-runtime"]);
const CORE_MODULES = new Set(["@poster/core", "poster-studio", "@/core/poster", "./poster"]);

function lineOf(source: string, index: number): number {
  return source.slice(0, index).split("\n").length;
}

/**
 * Rewrites user source into a self-contained script body that the sandbox can
 * safely compile and execute. No user code is evaluated here — this is pure
 * string transformation, so it is cheap and testable.
 */
export function preprocess(source: string): PreprocessResult {
  const diagnostics: Diagnostic[] = [];

  let code = source.replace(BARE_IMPORT_RE, (match, module: string) => {
    if (module.endsWith(".css")) return "";
    diagnostics.push({
      severity: "warning",
      kind: "preprocess",
      message: `Import of "${module}" is not available in the sandbox and was ignored.`,
    });
    return "";
  });

  code = code.replace(IMPORT_RE, (match, clause: string, module: string, offset: number) => {
    if (REACT_MODULES.has(module)) return "";
    if (CORE_MODULES.has(module)) {
      const named = clause.match(/\{([\s\S]*?)\}/);
      if (named) return `const {${named[1]}} = PosterCore;`;
      const def = clause.trim().split(",")[0]?.trim();
      return def ? `const ${def} = PosterCore;` : "";
    }
    diagnostics.push({
      severity: "warning",
      kind: "preprocess",
      message: `Import of "${module}" is not available in the sandbox and was ignored.`,
      line: lineOf(source, offset),
    });
    return "";
  });

  // export default <fn|class|expr>  ->  const __default = ...
  code = code
    .replace(/export\s+default\s+function\s*\(/g, "const __default = function (")
    .replace(/export\s+default\s+function\s+([A-Za-z0-9_$]+)/g, "const __default = function $1")
    .replace(/export\s+default\s+class\s+([A-Za-z0-9_$]+)/g, "const __default = class $1")
    .replace(/export\s+default\s+/g, "const __default = ");

  // Remaining named exports are meaningless in the sandbox scope.
  code = code.replace(/^[ \t]*export\s+(const|let|var|function|class)\b/gm, "$1");

  if (!/__default\s*=/.test(code) && !/function\s+Poster\b/.test(code)) {
    diagnostics.push({
      severity: "error",
      kind: "preprocess",
      message:
        "No poster component found. Add `export default function Poster() { ... }` to your code.",
    });
  }

  return { code, diagnostics };
}
