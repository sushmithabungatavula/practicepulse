import { Routes, Route } from "react-router-dom";
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
      <footer className="border-t border-sage-200 py-6 text-center text-xs text-sage-400">
        PracticePulse — built for independent wellness instructors
      </footer>
    </div>
  );
}
