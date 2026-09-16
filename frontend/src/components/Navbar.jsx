import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-20 bg-paper/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3">
          <Link to="/" className="flex items-baseline gap-2.5 group shrink-0">
            <span className="font-mono text-xs font-bold text-ledger-red border border-ledger-red px-1 leading-none py-0.5">
              PP
            </span>
            <span className="hidden xs:inline font-sans text-lg font-extrabold tracking-tightest text-ink">
              PracticePulse
            </span>
          </Link>
          <nav className="flex items-center gap-3 sm:gap-5 text-xs sm:text-sm font-mono uppercase tracking-wide">
            <Link to="/directory" className="whitespace-nowrap text-ink-soft hover:text-ink transition-colors">
              Directory
            </Link>
            {!user && (
              <>
                <Link to="/login" className="whitespace-nowrap text-ink-soft hover:text-ink transition-colors">
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="whitespace-nowrap px-3 sm:px-3.5 py-1.5 bg-ink text-paper hover:bg-ledger-red transition-colors"
                >
                  Join
                </Link>
              </>
            )}
            {user && user.role === "instructor" && (
              <>
                <Link to="/dashboard" className="whitespace-nowrap text-ink-soft hover:text-ink transition-colors">
                  Dashboard
                </Link>
                <Link to="/dashboard/profile" className="whitespace-nowrap text-ink-soft hover:text-ink transition-colors">
                  Profile
                </Link>
                <button onClick={handleLogout} className="whitespace-nowrap text-ink-faint hover:text-ledger-red transition-colors">
                  Log out
                </button>
              </>
            )}
            {user && user.role === "admin" && (
              <>
                <Link to="/admin" className="whitespace-nowrap text-ink-soft hover:text-ink transition-colors">
                  Admin
                </Link>
                <button onClick={handleLogout} className="whitespace-nowrap text-ink-faint hover:text-ledger-red transition-colors">
                  Log out
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
      <div className="h-px bg-ink" />
      <div className="h-px bg-rule mt-0.5" />
    </header>
  );
}
