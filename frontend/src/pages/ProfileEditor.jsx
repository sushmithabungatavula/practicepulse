import { useEffect, useState } from "react";
import client from "../api/client.js";
import TagInput from "../components/TagInput.jsx";

const MODALITIES = ["Yoga", "Meditation", "Breathwork", "Pilates", "Mindfulness"];

export default function ProfileEditor() {
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    client.get("/instructors/me").then((res) => setProfile(res.data));
  }, []);

  if (!profile) {
    return <div className="max-w-3xl mx-auto px-6 py-16 text-sage-500">Loading...</div>;
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
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-serif font-semibold text-sage-900">Edit your profile</h1>
      <p className="text-sage-500 text-sm mt-1">
        This information appears on your public profile at /instructors/{profile.slug}
      </p>

      <form onSubmit={handleSave} className="mt-8 space-y-6 bg-white rounded-2xl border border-sage-200 p-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-1">Practice type</label>
            <select
              {...field("modality")}
              className="w-full rounded-lg border border-sage-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage-400"
            >
              {MODALITIES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-1">Neighborhood</label>
            <input
              {...field("neighborhood")}
              className="w-full rounded-lg border border-sage-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage-400"
              placeholder="e.g. Lincoln Park"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-sage-700 mb-1">Biography</label>
          <textarea
            {...field("bio")}
            rows={5}
            className="w-full rounded-lg border border-sage-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage-400"
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
            <label className="block text-sm font-medium text-sage-700 mb-1">Profile photo URL</label>
            <input
              {...field("profile_photo_url")}
              className="w-full rounded-lg border border-sage-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage-400"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-1">Website</label>
            <input
              {...field("website")}
              className="w-full rounded-lg border border-sage-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage-400"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-1">Instagram</label>
            <input
              {...field("instagram")}
              className="w-full rounded-lg border border-sage-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage-400"
              placeholder="@handle"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-1">Contact email</label>
            <input
              {...field("contact_email")}
              className="w-full rounded-lg border border-sage-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-1">Phone</label>
            <input
              {...field("phone")}
              className="w-full rounded-lg border border-sage-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage-400"
            />
          </div>
        </div>

        {message && <p className="text-sm text-sage-600">{message}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 rounded-full bg-clay-500 text-white font-medium hover:bg-clay-600 transition disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save profile"}
        </button>
      </form>
    </div>
  );
}
