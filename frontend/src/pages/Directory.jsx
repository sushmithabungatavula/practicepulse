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
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-serif font-semibold text-sage-900">Find an instructor</h1>
      <p className="text-sage-500 text-sm mt-1">
        Verified reviews from real students across Chicago's wellness community.
      </p>

      <form onSubmit={handleSearch} className="mt-6 flex gap-2 max-w-md">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or specialty..."
          className="flex-1 rounded-lg border border-sage-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage-400"
        />
        <button type="submit" className="px-4 py-2 rounded-lg bg-sage-700 text-white text-sm hover:bg-sage-800">
          Search
        </button>
      </form>

      {loading ? (
        <p className="text-sage-400 mt-10">Loading...</p>
      ) : instructors.length === 0 ? (
        <p className="text-sage-400 mt-10">No instructors found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
          {instructors.map((i) => (
            <Link
              key={i.slug}
              to={`/instructors/${i.slug}`}
              className="bg-white rounded-2xl border border-sage-200 p-5 hover:shadow-md transition"
            >
              <div className="w-14 h-14 rounded-full bg-sage-100 overflow-hidden mb-3">
                {i.profile_photo_url && (
                  <img src={i.profile_photo_url} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <p className="text-xs uppercase tracking-wide text-clay-600 font-medium">{i.modality}</p>
              <h3 className="font-serif text-lg font-semibold text-sage-900 mt-1">{i.full_name}</h3>
              {i.neighborhood && <p className="text-sm text-sage-500">{i.neighborhood}</p>}
              <div className="flex items-center gap-2 mt-3 text-sm">
                <span className="text-clay-500">★ {i.average_rating > 0 ? i.average_rating.toFixed(1) : "New"}</span>
                <span className="text-sage-400">({i.review_count})</span>
              </div>
              {i.specialties.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {i.specialties.slice(0, 3).map((s) => (
                    <span key={s} className="text-xs bg-sage-100 text-sage-700 px-2 py-1 rounded-full">
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
