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
      <label className="block text-sm font-semibold text-ink mb-2">{label}</label>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {values.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 bg-accent-soft text-accent-dark text-sm px-3 py-1.5 rounded-full"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-accent-dark/70 hover:text-accent-dark leading-none"
              aria-label={`Remove ${tag}`}
            >
              ✕
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
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
          className="flex-1 rounded-xl border border-rule px-4 py-2.5 text-sm bg-paper-raised focus:outline-none focus:border-accent"
        />
        <button
          type="button"
          onClick={addTag}
          className="px-5 text-sm font-semibold rounded-xl border border-rule text-ink hover:bg-accent hover:text-white hover:border-accent transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
}
