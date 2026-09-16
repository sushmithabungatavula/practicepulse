import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
      navigate("/redirect");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-3xl text-ink">Log in</h1>
      <p className="text-ink-soft text-sm mt-1.5">Access your instructor dashboard or admin portal.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5 bg-white border border-rule rounded-3xl p-7 shadow-sm">
        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-rule px-4 py-3 bg-paper focus:outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-rule px-4 py-3 bg-paper focus:outline-none focus:border-accent"
          />
        </div>
        {error && <p className="text-sm text-accent-dark">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full py-3.5 rounded-full bg-accent text-white text-sm font-semibold hover:bg-accent-dark transition-colors disabled:opacity-60"
        >
          {busy ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="text-sm text-ink-soft mt-6">
        New here?{" "}
        <Link to="/register" className="text-accent font-semibold">
          Create an instructor account
        </Link>
      </p>
      <p className="text-xs text-ink-faint mt-8 border-t border-rule pt-4">
        Demo instructor login: sush@practicepulse.app / demo12345
      </p>
    </div>
  );
}
