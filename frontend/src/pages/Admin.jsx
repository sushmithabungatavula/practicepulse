import { useEffect, useState } from "react";
import client from "../api/client.js";
import KPICard from "../components/KPICard.jsx";

export default function Admin() {
  const [metrics, setMetrics] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [tab, setTab] = useState("instructors");
  const [message, setMessage] = useState("");
  const [removingId, setRemovingId] = useState(null);
  const [removalReason, setRemovalReason] = useState("");

  const loadAll = () => {
    client.get("/admin/metrics").then((res) => setMetrics(res.data));
    client.get("/admin/instructors").then((res) => setInstructors(res.data));
    client.get("/admin/reviews").then((res) => setReviews(res.data));
  };

  useEffect(() => {
    loadAll();
  }, []);

  const setStatus = async (userId, newStatus) => {
    await client.put(`/admin/instructors/${userId}/status`, null, { params: { new_status: newStatus } });
    setMessage(`Instructor ${newStatus}`);
    loadAll();
  };

  const startRemoveReview = (reviewId) => {
    setRemovingId(reviewId);
    setRemovalReason("");
  };

  const cancelRemoveReview = () => {
    setRemovingId(null);
    setRemovalReason("");
  };

  const confirmRemoveReview = async (reviewId) => {
    await client.delete(`/admin/reviews/${reviewId}`, { params: { reason: removalReason } });
    setMessage("Review removed");
    setRemovingId(null);
    setRemovalReason("");
    loadAll();
  };

  const exportCsv = () => {
    window.open("/api/admin/export", "_blank");
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-start justify-between flex-wrap gap-4 pb-6">
        <h1 className="text-2xl text-ink">Administrator portal</h1>
        <button
          onClick={exportCsv}
          className="text-sm font-semibold px-5 py-2.5 rounded-full border border-rule text-ink hover:bg-accent hover:text-white hover:border-accent transition-colors"
        >
          Export CSV
        </button>
      </div>

      {metrics && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <KPICard label="Total instructors" value={metrics.total_instructors} />
          <KPICard label="Pending approval" value={metrics.pending_instructors} accent />
          <KPICard label="Approved" value={metrics.approved_instructors} />
          <KPICard label="Total reviews" value={metrics.total_reviews} />
          <KPICard label="Platform avg rating" value={metrics.platform_average_rating} accent />
        </div>
      )}

      {message && <p className="text-sm text-accent font-semibold mt-4">✓ {message}</p>}

      <div className="flex gap-6 mt-8 border-b border-rule">
        <TabButton active={tab === "instructors"} onClick={() => setTab("instructors")}>
          Instructors
        </TabButton>
        <TabButton active={tab === "reviews"} onClick={() => setTab("reviews")}>
          Reviews
        </TabButton>
      </div>

      {tab === "instructors" && (
        <div className="mt-6 border border-rule bg-white rounded-3xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-rule text-xs font-semibold text-ink-soft">
                <th className="text-left px-5 py-4">Name</th>
                <th className="text-left px-5 py-4">Email</th>
                <th className="text-left px-5 py-4">Status</th>
                <th className="text-left px-5 py-4">Reviews</th>
                <th className="text-left px-5 py-4">Avg rating</th>
                <th className="text-left px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {instructors.map((i) => (
                <tr key={i.id} className="border-t border-rule">
                  <td className="px-5 py-4 font-semibold text-ink">{i.full_name}</td>
                  <td className="px-5 py-4 text-ink-soft text-xs">{i.email}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={i.status} />
                  </td>
                  <td className="px-5 py-4">{i.review_count}</td>
                  <td className="px-5 py-4">{i.average_rating || "—"}</td>
                  <td className="px-5 py-4 space-x-4 text-xs font-semibold">
                    {i.status !== "approved" && (
                      <button onClick={() => setStatus(i.id, "approved")} className="text-accent hover:underline">
                        Approve
                      </button>
                    )}
                    {i.status !== "rejected" && (
                      <button onClick={() => setStatus(i.id, "rejected")} className="text-ink-faint hover:text-ink hover:underline">
                        Reject
                      </button>
                    )}
                    {i.status !== "suspended" && (
                      <button onClick={() => setStatus(i.id, "suspended")} className="text-ink-faint hover:text-ink hover:underline">
                        Suspend
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "reviews" && (
        <div className="mt-6 space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white border border-rule rounded-2xl p-5">
              <div className="flex justify-between gap-4">
                <div>
                  <div className="text-accent">{"★".repeat(r.overall_rating)}{"☆".repeat(5 - r.overall_rating)}</div>
                  {r.favorite_aspect && <p className="text-sm text-ink-soft mt-1.5">"{r.favorite_aspect}"</p>}
                  {r.suggestions && <p className="text-sm text-ink-faint mt-1">Suggestion: {r.suggestions}</p>}
                  <p className="text-xs text-ink-faint mt-2">
                    {new Date(r.created_at).toLocaleDateString()}
                  </p>
                </div>
                {removingId !== r.id && (
                  <button
                    onClick={() => startRemoveReview(r.id)}
                    className="text-ink-faint text-xs font-semibold hover:text-accent-dark shrink-0 self-start"
                  >
                    Remove
                  </button>
                )}
              </div>
              {removingId === r.id && (
                <div className="mt-4 pt-4 border-t border-rule space-y-2">
                  <label className="text-xs font-semibold text-ink-soft">Reason for removal (optional)</label>
                  <input
                    autoFocus
                    value={removalReason}
                    onChange={(e) => setRemovalReason(e.target.value)}
                    className="w-full rounded-xl border border-rule px-3 py-2 text-sm bg-paper focus:outline-none focus:border-accent"
                    placeholder="e.g. inappropriate content"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => confirmRemoveReview(r.id)}
                      className="text-xs font-semibold px-4 py-2 rounded-full bg-accent text-white hover:bg-accent-dark transition-colors"
                    >
                      Confirm removal
                    </button>
                    <button
                      onClick={cancelRemoveReview}
                      className="text-xs font-semibold px-4 py-2 rounded-full border border-rule text-ink-soft hover:border-accent hover:text-ink transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {reviews.length === 0 && <p className="text-ink-faint">No reviews yet.</p>}
        </div>
      )}
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`pb-3 -mb-px border-b-2 text-sm font-semibold transition-colors ${
        active ? "border-accent text-ink" : "border-transparent text-ink-faint hover:text-ink-soft"
      }`}
    >
      {children}
    </button>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-accent-soft text-accent-dark",
    approved: "bg-paper text-ink",
    rejected: "bg-paper text-ink-faint line-through",
    suspended: "bg-paper text-ink-faint",
  };
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${styles[status] || ""}`}>
      {status}
    </span>
  );
}
