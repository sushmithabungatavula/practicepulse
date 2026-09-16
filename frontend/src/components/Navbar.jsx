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
    <header className="sticky top-0 z-20 bg-paper/95 backdrop-blur-sm border-b border-rule">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-[72px]">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-5">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <span className="text-xl">🌿</span>
            <span className="font-display text-xl font-bold text-ink">PracticePulse</span>
          </Link>
          <nav className="flex items-center gap-4 sm:gap-7 text-[15px] font-medium text-ink-soft">
            <Link to="/directory" className="whitespace-nowrap hover:text-ink transition-colors">
              Directory
            </Link>
            {!user && (
              <>
                <Link to="/login" className="whitespace-nowrap hover:text-ink transition-colors">
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="whitespace-nowrap px-5 sm:px-6 py-3 rounded-full bg-accent text-white text-sm font-semibold hover:bg-accent-dark transition-colors"
                >
                  Join as instructor
                </Link>
              </>
            )}
            {user && user.role === "instructor" && (
              <>
                <Link to="/dashboard" className="whitespace-nowrap hover:text-ink transition-colors">
                  Dashboard
                </Link>
                <Link to="/dashboard/profile" className="whitespace-nowrap hover:text-ink transition-colors">
                  Profile
                </Link>
                <button onClick={handleLogout} className="whitespace-nowrap text-ink-faint hover:text-accent transition-colors">
                  Log out
                </button>
              </>
            )}
            {user && user.role === "admin" && (
              <>
                <Link to="/admin" className="whitespace-nowrap hover:text-ink transition-colors">
                  Admin
                </Link>
                <button onClick={handleLogout} className="whitespace-nowrap text-ink-faint hover:text-accent transition-colors">
                  Log out
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
