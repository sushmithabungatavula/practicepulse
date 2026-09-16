import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../api/client.js";

export default function Directory() {
  const [instructors, setInstructors] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  const load = (query = "") => {
    setLoading(true);
    client
      .get("/public/instructors", { params: { q: query } })
      .then((res) => setInstructors(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    load(q);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-sans font-extrabold tracking-tightest text-ink">Find an instructor</h1>
      <p className="text-ink-soft text-sm mt-1">
        Verified reviews from real students across Chicago's wellness community.
      </p>

      <form onSubmit={handleSearch} className="mt-6 flex max-w-md">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or specialty..."
          className="flex-1 border border-rule border-r-0 px-3 py-2.5 bg-paper-raised focus:outline-none focus:border-ink"
        />
        <button
          type="submit"
          className="px-5 font-mono text-sm uppercase tracking-wide border border-ink text-ink hover:bg-ink hover:text-paper transition-colors"
        >
          Search
        </button>
      </form>

      {loading ? (
        <p className="text-ink-faint font-mono mt-10">Loading…</p>
      ) : instructors.length === 0 ? (
        <p className="text-ink-faint font-mono mt-10">No instructors found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-rule border border-rule mt-8">
          {instructors.map((i) => (
            <Link
              key={i.slug}
              to={`/instructors/${i.slug}`}
              className="bg-paper-raised p-5 hover:bg-paper transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 border border-rule bg-paper-sunken overflow-hidden shrink-0">
                  {i.profile_photo_url && (
                    <img src={i.profile_photo_url} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="text-right">
                  <span className="font-mono text-xl font-bold text-ink" data-numeral>
                    {i.average_rating > 0 ? i.average_rating.toFixed(1) : "—"}
                  </span>
                  <p className="font-mono text-[11px] text-ink-faint">{i.review_count} reviews</p>
                </div>
              </div>
              <h3 className="font-sans font-extrabold tracking-tightest text-lg text-ink mt-4">
                {i.full_name}
              </h3>
              <p className="text-sm text-ink-faint mt-0.5">
                <span className="font-mono uppercase tracking-wide text-ledger-red text-[11px]">
                  {i.modality}
                </span>
                {i.neighborhood && <span> · {i.neighborhood}</span>}
              </p>
              {i.specialties.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {i.specialties.slice(0, 3).map((s) => (
                    <span key={s} className="text-xs font-mono border border-rule text-ink-soft px-2 py-0.5">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
