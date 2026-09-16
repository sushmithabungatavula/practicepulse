import { useState } from "react";
import { useParams } from "react-router-dom";
import client from "../api/client.js";
import StarRating from "../components/StarRating.jsx";

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
      setError("Please rate every category before submitting.");
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
      <div className="max-w-xl mx-auto px-6 py-24 text-center">
        <h1 className="text-2xl font-serif font-semibold text-sage-900">Thank you!</h1>
        <p className="text-sage-600 mt-3">
          Your anonymous feedback has been submitted and will help your instructor improve future
          classes.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-serif font-semibold text-sage-900">How was class today?</h1>
      <p className="text-sage-500 text-sm mt-1">
        Your feedback is completely anonymous. No account needed — it takes about a minute.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {RATING_FIELDS.map((f) => (
          <div key={f.key} className="bg-white rounded-2xl border border-sage-200 p-4">
            <p className="text-sm font-medium text-sage-700 mb-2">{f.label}</p>
            <StarRating value={form[f.key]} onChange={(v) => setRating(f.key, v)} />
          </div>
        ))}

        <div className="bg-white rounded-2xl border border-sage-200 p-4">
          <label className="text-sm font-medium text-sage-700 mb-2 block">
            How likely are you to recommend this instructor to a friend? ({form.recommend_score}/10)
          </label>
          <input
            type="range"
            min={0}
            max={10}
            value={form.recommend_score}
            onChange={(e) => setForm({ ...form, recommend_score: Number(e.target.value) })}
            className="w-full accent-clay-500"
          />
        </div>

        <div className="bg-white rounded-2xl border border-sage-200 p-4">
          <label className="text-sm font-medium text-sage-700 mb-2 block">Favorite aspect of class</label>
          <textarea
            rows={3}
            value={form.favorite_aspect}
            onChange={(e) => setForm({ ...form, favorite_aspect: e.target.value })}
            className="w-full rounded-lg border border-sage-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage-400"
          />
        </div>

        <div className="bg-white rounded-2xl border border-sage-200 p-4">
          <label className="text-sm font-medium text-sage-700 mb-2 block">Suggestions for improvement</label>
          <textarea
            rows={3}
            value={form.suggestions}
            onChange={(e) => setForm({ ...form, suggestions: e.target.value })}
            className="w-full rounded-lg border border-sage-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage-400"
          />
        </div>

        <div className="bg-white rounded-2xl border border-sage-200 p-4">
          <label className="flex items-center gap-2 text-sm text-sage-700">
            <input
              type="checkbox"
              checked={form.is_returning_student}
              onChange={(e) => setForm({ ...form, is_returning_student: e.target.checked })}
            />
            I've taken this instructor's class before
          </label>
        </div>

        <div className="bg-white rounded-2xl border border-sage-200 p-4 space-y-4">
          <p className="text-xs uppercase tracking-wide text-sage-500 font-medium">Optional</p>
          <div>
            <label className="block text-sm text-sage-700 mb-1">Experience level</label>
            <select
              value={form.experience_level}
              onChange={(e) => setForm({ ...form, experience_level: e.target.value })}
              className="w-full rounded-lg border border-sage-300 px-3 py-2"
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l || "Prefer not to say"}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-sage-700 mb-1">Neighborhood</label>
            <input
              value={form.neighborhood}
              onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
              className="w-full rounded-lg border border-sage-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-sage-700 mb-1">Primary wellness goal</label>
            <select
              value={form.primary_goal}
              onChange={(e) => setForm({ ...form, primary_goal: e.target.value })}
              className="w-full rounded-lg border border-sage-300 px-3 py-2"
            >
              {GOALS.map((g) => (
                <option key={g} value={g}>
                  {g || "Prefer not to say"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-sage-200 p-4 space-y-3">
          <label className="flex items-center gap-2 text-sm text-sage-700">
            <input
              type="checkbox"
              checked={form.consent_to_publish}
              onChange={(e) => setForm({ ...form, consent_to_publish: e.target.checked })}
            />
            I'm comfortable having my "favorite aspect" comment shown publicly as a testimonial
          </label>
          {form.consent_to_publish && (
            <div>
              <label className="block text-sm text-sage-700 mb-1">
                Display name (optional, e.g. "Jamie R.")
              </label>
              <input
                value={form.display_name}
                onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                className="w-full rounded-lg border border-sage-300 px-3 py-2"
                placeholder="Leave blank to stay anonymous"
              />
            </div>
          )}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="w-full py-3 rounded-full bg-clay-500 text-white font-medium hover:bg-clay-600 transition disabled:opacity-60"
        >
          {busy ? "Submitting..." : "Submit feedback"}
        </button>
      </form>
    </div>
  );
}
