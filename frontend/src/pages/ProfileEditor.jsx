import { useEffect, useState } from "react";
import client from "../api/client.js";
import TagInput from "../components/TagInput.jsx";

const MODALITIES = ["Yoga", "Meditation", "Breathwork", "Pilates", "Mindfulness"];

const fieldClass =
  "w-full border border-rule px-3 py-2.5 bg-paper focus:outline-none focus:border-ink";
const labelClass = "block text-[11px] uppercase tracking-wide font-mono text-ink-soft mb-1.5";

export default function ProfileEditor() {
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    client.get("/instructors/me").then((res) => setProfile(res.data));
  }, []);

  if (!profile) {
    return <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-ink-faint font-mono">Loading…</div>;
  }

  const field = (key) => ({
    value: profile[key],
    onChange: (e) => setProfile({ ...profile, [key]: e.target.value }),
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const { id, slug, full_name, ...payload } = profile;
      const { data } = await client.put("/instructors/me", payload);
      setProfile(data);
      setMessage("Profile saved");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-sans font-extrabold tracking-tightest text-ink">Edit your profile</h1>
      <p className="text-ink-soft text-sm mt-1">
        This information appears on your public profile at /instructors/{profile.slug}
      </p>

      <form onSubmit={handleSave} className="mt-8 space-y-6 border border-rule bg-paper-raised p-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Practice type</label>
            <select {...field("modality")} className={fieldClass}>
              {MODALITIES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Neighborhood</label>
            <input {...field("neighborhood")} className={fieldClass} placeholder="e.g. Lincoln Park" />
          </div>
        </div>

        <div>
          <label className={labelClass}>Biography</label>
          <textarea
            {...field("bio")}
            rows={5}
            className={fieldClass}
            placeholder="Tell students about your teaching style and background..."
          />
        </div>

        <TagInput
          label="Certifications"
          values={profile.certifications}
          onChange={(v) => setProfile({ ...profile, certifications: v })}
          placeholder="e.g. RYT-500"
        />
        <TagInput
          label="Specialties"
          values={profile.specialties}
          onChange={(v) => setProfile({ ...profile, specialties: v })}
          placeholder="e.g. Vinyasa Flow"
        />
        <TagInput
          label="Class offerings"
          values={profile.class_offerings}
          onChange={(v) => setProfile({ ...profile, class_offerings: v })}
          placeholder="e.g. Sunset Yin"
        />
        <TagInput
          label="Photo gallery (image URLs)"
          values={profile.gallery}
          onChange={(v) => setProfile({ ...profile, gallery: v })}
          placeholder="https://..."
        />

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Profile photo URL</label>
            <input {...field("profile_photo_url")} className={fieldClass} placeholder="https://..." />
          </div>
          <div>
            <label className={labelClass}>Website</label>
            <input {...field("website")} className={fieldClass} placeholder="https://..." />
          </div>
          <div>
            <label className={labelClass}>Instagram</label>
            <input {...field("instagram")} className={fieldClass} placeholder="@handle" />
          </div>
          <div>
            <label className={labelClass}>Contact email</label>
            <input {...field("contact_email")} className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input {...field("phone")} className={fieldClass} />
          </div>
        </div>

        {message && <p className="text-sm text-ink font-mono">✓ {message}</p>}
        {error && <p className="text-sm text-ledger-red font-mono">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="stamp px-6 py-3 bg-ink text-paper font-mono text-sm uppercase tracking-wide hover:bg-ledger-red transition-colors disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save profile"}
        </button>
      </form>
    </div>
  );
}
