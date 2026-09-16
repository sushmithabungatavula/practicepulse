import { useState } from "react";

export default function TagInput({ label, values, onChange, placeholder }) {
  const [draft, setDraft] = useState("");

  const addTag = () => {
    const v = draft.trim();
    if (v && !values.includes(v)) {
      onChange([...values, v]);
    }
    setDraft("");
  };

  const removeTag = (tag) => {
    onChange(values.filter((v) => v !== tag));
  };

  return (
    <div>
      <label className="block text-[11px] uppercase tracking-wide font-mono text-ink-soft mb-2">
        {label}
      </label>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {values.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 border border-ink text-ink text-sm px-2.5 py-1"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-ink-faint hover:text-ledger-red leading-none"
              aria-label={`Remove ${tag}`}
            >
              ✕
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-0">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
          placeholder={placeholder}
          className="flex-1 border border-rule border-r-0 px-3 py-2 text-sm bg-paper-raised focus:outline-none focus:border-ink"
        />
        <button
          type="button"
          onClick={addTag}
          className="px-4 text-sm font-mono uppercase tracking-wide border border-ink text-ink hover:bg-ink hover:text-paper transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
}
