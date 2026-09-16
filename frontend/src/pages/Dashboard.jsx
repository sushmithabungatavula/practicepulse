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

const INK = "#201B15";
const ACCENT = "#E2522C";
const RULE = "#EFE4D2";
const SOFT = "#6B6255";

const chartFont = { family: "Poppins", size: 11 };

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
    return <div className="max-w-6xl mx-auto px-6 py-16 text-accent-dark">{error}</div>;
  }
  if (!data) {
    return <div className="max-w-6xl mx-auto px-6 py-16 text-ink-faint">Loading dashboard…</div>;
  }

  const hasReviews = data.review_count > 0;

  const trendData = {
    labels: data.monthly_trends.map((m) => m.month),
    datasets: [
      {
        label: "Average rating",
        data: data.monthly_trends.map((m) => m.average_rating),
        borderColor: ACCENT,
        backgroundColor: "rgba(226,82,44,0.08)",
        pointBackgroundColor: ACCENT,
        pointBorderColor: "#fff",
        pointRadius: 4,
        borderWidth: 3,
        tension: 0.35,
        fill: true,
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
        borderRadius: 8,
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
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-start justify-between flex-wrap gap-4 pb-6">
        <div>
          <h1 className="text-2xl text-ink">{user?.full_name}</h1>
          {user?.status === "pending" && (
            <p className="text-sm text-accent-dark mt-2">
              Pending admin approval — your dashboard already works; your public profile goes live once approved.
            </p>
          )}
        </div>
        {user?.slug && (
          <Link
            to={`/instructors/${user.slug}`}
            className="text-sm font-semibold px-5 py-2.5 rounded-full border border-rule text-ink hover:bg-accent hover:text-white hover:border-accent transition-colors"
          >
            View public profile
          </Link>
        )}
      </div>

      {!hasReviews ? (
        <div className="border border-rule bg-white rounded-3xl p-10 text-center">
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

          <div className="grid lg:grid-cols-3 gap-4 mt-4">
            <div className="lg:col-span-2 bg-white border border-rule rounded-3xl p-6">
              <h2 className="text-sm font-semibold text-ink mb-4">Monthly rating trend</h2>
              <Line data={trendData} options={chartOptions} />
            </div>
            <div className="bg-white border border-rule rounded-3xl p-6 flex flex-col items-center justify-center text-center">
              <p className="text-sm font-semibold text-ink-soft mb-2">Engagement score</p>
              <p className="font-display text-5xl font-bold text-accent">{data.engagement_score}</p>
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

          <div className="grid lg:grid-cols-2 gap-4 mt-4">
            <div className="bg-white border border-rule rounded-3xl p-6">
              <h2 className="text-sm font-semibold text-ink mb-4">Experience breakdown</h2>
              <Bar data={breakdownData} options={chartOptions} />
            </div>
            <div className="grid grid-rows-2 gap-4">
              <ThemeList title="Most common positive themes" themes={data.positive_themes} />
              <ThemeList title="Most requested improvements" themes={data.improvement_themes} tone="accent" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ThemeList({ title, themes, tone = "ink" }) {
  const chipClass = tone === "accent" ? "bg-accent-soft text-accent-dark" : "bg-paper text-ink-soft";
  return (
    <div className="bg-white border border-rule rounded-3xl p-6">
      <h3 className="text-sm font-semibold text-ink mb-4">{title}</h3>
      {themes.length === 0 ? (
        <p className="text-sm text-ink-faint">Not enough data yet</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {themes.map((t) => (
            <span key={t.word} className={`text-xs font-medium px-3 py-1.5 rounded-full ${chipClass}`}>
              {t.word} · {t.count}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
