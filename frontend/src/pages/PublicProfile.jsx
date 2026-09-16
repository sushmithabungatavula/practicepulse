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
    return <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-ink-faint font-mono">{error}</div>;
  }
  if (!profile) {
    return <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-ink-faint font-mono">Loading…</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="border border-ink bg-paper-raised">
        <div className="border-b border-rule px-6 py-2.5 flex items-baseline justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wide text-ink-soft">
            Instructor credential
          </span>
          <span className="font-mono text-[11px] text-ink-faint">#{profile.slug.slice(0, 8)}</span>
        </div>
        <div className="p-8 flex flex-col sm:flex-row gap-6">
          <div className="w-28 h-28 border border-rule bg-paper-sunken overflow-hidden shrink-0">
            {profile.profile_photo_url && (
              <img src={profile.profile_photo_url} alt={profile.full_name} className="w-full h-full object-cover" />
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-sans font-extrabold tracking-tightest text-ink">
              {profile.full_name}
            </h1>
            <p className="text-sm mt-1">
              <span className="font-mono uppercase tracking-wide text-ledger-red text-[11px]">
                {profile.modality}
              </span>
              {profile.neighborhood && <span className="text-ink-faint"> · {profile.neighborhood}, Chicago</span>}
            </p>

            <div className="flex items-baseline gap-3 mt-4">
              <span className="font-mono text-3xl font-bold text-ink" data-numeral>
                {profile.average_rating > 0 ? profile.average_rating.toFixed(2) : "—"}
              </span>
              <span className="font-mono text-sm text-ink-faint">/5</span>
              <span className="text-sm text-ink-soft">
                {profile.review_count} review{profile.review_count === 1 ? "" : "s"}
              </span>
            </div>

            <div className="flex flex-wrap gap-4 mt-4 text-sm font-mono">
              {profile.website && (
                <a href={profile.website} target="_blank" rel="noreferrer" className="text-ledger-red hover:underline">
                  Website
                </a>
              )}
              {profile.instagram && <span className="text-ink-soft">{profile.instagram}</span>}
              {profile.contact_email && (
                <a href={`mailto:${profile.contact_email}`} className="text-ledger-red hover:underline">
                  Contact
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {profile.bio && (
        <Section title="About">
          <p className="text-ink-soft leading-relaxed">{profile.bio}</p>
        </Section>
      )}

      {profile.certifications.length > 0 && (
        <Section title="Certifications">
          <ChipList items={profile.certifications} />
        </Section>
      )}

      {profile.specialties.length > 0 && (
        <Section title="Specialties">
          <ChipList items={profile.specialties} tone="red" />
        </Section>
      )}

      {profile.class_offerings.length > 0 && (
        <Section title="Class offerings">
          <ChipList items={profile.class_offerings} />
        </Section>
      )}

      {profile.gallery.length > 0 && (
        <Section title="Gallery">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {profile.gallery.map((url) => (
              <img key={url} src={url} alt="" className="aspect-square object-cover bg-paper-sunken border border-rule" />
            ))}
          </div>
        </Section>
      )}

      <Section title="What students are saying">
        {profile.testimonials.length === 0 ? (
          <p className="text-ink-faint text-sm">No published testimonials yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-px bg-rule border border-rule">
            {profile.testimonials.map((t) => (
              <div key={t.id} className="bg-paper-raised p-4">
                <div className="flex items-baseline gap-1.5 font-mono">
                  <span className="text-lg font-bold text-ink">{t.overall_rating}</span>
                  <span className="text-xs text-ink-faint">/5</span>
                </div>
                {t.favorite_aspect && <p className="text-sm text-ink-soft mt-2">"{t.favorite_aspect}"</p>}
                <p className="text-xs text-ink-faint mt-2 font-mono">— {t.display_name || "Anonymous student"}</p>
              </div>
            ))}
          </div>
        )}
      </Section>

      <div className="mt-10 text-center">
        <Link
          to={`/feedback/${profile.slug}`}
          className="stamp inline-block px-6 py-3 bg-ink text-paper font-mono text-sm uppercase tracking-wide hover:bg-ledger-red transition-colors"
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
      <h2 className="font-mono text-xs uppercase tracking-wide text-ink-soft border-b border-rule pb-2 mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}

function ChipList({ items, tone = "ink" }) {
  const chipClass = tone === "red" ? "border-ledger-red text-ledger-red" : "border-ink text-ink";
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className={`text-sm px-2.5 py-1 border ${chipClass}`}>
          {item}
        </span>
      ))}
    </div>
  );
}
