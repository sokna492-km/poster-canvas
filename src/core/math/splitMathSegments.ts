/**
 * Split a string into plain text and TeX math segments.
 * Keep in sync with public/sandbox/splitMathSegments.js.
 *
 * Delimiter priority: $$…$$, \[…\], \(…\), $…$
 * A lone `$` without a closing `$` (e.g. prices like `$50`) stays text.
 * Escaped `\$` is not treated as a delimiter.
 */

export type MathSegment =
  | { type: "text"; value: string }
  | { type: "math"; value: string; display: boolean };

function unescapeDollars(text: string): string {
  return text.replace(/\\\$/g, "$");
}

/**
 * Parse mixed prose + TeX delimiters into ordered segments.
 */
export function splitMathSegments(input: string): MathSegment[] {
  if (!input) return [{ type: "text", value: "" }];

  const segments: MathSegment[] = [];
  let i = 0;
  let textStart = 0;

  const pushText = (end: number) => {
    if (end > textStart) {
      segments.push({ type: "text", value: unescapeDollars(input.slice(textStart, end)) });
    }
  };

  while (i < input.length) {
    if (input[i] === "\\" && input[i + 1] === "$") {
      i += 2;
      continue;
    }

    if (input.startsWith("$$", i)) {
      const end = input.indexOf("$$", i + 2);
      if (end !== -1) {
        pushText(i);
        segments.push({ type: "math", value: input.slice(i + 2, end), display: true });
        i = end + 2;
        textStart = i;
        continue;
      }
    }

    if (input.startsWith("\\[", i)) {
      const end = input.indexOf("\\]", i + 2);
      if (end !== -1) {
        pushText(i);
        segments.push({ type: "math", value: input.slice(i + 2, end), display: true });
        i = end + 2;
        textStart = i;
        continue;
      }
    }

    if (input.startsWith("\\(", i)) {
      const end = input.indexOf("\\)", i + 2);
      if (end !== -1) {
        pushText(i);
        segments.push({ type: "math", value: input.slice(i + 2, end), display: false });
        i = end + 2;
        textStart = i;
        continue;
      }
    }

    if (input[i] === "$" && input[i + 1] !== "$") {
      let j = i + 1;
      let closed = false;
      while (j < input.length) {
        if (input[j] === "\\" && input[j + 1] === "$") {
          j += 2;
          continue;
        }
        if (input[j] === "$") {
          pushText(i);
          segments.push({ type: "math", value: input.slice(i + 1, j), display: false });
          i = j + 1;
          textStart = i;
          closed = true;
          break;
        }
        j += 1;
      }
      if (!closed) i += 1;
      continue;
    }

    i += 1;
  }

  pushText(input.length);
  return segments.length > 0 ? segments : [{ type: "text", value: unescapeDollars(input) }];
}
