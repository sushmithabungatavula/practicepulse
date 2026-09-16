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
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl text-ink">Find an instructor</h1>
      <p className="text-ink-soft text-sm mt-1.5">
        Verified reviews from real students across Chicago's wellness community.
      </p>

      <form onSubmit={handleSearch} className="mt-6 flex max-w-md gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or specialty..."
          className="flex-1 rounded-xl border border-rule px-4 py-3 bg-white focus:outline-none focus:border-accent"
        />
        <button
          type="submit"
          className="px-6 rounded-xl bg-ink text-white text-sm font-semibold hover:bg-accent transition-colors"
        >
          Search
        </button>
      </form>

      {loading ? (
        <p className="text-ink-faint mt-10">Loading…</p>
      ) : instructors.length === 0 ? (
        <p className="text-ink-faint mt-10">No instructors found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
          {instructors.map((i) => (
            <Link
              key={i.slug}
              to={`/instructors/${i.slug}`}
              className="bg-white border border-rule rounded-3xl p-5 hover:shadow-md hover:border-accent transition"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-full bg-paper overflow-hidden shrink-0">
                  {i.profile_photo_url && (
                    <img src={i.profile_photo_url} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="text-right">
                  <span className="font-display text-xl font-bold text-ink">
                    {i.average_rating > 0 ? i.average_rating.toFixed(1) : "—"}
                  </span>
                  <p className="text-[11px] text-ink-faint">{i.review_count} reviews</p>
                </div>
              </div>
              <h3 className="text-lg text-ink mt-4 font-semibold">{i.full_name}</h3>
              <p className="text-sm text-ink-faint mt-0.5">
                <span className="font-semibold text-accent text-[13px]">{i.modality}</span>
                {i.neighborhood && <span> · {i.neighborhood}</span>}
              </p>
              {i.specialties.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {i.specialties.slice(0, 3).map((s) => (
                    <span key={s} className="text-xs bg-paper text-ink-soft px-2.5 py-1 rounded-full">
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
