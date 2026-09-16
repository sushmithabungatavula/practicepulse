import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login, user } = useAuth();
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
      <h1 className="text-2xl font-serif font-semibold text-sage-900">Log in</h1>
      <p className="text-sage-500 text-sm mt-1">Access your instructor dashboard or admin portal.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-sage-700 mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-sage-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-sage-700 mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-sage-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage-400"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full py-2.5 rounded-full bg-clay-500 text-white font-medium hover:bg-clay-600 transition disabled:opacity-60"
        >
          {busy ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="text-sm text-sage-500 mt-6">
        New here?{" "}
        <Link to="/register" className="text-clay-600 font-medium">
          Create an instructor account
        </Link>
      </p>
      <p className="text-xs text-sage-400 mt-8 border-t border-sage-200 pt-4">
        Demo instructor login: maya@practicepulse.app / demo12345
      </p>
    </div>
  );
}
