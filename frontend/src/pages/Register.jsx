import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const MODALITIES = ["Yoga", "Meditation", "Breathwork", "Pilates", "Mindfulness"];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: "", email: "", password: "", modality: "Yoga" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-3xl text-ink">Create your instructor account</h1>
      <p className="text-ink-soft text-sm mt-1.5">
        Your account is reviewed by an administrator before your public profile goes live.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5 bg-white border border-rule rounded-3xl p-7 shadow-sm">
        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5">Full name</label>
          <input
            required
            value={form.full_name}
            onChange={update("full_name")}
            className="w-full rounded-xl border border-rule px-4 py-3 bg-paper focus:outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={update("email")}
            className="w-full rounded-xl border border-rule px-4 py-3 bg-paper focus:outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5">Password</label>
          <input
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={update("password")}
            className="w-full rounded-xl border border-rule px-4 py-3 bg-paper focus:outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5">Practice type</label>
          <select
            value={form.modality}
            onChange={update("modality")}
            className="w-full rounded-xl border border-rule px-4 py-3 bg-paper focus:outline-none focus:border-accent"
          >
            {MODALITIES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="text-sm text-accent-dark">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full py-3.5 rounded-full bg-accent text-white text-sm font-semibold hover:bg-accent-dark transition-colors disabled:opacity-60"
        >
          {busy ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="text-sm text-ink-soft mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-accent font-semibold">
          Log in
        </Link>
      </p>
    </div>
  );
}
