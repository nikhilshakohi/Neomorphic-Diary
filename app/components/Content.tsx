"use client";

import { useState } from "react";
import "./../styles/entry.css";

type Props = { content: string; highlight?: string };

const CHAR_LIMIT = 180;

export default function Content({ content, highlight }: Props) {
  const [expanded, setExpanded] = useState(false);

  const charCount = content.length;
  const words = content.trim().split(/\s+/);
  const wordCount = words.length;

  const visibleContent = expanded
    ? content
    : content.slice(0, CHAR_LIMIT) + (charCount > CHAR_LIMIT ? "..." : "");

  function renderHighlighted(text: string, q?: string) {
    if (!q) return text;

    const words = q.trim().split(/\s+/);
    if (!words.length) return text;

    const re = new RegExp(`(${words.join("|")})`, "gi");

    return text
      .split(re)
      .map((p, i) => (re.test(p) ? <mark key={i}>{p}</mark> : p));
  }

  return (
    <>
      <div className="mt-2 text-md">
        <pre className="whitespace-pre-wrap break-word font-sans">
          {renderHighlighted(visibleContent, highlight)}
        </pre>
      </div>
      <div className="mt-2 flex items-center gap-3 text-sm opacity-80">
        {charCount > CHAR_LIMIT && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="bg-transparent shadow-none p-0"
          >
            {expanded ? "Less" : "More"}
          </button>
        )}
        ({wordCount} words)
      </div>
    </>
  );
}
