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
      <h1 className="text-2xl font-serif font-semibold text-sage-900">Create your instructor account</h1>
      <p className="text-sage-500 text-sm mt-1">
        Your account will be reviewed by an administrator before your public profile goes live.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-sage-700 mb-1">Full name</label>
          <input
            required
            value={form.full_name}
            onChange={update("full_name")}
            className="w-full rounded-lg border border-sage-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-sage-700 mb-1">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={update("email")}
            className="w-full rounded-lg border border-sage-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-sage-700 mb-1">Password</label>
          <input
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={update("password")}
            className="w-full rounded-lg border border-sage-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-sage-700 mb-1">Practice type</label>
          <select
            value={form.modality}
            onChange={update("modality")}
            className="w-full rounded-lg border border-sage-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage-400"
          >
            {MODALITIES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full py-2.5 rounded-full bg-clay-500 text-white font-medium hover:bg-clay-600 transition disabled:opacity-60"
        >
          {busy ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="text-sm text-sage-500 mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-clay-600 font-medium">
          Log in
        </Link>
      </p>
    </div>
  );
}
