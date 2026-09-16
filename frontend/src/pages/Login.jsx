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
    <div className="max-w-md mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-sans font-extrabold tracking-tightest text-ink">Log in</h1>
      <p className="text-ink-soft text-sm mt-1">Access your instructor ledger or admin portal.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5 border border-rule bg-paper-raised p-6">
        <div>
          <label className="block text-[11px] uppercase tracking-wide font-mono text-ink-soft mb-1.5">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-rule px-3 py-2.5 bg-paper focus:outline-none focus:border-ink"
          />
        </div>
        {error && <p className="text-sm text-ledger-red font-mono">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="stamp w-full py-3 bg-ink text-paper font-mono text-sm uppercase tracking-wide hover:bg-ledger-red transition-colors disabled:opacity-60"
        >
          {busy ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="text-sm text-ink-soft mt-6">
        New here?{" "}
        <Link to="/register" className="text-ledger-red font-medium">
          Create an instructor account
        </Link>
      </p>
      <p className="text-xs text-ink-faint mt-8 border-t border-rule pt-4 font-mono">
        Demo instructor login: maya@practicepulse.app / demo12345
      </p>
    </div>
  );
}
