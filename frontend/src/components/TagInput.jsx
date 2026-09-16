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
      <label className="block text-sm font-medium text-sage-700 mb-1">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {values.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 bg-sage-100 text-sage-800 text-sm px-3 py-1 rounded-full"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-sage-500 hover:text-clay-600"
            >
              ×
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
          className="flex-1 rounded-lg border border-sage-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
        />
        <button
          type="button"
          onClick={addTag}
          className="px-3 py-2 text-sm rounded-lg border border-sage-300 text-sage-700 hover:bg-sage-50"
        >
          Add
        </button>
      </div>
    </div>
  );
}
