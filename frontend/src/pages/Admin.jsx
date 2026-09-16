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
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-serif font-semibold text-sage-900">Administrator portal</h1>
        <button
          onClick={exportCsv}
          className="text-sm px-4 py-2 rounded-full border border-sage-300 text-sage-700 hover:bg-white"
        >
          Export platform metrics (CSV)
        </button>
      </div>

      {metrics && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
          <KPICard label="Total instructors" value={metrics.total_instructors} />
          <KPICard label="Pending approval" value={metrics.pending_instructors} accent="clay" />
          <KPICard label="Approved" value={metrics.approved_instructors} />
          <KPICard label="Total reviews" value={metrics.total_reviews} />
          <KPICard label="Platform avg rating" value={metrics.platform_average_rating} accent="clay" />
        </div>
      )}

      {message && <p className="text-sm text-sage-600 mt-4">{message}</p>}

      <div className="flex gap-2 mt-8 border-b border-sage-200">
        <TabButton active={tab === "instructors"} onClick={() => setTab("instructors")}>
          Instructors
        </TabButton>
        <TabButton active={tab === "reviews"} onClick={() => setTab("reviews")}>
          Reviews
        </TabButton>
      </div>

      {tab === "instructors" && (
        <div className="mt-6 bg-white rounded-2xl border border-sage-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-sage-50 text-sage-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Reviews</th>
                <th className="text-left px-4 py-3">Avg rating</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {instructors.map((i) => (
                <tr key={i.id} className="border-t border-sage-100">
                  <td className="px-4 py-3 font-medium text-sage-800">{i.full_name}</td>
                  <td className="px-4 py-3 text-sage-500">{i.email}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={i.status} />
                  </td>
                  <td className="px-4 py-3">{i.review_count}</td>
                  <td className="px-4 py-3">{i.average_rating || "-"}</td>
                  <td className="px-4 py-3 space-x-2">
                    {i.status !== "approved" && (
                      <button onClick={() => setStatus(i.id, "approved")} className="text-sage-700 hover:underline">
                        Approve
                      </button>
                    )}
                    {i.status !== "rejected" && (
                      <button onClick={() => setStatus(i.id, "rejected")} className="text-red-600 hover:underline">
                        Reject
                      </button>
                    )}
                    {i.status !== "suspended" && (
                      <button onClick={() => setStatus(i.id, "suspended")} className="text-clay-600 hover:underline">
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
            <div key={r.id} className="bg-white rounded-2xl border border-sage-200 p-4">
              <div className="flex justify-between gap-4">
                <div>
                  <div className="text-clay-500 text-sm">{"★".repeat(r.overall_rating)}</div>
                  {r.favorite_aspect && <p className="text-sm text-sage-700 mt-1">"{r.favorite_aspect}"</p>}
                  {r.suggestions && <p className="text-sm text-sage-500 mt-1">Suggestion: {r.suggestions}</p>}
                  <p className="text-xs text-sage-400 mt-2">{new Date(r.created_at).toLocaleDateString()}</p>
                </div>
                {removingId !== r.id && (
                  <button
                    onClick={() => startRemoveReview(r.id)}
                    className="text-red-600 text-sm hover:underline shrink-0 self-start"
                  >
                    Remove
                  </button>
                )}
              </div>
              {removingId === r.id && (
                <div className="mt-3 pt-3 border-t border-sage-100 space-y-2">
                  <label className="text-xs text-sage-500">Reason for removal (optional)</label>
                  <input
                    autoFocus
                    value={removalReason}
                    onChange={(e) => setRemovalReason(e.target.value)}
                    className="w-full rounded-lg border border-sage-300 px-3 py-1.5 text-sm"
                    placeholder="e.g. inappropriate content"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => confirmRemoveReview(r.id)}
                      className="text-sm px-3 py-1.5 rounded-full bg-red-600 text-white hover:bg-red-700"
                    >
                      Confirm removal
                    </button>
                    <button
                      onClick={cancelRemoveReview}
                      className="text-sm px-3 py-1.5 rounded-full border border-sage-300 text-sage-700 hover:bg-sage-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {reviews.length === 0 && <p className="text-sage-400">No reviews yet.</p>}
        </div>
      )}
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
        active ? "border-clay-500 text-sage-900" : "border-transparent text-sage-500"
      }`}
    >
      {children}
    </button>
  );
}

function StatusBadge({ status }) {
  const colors = {
    pending: "bg-clay-50 text-clay-700",
    approved: "bg-sage-100 text-sage-700",
    rejected: "bg-red-50 text-red-600",
    suspended: "bg-gray-100 text-gray-600",
  };
  return <span className={`text-xs px-2 py-1 rounded-full ${colors[status] || ""}`}>{status}</span>;
}
