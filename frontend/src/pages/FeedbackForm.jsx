import { useState } from "react";
import { useParams } from "react-router-dom";
import client from "../api/client.js";
import GradeSelector from "../components/GradeSelector.jsx";

const LEVELS = ["", "New", "Beginner", "Intermediate", "Advanced"];
const GOALS = ["", "Flexibility", "Stress relief", "Strength", "Community", "Mindfulness"];

const RATING_FIELDS = [
  { key: "overall_rating", label: "Overall experience" },
  { key: "communication_rating", label: "Instructor communication" },
  { key: "pacing_rating", label: "Class pacing" },
  { key: "welcomed_rating", label: "How welcomed did you feel?" },
  { key: "community_rating", label: "Sense of community" },
  { key: "knowledge_rating", label: "Instructor's knowledge" },
];

const initialState = {
  overall_rating: 0,
  communication_rating: 0,
  pacing_rating: 0,
  welcomed_rating: 0,
  community_rating: 0,
  knowledge_rating: 0,
  recommend_score: 8,
  favorite_aspect: "",
  suggestions: "",
  is_returning_student: false,
  experience_level: "",
  neighborhood: "",
  primary_goal: "",
  consent_to_publish: false,
  display_name: "",
};

const fieldClass =
  "w-full border border-rule px-3 py-2.5 bg-paper focus:outline-none focus:border-ink";
const rowClass = "border border-rule bg-paper-raised p-4";

export default function FeedbackForm() {
  const { slug } = useParams();
  const [form, setForm] = useState(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const setRating = (key, value) => setForm({ ...form, [key]: value });

  const missingRating = RATING_FIELDS.some((f) => form[f.key] === 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (missingRating) {
      setError("Please grade every category before submitting.");
      return;
    }
    setBusy(true);
    try {
      await client.post(`/feedback/${slug}`, form);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.detail || "Could not submit feedback. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-24 text-center">
        <div className="stamp inline-block border-2 border-ink px-6 py-3">
          <p className="font-mono text-sm uppercase tracking-wide text-ink">Recorded</p>
        </div>
        <h1 className="text-2xl font-sans font-extrabold tracking-tightest text-ink mt-6">
          Thank you.
        </h1>
        <p className="text-ink-soft mt-3">
          Your anonymous feedback has been logged and will help your instructor improve future
          classes.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-sans font-extrabold tracking-tightest text-ink">
        How was class today?
      </h1>
      <p className="text-ink-soft text-sm mt-1">
        No account required — completely anonymous, takes about a minute.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {RATING_FIELDS.map((f) => (
          <div
            key={f.key}
            className={`${rowClass} flex flex-col gap-3 xs:flex-row xs:items-center xs:justify-between xs:gap-4`}
          >
            <p className="text-sm font-medium text-ink">{f.label}</p>
            <GradeSelector value={form[f.key]} onChange={(v) => setRating(f.key, v)} />
          </div>
        ))}

        <div className={rowClass}>
          <label className="text-sm font-medium text-ink mb-3 block">
            How likely are you to recommend this instructor to a friend?{" "}
            <span className="font-mono text-ledger-red">{form.recommend_score}/10</span>
          </label>
          <input
            type="range"
            min={0}
            max={10}
            value={form.recommend_score}
            onChange={(e) => setForm({ ...form, recommend_score: Number(e.target.value) })}
            className="w-full accent-ledger-red"
          />
        </div>

        <div className={rowClass}>
          <label className="text-sm font-medium text-ink mb-2 block">Favorite aspect of class</label>
          <textarea
            rows={3}
            value={form.favorite_aspect}
            onChange={(e) => setForm({ ...form, favorite_aspect: e.target.value })}
            className={fieldClass}
          />
        </div>

        <div className={rowClass}>
          <label className="text-sm font-medium text-ink mb-2 block">Suggestions for improvement</label>
          <textarea
            rows={3}
            value={form.suggestions}
            onChange={(e) => setForm({ ...form, suggestions: e.target.value })}
            className={fieldClass}
          />
        </div>

        <div className={rowClass}>
          <label className="flex items-center gap-2.5 text-sm text-ink">
            <input
              type="checkbox"
              checked={form.is_returning_student}
              onChange={(e) => setForm({ ...form, is_returning_student: e.target.checked })}
              className="accent-ink w-4 h-4"
            />
            I've taken this instructor's class before
          </label>
        </div>

        <div className={`${rowClass} space-y-4`}>
          <p className="text-[11px] uppercase tracking-wide font-mono text-ink-faint">Optional</p>
          <div>
            <label className="block text-sm text-ink mb-1.5">Experience level</label>
            <select
              value={form.experience_level}
              onChange={(e) => setForm({ ...form, experience_level: e.target.value })}
              className={fieldClass}
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l || "Prefer not to say"}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-ink mb-1.5">Neighborhood</label>
            <input
              value={form.neighborhood}
              onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
              className={fieldClass}
            />
          </div>
          <div>
            <label className="block text-sm text-ink mb-1.5">Primary wellness goal</label>
            <select
              value={form.primary_goal}
              onChange={(e) => setForm({ ...form, primary_goal: e.target.value })}
              className={fieldClass}
            >
              {GOALS.map((g) => (
                <option key={g} value={g}>
                  {g || "Prefer not to say"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={`${rowClass} space-y-3`}>
          <label className="flex items-center gap-2.5 text-sm text-ink">
            <input
              type="checkbox"
              checked={form.consent_to_publish}
              onChange={(e) => setForm({ ...form, consent_to_publish: e.target.checked })}
              className="accent-ink w-4 h-4"
            />
            I'm comfortable having my "favorite aspect" comment shown publicly as a testimonial
          </label>
          {form.consent_to_publish && (
            <div>
              <label className="block text-sm text-ink mb-1.5">
                Display name (optional, e.g. "Jamie R.")
              </label>
              <input
                value={form.display_name}
                onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                className={fieldClass}
                placeholder="Leave blank to stay anonymous"
              />
            </div>
          )}
        </div>

        {error && <p className="text-sm text-ledger-red font-mono">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="stamp w-full py-3.5 bg-ink text-paper font-mono text-sm uppercase tracking-wide hover:bg-ledger-red transition-colors disabled:opacity-60"
        >
          {busy ? "Submitting…" : "Submit feedback"}
        </button>
      </form>
    </div>
  );
}
