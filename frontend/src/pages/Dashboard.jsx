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
    return <div className="max-w-6xl mx-auto px-6 py-16 text-red-600">{error}</div>;
  }
  if (!data) {
    return <div className="max-w-6xl mx-auto px-6 py-16 text-sage-500">Loading dashboard...</div>;
  }

  const hasReviews = data.review_count > 0;

  const trendData = {
    labels: data.monthly_trends.map((m) => m.month),
    datasets: [
      {
        label: "Average rating",
        data: data.monthly_trends.map((m) => m.average_rating),
        borderColor: "#4a664b",
        backgroundColor: "#4a664b33",
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
        backgroundColor: "#bd6f40",
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-sage-900">
            Welcome back, {user?.full_name?.split(" ")[0]}
          </h1>
          {user?.status === "pending" && (
            <p className="text-sm text-clay-600 mt-1">
              Your account is pending admin approval. Your dashboard already works — your public
              profile will go live once approved.
            </p>
          )}
        </div>
        {user?.slug && (
          <Link
            to={`/instructors/${user.slug}`}
            className="text-sm px-4 py-2 rounded-full border border-sage-300 text-sage-700 hover:bg-white"
          >
            View public profile
          </Link>
        )}
      </div>

      {!hasReviews ? (
        <div className="mt-10 bg-white rounded-2xl border border-sage-200 p-10 text-center">
          <p className="text-sage-600">
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <KPICard label="Average rating" value={data.average_rating.toFixed(2)} sub={`${data.review_count} reviews`} />
            <KPICard label="Satisfaction rate" value={`${data.satisfaction_rate}%`} sub="Rated 4-5 stars" accent="clay" />
            <KPICard label="Recommend rate" value={`${data.recommendation_rate}%`} sub={`NPS ${data.nps}`} />
            <KPICard
              label="Returning students"
              value={`${data.returning_student_rate}%`}
              sub={
                data.review_growth_pct !== null
                  ? `${data.review_growth_pct >= 0 ? "+" : ""}${data.review_growth_pct}% reviews vs prior 30 days`
                  : "Review growth: n/a"
              }
              accent="clay"
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-sage-200 p-6">
              <h2 className="font-serif text-lg font-semibold text-sage-800 mb-4">Monthly rating trend</h2>
              <Line data={trendData} options={{ scales: { y: { min: 0, max: 5 } }, plugins: { legend: { display: false } } }} />
            </div>
            <div className="bg-white rounded-2xl border border-sage-200 p-6 flex flex-col items-center justify-center">
              <p className="text-xs uppercase tracking-wide text-sage-500 font-medium mb-2">Engagement score</p>
              <p className="text-5xl font-serif font-semibold text-sage-800">{data.engagement_score}</p>
              <p className="text-xs text-sage-500 mt-2 text-center">
                Blend of satisfaction, recommendation, and retention (out of 100)
              </p>
              {user?.slug && (
                <div className="mt-6 w-full">
                  <QRCodeCard slug={user.slug} />
                </div>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mt-6">
            <div className="bg-white rounded-2xl border border-sage-200 p-6">
              <h2 className="font-serif text-lg font-semibold text-sage-800 mb-4">Experience breakdown</h2>
              <Bar data={breakdownData} options={{ scales: { y: { min: 0, max: 5 } }, plugins: { legend: { display: false } } }} />
            </div>
            <div className="grid grid-rows-2 gap-6">
              <ThemeList title="Most common positive themes" themes={data.positive_themes} />
              <ThemeList title="Most requested improvements" themes={data.improvement_themes} tone="clay" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ThemeList({ title, themes, tone = "sage" }) {
  const chipClass = tone === "clay" ? "bg-clay-50 text-clay-700" : "bg-sage-50 text-sage-700";
  return (
    <div className="bg-white rounded-2xl border border-sage-200 p-6">
      <h3 className="font-serif text-base font-semibold text-sage-800 mb-3">{title}</h3>
      {themes.length === 0 ? (
        <p className="text-sm text-sage-400">Not enough data yet</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {themes.map((t) => (
            <span key={t.word} className={`text-xs px-3 py-1.5 rounded-full ${chipClass}`}>
              {t.word} · {t.count}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
