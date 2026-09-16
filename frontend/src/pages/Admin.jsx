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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-start justify-between flex-wrap gap-3 border-b border-ink pb-4">
        <div>
          <h1 className="text-2xl font-sans font-extrabold tracking-tightest text-ink">
            Administrator portal
          </h1>
        </div>
        <button
          onClick={exportCsv}
          className="text-sm font-mono uppercase tracking-wide px-4 py-2 border border-ink text-ink hover:bg-ink hover:text-paper transition-colors"
        >
          Export CSV
        </button>
      </div>

      {metrics && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-px bg-rule border border-rule mt-6">
          <KPICard label="Total instructors" value={metrics.total_instructors} />
          <KPICard label="Pending approval" value={metrics.pending_instructors} accent />
          <KPICard label="Approved" value={metrics.approved_instructors} />
          <KPICard label="Total reviews" value={metrics.total_reviews} />
          <KPICard label="Platform avg rating" value={metrics.platform_average_rating} accent />
        </div>
      )}

      {message && <p className="text-sm text-ink font-mono mt-4">✓ {message}</p>}

      <div className="flex gap-6 mt-8 border-b border-ink font-mono text-sm uppercase tracking-wide">
        <TabButton active={tab === "instructors"} onClick={() => setTab("instructors")}>
          Instructors
        </TabButton>
        <TabButton active={tab === "reviews"} onClick={() => setTab("reviews")}>
          Reviews
        </TabButton>
      </div>

      {tab === "instructors" && (
        <div className="mt-6 border border-rule bg-paper-raised overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink font-mono text-[11px] uppercase tracking-wide text-ink-soft">
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
                <tr key={i.id} className="border-t border-rule">
                  <td className="px-4 py-3 font-medium text-ink">{i.full_name}</td>
                  <td className="px-4 py-3 text-ink-soft font-mono text-xs">{i.email}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={i.status} />
                  </td>
                  <td className="px-4 py-3 font-mono">{i.review_count}</td>
                  <td className="px-4 py-3 font-mono">{i.average_rating || "—"}</td>
                  <td className="px-4 py-3 space-x-3 font-mono text-xs uppercase tracking-wide">
                    {i.status !== "approved" && (
                      <button onClick={() => setStatus(i.id, "approved")} className="text-ink hover:text-ledger-red underline underline-offset-2">
                        Approve
                      </button>
                    )}
                    {i.status !== "rejected" && (
                      <button onClick={() => setStatus(i.id, "rejected")} className="text-ledger-red hover:underline underline-offset-2">
                        Reject
                      </button>
                    )}
                    {i.status !== "suspended" && (
                      <button onClick={() => setStatus(i.id, "suspended")} className="text-ink-soft hover:text-ink underline underline-offset-2">
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
        <div className="mt-6 divide-y divide-rule border border-rule bg-paper-raised">
          {reviews.map((r) => (
            <div key={r.id} className="p-4">
              <div className="flex justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-1 font-mono">
                    <span className="text-base font-bold text-ink">{r.overall_rating}</span>
                    <span className="text-xs text-ink-faint">/5</span>
                  </div>
                  {r.favorite_aspect && <p className="text-sm text-ink-soft mt-1">"{r.favorite_aspect}"</p>}
                  {r.suggestions && <p className="text-sm text-ink-faint mt-1">Suggestion: {r.suggestions}</p>}
                  <p className="text-xs text-ink-faint mt-2 font-mono">
                    {new Date(r.created_at).toLocaleDateString()}
                  </p>
                </div>
                {removingId !== r.id && (
                  <button
                    onClick={() => startRemoveReview(r.id)}
                    className="text-ledger-red text-xs font-mono uppercase tracking-wide hover:underline shrink-0 self-start"
                  >
                    Remove
                  </button>
                )}
              </div>
              {removingId === r.id && (
                <div className="mt-3 pt-3 border-t border-rule space-y-2">
                  <label className="text-[11px] uppercase tracking-wide font-mono text-ink-soft">
                    Reason for removal (optional)
                  </label>
                  <input
                    autoFocus
                    value={removalReason}
                    onChange={(e) => setRemovalReason(e.target.value)}
                    className="w-full border border-rule px-3 py-1.5 text-sm bg-paper focus:outline-none focus:border-ink"
                    placeholder="e.g. inappropriate content"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => confirmRemoveReview(r.id)}
                      className="text-xs font-mono uppercase tracking-wide px-3 py-1.5 bg-ledger-red text-paper hover:bg-ink transition-colors"
                    >
                      Confirm removal
                    </button>
                    <button
                      onClick={cancelRemoveReview}
                      className="text-xs font-mono uppercase tracking-wide px-3 py-1.5 border border-rule text-ink-soft hover:border-ink hover:text-ink transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {reviews.length === 0 && <p className="text-ink-faint font-mono p-4">No reviews yet.</p>}
        </div>
      )}
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`pb-2.5 -mb-px border-b-2 transition-colors ${
        active ? "border-ledger-red text-ink" : "border-transparent text-ink-faint hover:text-ink-soft"
      }`}
    >
      {children}
    </button>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: "border-ledger-red text-ledger-red",
    approved: "border-ink text-ink",
    rejected: "border-ink-faint text-ink-faint line-through",
    suspended: "border-ink-faint text-ink-faint",
  };
  return (
    <span className={`text-[11px] font-mono uppercase tracking-wide px-2 py-0.5 border ${styles[status] || ""}`}>
      {status}
    </span>
  );
}
