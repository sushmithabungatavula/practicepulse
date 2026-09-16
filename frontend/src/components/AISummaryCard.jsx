import { useState } from "react";
import client from "../api/client.js";

export default function AISummaryCard() {
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  const generate = () => {
    setStatus("loading");
    setError("");
    client
      .post("/analytics/me/ai-summary")
      .then((res) => {
        setSummary(res.data);
        setStatus("done");
      })
      .catch((err) => {
        setError(err.response?.data?.detail || "Couldn't generate a summary right now.");
        setStatus("error");
      });
  };

  return (
    <div className="bg-white border border-rule rounded-3xl p-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-sm font-semibold text-ink">AI-assisted summary</h2>
          <p className="text-xs text-ink-faint mt-1">
            Reads your written feedback and pulls out themes and sentiment. Generated on demand,
            not automatically.
          </p>
        </div>
        <button
          onClick={generate}
          disabled={status === "loading"}
          className="text-sm font-semibold px-5 py-2.5 rounded-full bg-ink text-white hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          {status === "loading"
            ? "Generating…"
            : status === "done"
            ? "Regenerate"
            : "Generate summary"}
        </button>
      </div>

      {status === "error" && (
        <p className="text-sm text-accent-dark mt-4 bg-accent-soft rounded-2xl px-4 py-3">
          {error}
        </p>
      )}

      {status === "done" && summary && (
        <div className="mt-5 space-y-5">
          <p className="text-sm text-ink-soft leading-relaxed">{summary.result.summary}</p>

          <SentimentBar sentiment={summary.result.sentiment} />

          <div className="grid sm:grid-cols-2 gap-4">
            <ThemeGroup
              title="What students love"
              themes={summary.result.positive_themes}
              tone="ink"
            />
            <ThemeGroup
              title="Where to improve"
              themes={summary.result.improvement_themes}
              tone="accent"
            />
          </div>

          <p className="text-xs text-ink-faint">
            Based on {summary.reviews_analyzed} written review
            {summary.reviews_analyzed === 1 ? "" : "s"} · generated{" "}
            {new Date(summary.generated_at).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}

function SentimentBar({ sentiment }) {
  const segments = [
    { pct: sentiment.positive_pct, color: "#3F6B4A", label: "Positive" },
    { pct: sentiment.neutral_pct, color: "#B8AD98", label: "Neutral" },
    { pct: sentiment.negative_pct, color: "#E2522C", label: "Negative" },
  ];
  return (
    <div>
      <div className="flex h-3 rounded-full overflow-hidden bg-paper">
        {segments.map(
          (s) =>
            s.pct > 0 && (
              <div key={s.label} style={{ width: `${s.pct}%`, backgroundColor: s.color }} />
            )
        )}
      </div>
      <div className="flex gap-4 mt-2">
        {segments.map((s) => (
          <span key={s.label} className="text-xs text-ink-faint flex items-center gap-1.5">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            {s.label} {s.pct}%
          </span>
        ))}
      </div>
    </div>
  );
}

function ThemeGroup({ title, themes, tone }) {
  const chipClass = tone === "accent" ? "bg-accent-soft text-accent-dark" : "bg-paper text-ink-soft";
  return (
    <div>
      <h3 className="text-xs font-semibold text-ink mb-2">{title}</h3>
      {themes.length === 0 ? (
        <p className="text-xs text-ink-faint">None surfaced this round</p>
      ) : (
        <div className="space-y-2">
          {themes.map((t) => (
            <div key={t.label}>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${chipClass}`}>
                {t.label}
              </span>
              <p className="text-xs text-ink-faint mt-1 italic">"{t.quote}"</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
