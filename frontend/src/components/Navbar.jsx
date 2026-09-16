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
    <nav className="border-b border-sage-200 bg-white/80 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-sage-600 inline-block" />
          <span className="font-serif text-lg font-semibold text-sage-800">PracticePulse</span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link to="/directory" className="text-sage-700 hover:text-sage-900">
            Find an instructor
          </Link>
          {!user && (
            <>
              <Link to="/login" className="text-sage-700 hover:text-sage-900">
                Log in
              </Link>
              <Link
                to="/register"
                className="px-3 py-1.5 rounded-full bg-clay-500 text-white hover:bg-clay-600 transition"
              >
                Join as instructor
              </Link>
            </>
          )}
          {user && user.role === "instructor" && (
            <>
              <Link to="/dashboard" className="text-sage-700 hover:text-sage-900">
                Dashboard
              </Link>
              <Link to="/dashboard/profile" className="text-sage-700 hover:text-sage-900">
                Profile
              </Link>
              <button onClick={handleLogout} className="text-sage-500 hover:text-sage-800">
                Log out
              </button>
            </>
          )}
          {user && user.role === "admin" && (
            <>
              <Link to="/admin" className="text-sage-700 hover:text-sage-900">
                Admin
              </Link>
              <button onClick={handleLogout} className="text-sage-500 hover:text-sage-800">
                Log out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
