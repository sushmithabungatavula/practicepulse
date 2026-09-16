import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import client from "../api/client.js";

export default function PublicProfile() {
  const { slug } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    client
      .get(`/public/instructors/${slug}`)
      .then((res) => setProfile(res.data))
      .catch(() => setError("Instructor not found"));
  }, [slug]);

  if (error) {
    return <div className="max-w-3xl mx-auto px-6 py-16 text-sage-500">{error}</div>;
  }
  if (!profile) {
    return <div className="max-w-3xl mx-auto px-6 py-16 text-sage-500">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-white rounded-3xl border border-sage-200 p-8 flex flex-col sm:flex-row gap-6">
        <div className="w-28 h-28 rounded-full bg-sage-100 overflow-hidden shrink-0">
          {profile.profile_photo_url && (
            <img src={profile.profile_photo_url} alt={profile.full_name} className="w-full h-full object-cover" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wide text-clay-600 font-medium">{profile.modality}</p>
          <h1 className="text-3xl font-serif font-semibold text-sage-900 mt-1">{profile.full_name}</h1>
          {profile.neighborhood && <p className="text-sage-500 text-sm mt-1">{profile.neighborhood}, Chicago</p>}

          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1 text-clay-500 text-lg">
              {"★".repeat(Math.round(profile.average_rating))}
              {"☆".repeat(5 - Math.round(profile.average_rating))}
            </div>
            <span className="text-sm text-sage-600">
              {profile.average_rating > 0 ? profile.average_rating.toFixed(2) : "New"} · {profile.review_count} review
              {profile.review_count === 1 ? "" : "s"}
            </span>
          </div>

          <div className="flex flex-wrap gap-3 mt-4 text-sm">
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noreferrer" className="text-clay-600 hover:underline">
                Website
              </a>
            )}
            {profile.instagram && (
              <span className="text-sage-600">{profile.instagram}</span>
            )}
            {profile.contact_email && (
              <a href={`mailto:${profile.contact_email}`} className="text-clay-600 hover:underline">
                Contact
              </a>
            )}
          </div>
        </div>
      </div>

      {profile.bio && (
        <Section title="About">
          <p className="text-sage-700 leading-relaxed">{profile.bio}</p>
        </Section>
      )}

      {profile.certifications.length > 0 && (
        <Section title="Certifications">
          <ChipList items={profile.certifications} />
        </Section>
      )}

      {profile.specialties.length > 0 && (
        <Section title="Specialties">
          <ChipList items={profile.specialties} tone="clay" />
        </Section>
      )}

      {profile.class_offerings.length > 0 && (
        <Section title="Class offerings">
          <ChipList items={profile.class_offerings} />
        </Section>
      )}

      {profile.gallery.length > 0 && (
        <Section title="Gallery">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {profile.gallery.map((url) => (
              <img key={url} src={url} alt="" className="rounded-xl aspect-square object-cover bg-sage-100" />
            ))}
          </div>
        </Section>
      )}

      <Section title="What students are saying">
        {profile.testimonials.length === 0 ? (
          <p className="text-sage-400 text-sm">No published testimonials yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {profile.testimonials.map((t) => (
              <div key={t.id} className="bg-white rounded-2xl border border-sage-200 p-4">
                <div className="text-clay-500">{"★".repeat(t.overall_rating)}</div>
                {t.favorite_aspect && <p className="text-sm text-sage-700 mt-2">"{t.favorite_aspect}"</p>}
                <p className="text-xs text-sage-400 mt-2">— {t.display_name || "Anonymous student"}</p>
              </div>
            ))}
          </div>
        )}
      </Section>

      <div className="mt-10 text-center">
        <Link
          to={`/feedback/${profile.slug}`}
          className="inline-block px-5 py-2.5 rounded-full bg-clay-500 text-white font-medium hover:bg-clay-600 transition"
        >
          Leave anonymous feedback
        </Link>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mt-8">
      <h2 className="font-serif text-lg font-semibold text-sage-800 mb-3">{title}</h2>
      {children}
    </div>
  );
}

function ChipList({ items, tone = "sage" }) {
  const chipClass = tone === "clay" ? "bg-clay-50 text-clay-700" : "bg-sage-100 text-sage-700";
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className={`text-sm px-3 py-1.5 rounded-full ${chipClass}`}>
          {item}
        </span>
      ))}
    </div>
  );
}
