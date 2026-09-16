import { Routes, Route, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col">
      {!isLanding && <Navbar />}
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
      {!isLanding && (
        <footer className="border-t border-rule py-6 text-center text-xs font-mono text-ink-faint">
          PracticePulse — an operating ledger for independent wellness instructors
        </footer>
      )}
    </div>
  );
}
