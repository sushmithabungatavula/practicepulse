import { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import client from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import KPICard from "../components/KPICard.jsx";
import QRCodeCard from "../components/QRCodeCard.jsx";
import { Link } from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend);

const INK = "#141311";
const RED = "#A32E22";
const RULE = "#D9D6CC";
const SOFT = "#524F47";

const chartFont = { family: "Archivo", size: 11 };

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    client
      .get("/analytics/me")
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.detail || "Failed to load analytics"));
  }, []);

  if (error) {
    return <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-ledger-red font-mono">{error}</div>;
  }
  if (!data) {
    return <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-ink-faint font-mono">Loading ledger…</div>;
  }

  const hasReviews = data.review_count > 0;

  const trendData = {
    labels: data.monthly_trends.map((m) => m.month),
    datasets: [
      {
        label: "Average rating",
        data: data.monthly_trends.map((m) => m.average_rating),
        borderColor: INK,
        backgroundColor: "transparent",
        pointBackgroundColor: RED,
        pointBorderColor: RED,
        pointRadius: 3,
        borderWidth: 2,
        tension: 0,
      },
    ],
  };

  const breakdownData = {
    labels: ["Communication", "Pacing", "Welcomed", "Community", "Knowledge"],
    datasets: [
      {
        label: "Average score",
        data: [
          data.rating_breakdown.communication,
          data.rating_breakdown.pacing,
          data.rating_breakdown.welcomed,
          data.rating_breakdown.community,
          data.rating_breakdown.knowledge,
        ],
        backgroundColor: INK,
        borderRadius: 0,
        barThickness: 28,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: { min: 0, max: 5, ticks: { font: chartFont, color: SOFT }, grid: { color: RULE } },
      x: { ticks: { font: chartFont, color: SOFT }, grid: { display: false } },
    },
    plugins: { legend: { display: false } },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-start justify-between flex-wrap gap-3 border-b border-ink pb-4">
        <div>
          <h1 className="text-2xl font-sans font-extrabold tracking-tightest text-ink">
            {user?.full_name}
          </h1>
          {user?.status === "pending" && (
            <p className="text-sm text-ledger-red font-mono mt-2">
              Pending admin approval — your ledger already works; your public profile goes live once approved.
            </p>
          )}
        </div>
        {user?.slug && (
          <Link
            to={`/instructors/${user.slug}`}
            className="text-sm font-mono uppercase tracking-wide px-4 py-2 border border-ink text-ink hover:bg-ink hover:text-paper transition-colors"
          >
            View public profile
          </Link>
        )}
      </div>

      {!hasReviews ? (
        <div className="mt-10 border border-rule bg-paper-raised p-10 text-center">
          <p className="text-ink-soft">
            No feedback yet. Share your QR code with students after class to start collecting
            reviews.
          </p>
          {user?.slug && (
            <div className="mt-6 max-w-xs mx-auto">
              <QRCodeCard slug={user.slug} />
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-rule border border-rule mt-8">
            <KPICard label="Average rating" value={data.average_rating.toFixed(2)} sub={`${data.review_count} reviews`} />
            <KPICard label="Satisfaction rate" value={`${data.satisfaction_rate}%`} sub="Rated 4–5" accent />
            <KPICard label="Recommend rate" value={`${data.recommendation_rate}%`} sub={`NPS ${data.nps}`} />
            <KPICard
              label="Returning students"
              value={`${data.returning_student_rate}%`}
              sub={
                data.review_growth_pct !== null
                  ? `${data.review_growth_pct >= 0 ? "+" : ""}${data.review_growth_pct}% vs prior 30d`
                  : "Growth: n/a"
              }
              accent
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-px bg-rule border border-rule border-t-0 mt-0">
            <div className="lg:col-span-2 bg-paper-raised p-6">
              <h2 className="font-mono text-xs uppercase tracking-wide text-ink-soft border-b border-rule pb-2 mb-4">
                Monthly rating trend
              </h2>
              <Line data={trendData} options={chartOptions} />
            </div>
            <div className="bg-paper-raised p-6 flex flex-col items-center justify-center text-center">
              <p className="font-mono text-xs uppercase tracking-wide text-ink-soft mb-2">
                Engagement score
              </p>
              <div className="stamp inline-block">
                <p className="font-mono text-5xl font-bold text-ledger-red" data-numeral>
                  {data.engagement_score}
                </p>
              </div>
              <p className="text-xs text-ink-faint mt-3">
                Satisfaction, recommendation, and retention — out of 100
              </p>
              {user?.slug && (
                <div className="mt-6 w-full">
                  <QRCodeCard slug={user.slug} />
                </div>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-px bg-rule border border-rule border-t-0">
            <div className="bg-paper-raised p-6">
              <h2 className="font-mono text-xs uppercase tracking-wide text-ink-soft border-b border-rule pb-2 mb-4">
                Experience breakdown
              </h2>
              <Bar data={breakdownData} options={chartOptions} />
            </div>
            <div className="grid grid-rows-2 divide-y divide-rule">
              <ThemeList title="Most common positive themes" themes={data.positive_themes} />
              <ThemeList title="Most requested improvements" themes={data.improvement_themes} tone="red" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ThemeList({ title, themes, tone = "ink" }) {
  const chipClass =
    tone === "red" ? "border-ledger-red text-ledger-red" : "border-ink text-ink";
  return (
    <div className="bg-paper-raised p-6">
      <h3 className="font-mono text-xs uppercase tracking-wide text-ink-soft border-b border-rule pb-2 mb-4">
        {title}
      </h3>
      {themes.length === 0 ? (
        <p className="text-sm text-ink-faint">Not enough data yet</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {themes.map((t) => (
            <span key={t.word} className={`text-xs font-mono px-2.5 py-1 border ${chipClass}`}>
              {t.word} · {t.count}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
