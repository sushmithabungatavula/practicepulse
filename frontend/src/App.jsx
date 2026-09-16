import { Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import RoleRedirect from "./pages/RoleRedirect.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProfileEditor from "./pages/ProfileEditor.jsx";
import FeedbackForm from "./pages/FeedbackForm.jsx";
import PublicProfile from "./pages/PublicProfile.jsx";
import Directory from "./pages/Directory.jsx";
import Admin from "./pages/Admin.jsx";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/redirect" element={<RoleRedirect />} />
          <Route path="/directory" element={<Directory />} />
          <Route path="/instructors/:slug" element={<PublicProfile />} />
          <Route path="/feedback/:slug" element={<FeedbackForm />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="instructor">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/profile"
            element={
              <ProtectedRoute role="instructor">
                <ProfileEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <footer className="bg-forest px-6 sm:px-12 lg:px-[72px] pt-14 pb-9 flex flex-col gap-9">
        <div className="max-w-6xl mx-auto w-full grid sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-8">
          <div className="flex flex-col gap-3">
            <span className="font-display text-xl font-bold text-white flex items-center gap-2">
              🌿 PracticePulse
            </span>
            <span className="text-[13px] text-forest-soft max-w-xs leading-relaxed">
              An operating ledger for independent wellness instructors, built for Chicago's practice
              community.
            </span>
          </div>
          <div className="flex flex-col gap-2.5 text-[13px] text-forest-soft">
            <span className="text-white font-semibold mb-1">Product</span>
            <Link to="/directory" className="hover:text-white transition-colors">Directory</Link>
            <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <Link to="/register" className="hover:text-white transition-colors">Join</Link>
          </div>
          <div className="flex flex-col gap-2.5 text-[13px] text-forest-soft">
            <span className="text-white font-semibold mb-1">Company</span>
            <a href="mailto:hello@practicepulse.app" className="hover:text-white transition-colors">Contact</a>
            <Link to="/admin" className="hover:text-white transition-colors">Admin</Link>
          </div>
          <div className="flex flex-col gap-2.5 text-[13px] text-forest-soft">
            <span className="text-white font-semibold mb-1">Chicago, IL</span>
            <a href="mailto:hello@practicepulse.app" className="hover:text-white transition-colors">
              hello@practicepulse.app
            </a>
          </div>
        </div>
        <div className="max-w-6xl mx-auto w-full border-t border-white/10 pt-5 text-xs text-forest-soft/70">
          © 2026 PracticePulse — an operating ledger for independent wellness instructors.
        </div>
      </footer>
    </div>
  );
}
