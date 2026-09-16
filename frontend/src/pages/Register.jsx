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
    <div className="max-w-md mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-sans font-extrabold tracking-tightest text-ink">
        Create your instructor account
      </h1>
      <p className="text-ink-soft text-sm mt-1">
        Your account is reviewed by an administrator before your public profile goes live.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5 border border-rule bg-paper-raised p-6">
        <div>
          <label className="block text-[11px] uppercase tracking-wide font-mono text-ink-soft mb-1.5">
            Full name
          </label>
          <input
            required
            value={form.full_name}
            onChange={update("full_name")}
            className="w-full border border-rule px-3 py-2.5 bg-paper focus:outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="block text-[11px] uppercase tracking-wide font-mono text-ink-soft mb-1.5">
            Email
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={update("email")}
            className="w-full border border-rule px-3 py-2.5 bg-paper focus:outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="block text-[11px] uppercase tracking-wide font-mono text-ink-soft mb-1.5">
            Password
          </label>
          <input
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={update("password")}
            className="w-full border border-rule px-3 py-2.5 bg-paper focus:outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="block text-[11px] uppercase tracking-wide font-mono text-ink-soft mb-1.5">
            Practice type
          </label>
          <select
            value={form.modality}
            onChange={update("modality")}
            className="w-full border border-rule px-3 py-2.5 bg-paper focus:outline-none focus:border-ink"
          >
            {MODALITIES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="text-sm text-ledger-red font-mono">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="stamp w-full py-3 bg-ink text-paper font-mono text-sm uppercase tracking-wide hover:bg-ledger-red transition-colors disabled:opacity-60"
        >
          {busy ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="text-sm text-ink-soft mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-ledger-red font-medium">
          Log in
        </Link>
      </p>
    </div>
  );
}
