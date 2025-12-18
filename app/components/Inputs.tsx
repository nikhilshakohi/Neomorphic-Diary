"use client";

import { useState, FormEvent } from "react";

export default function Inputs() {
  const [expanded, setExpanded] = useState(false);

  const handleTextArea = (e: FormEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  return (
    <div>
      <textarea
        rows={2}
        placeholder="How was today?"
        onFocus={() => setExpanded(true)}
        onInput={handleTextArea}
      />

      {expanded && (
        <div className="meta-box">
          <div className="meta-input">
            <input type="date" />
            <input type="text" placeholder="Title" />
          </div>
          <div className="actions">
            <button>Add</button>
            <button className="danger-text" onClick={() => setExpanded(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
