import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl sm:text-5xl font-serif font-semibold text-sage-900 leading-tight">
            Know how your classes are really landing.
          </h1>
          <p className="mt-5 text-lg text-sage-600">
            PracticePulse gives independent yoga, meditation, and wellness instructors a simple way
            to collect anonymous client feedback, track satisfaction over time, and showcase
            verified testimonials on a professional public profile.
          </p>
          <div className="mt-8 flex gap-3">
            <Link
              to="/register"
              className="px-5 py-3 rounded-full bg-clay-500 text-white font-medium hover:bg-clay-600 transition"
            >
              Create your instructor profile
            </Link>
            <Link
              to="/directory"
              className="px-5 py-3 rounded-full border border-sage-300 text-sage-800 font-medium hover:bg-sage-100 transition"
            >
              Browse instructors
            </Link>
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-sage-200 shadow-sm p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-sage-50 rounded-xl p-4">
              <p className="text-xs text-sage-500 uppercase tracking-wide">Average rating</p>
              <p className="text-2xl font-serif font-semibold text-sage-800 mt-1">4.8</p>
            </div>
            <div className="bg-sage-50 rounded-xl p-4">
              <p className="text-xs text-sage-500 uppercase tracking-wide">Recommend rate</p>
              <p className="text-2xl font-serif font-semibold text-sage-800 mt-1">92%</p>
            </div>
            <div className="bg-sage-50 rounded-xl p-4">
              <p className="text-xs text-sage-500 uppercase tracking-wide">Returning students</p>
              <p className="text-2xl font-serif font-semibold text-sage-800 mt-1">61%</p>
            </div>
            <div className="bg-sage-50 rounded-xl p-4">
              <p className="text-xs text-sage-500 uppercase tracking-wide">Engagement score</p>
              <p className="text-2xl font-serif font-semibold text-sage-800 mt-1">84</p>
            </div>
          </div>
          <p className="text-xs text-sage-400 mt-4 text-center">Sample instructor dashboard preview</p>
        </div>
      </section>

      <section className="bg-white border-y border-sage-200">
        <div className="max-w-6xl mx-auto px-6 py-16 grid sm:grid-cols-3 gap-8">
          <Feature
            title="Anonymous feedback"
            body="Students scan a QR code after class and complete a short survey — no account required."
          />
          <Feature
            title="Real business intelligence"
            body="Automatic KPI dashboards for satisfaction, retention, NPS, and monthly trends — no spreadsheets."
          />
          <Feature
            title="A reputation that compounds"
            body="Verified testimonials and ratings build a public profile that grows your practice."
          />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-serif font-semibold text-sage-900">
          Built for Chicago's independent wellness community
        </h2>
        <p className="text-sage-600 mt-3 max-w-2xl mx-auto">
          Yoga instructors, meditation guides, breathwork coaches, Pilates teachers, and
          mindfulness educators — one platform to collect feedback and grow your reputation.
        </p>
      </section>
    </div>
  );
}

function Feature({ title, body }) {
  return (
    <div>
      <h3 className="font-serif text-lg font-semibold text-sage-800">{title}</h3>
      <p className="text-sm text-sage-600 mt-2">{body}</p>
    </div>
  );
}
