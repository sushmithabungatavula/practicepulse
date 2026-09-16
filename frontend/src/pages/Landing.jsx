import { Link } from "react-router-dom";

const SAMPLE_ROWS = [
  { label: "Recommend rate", value: "92%" },
  { label: "Returning students", value: "61%" },
  { label: "Engagement score", value: "84" },
];

export default function Landing() {
  return (
    <div>
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-16 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-start">
        <div>
          <h1 className="text-5xl sm:text-6xl font-sans font-extrabold tracking-tightest text-ink leading-[0.98]">
            Know how your classes are really landing.
          </h1>
          <p className="mt-6 text-lg text-ink-soft max-w-lg leading-relaxed">
            PracticePulse gives independent yoga, meditation, and wellness instructors a graded
            operating ledger: anonymous client feedback in, a professional reputation and a
            business-intelligence dashboard out.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/register"
              className="stamp inline-block px-6 py-3 bg-ink text-paper font-mono text-sm uppercase tracking-wide hover:bg-ledger-red transition-colors"
            >
              Create your ledger
            </Link>
            <Link
              to="/directory"
              className="px-6 py-3 border border-ink text-ink font-mono text-sm uppercase tracking-wide hover:bg-ink hover:text-paper transition-colors"
            >
              Browse instructors
            </Link>
          </div>
        </div>

        <div className="bg-paper-raised border border-ink">
          <div className="border-b border-ink px-5 py-3 flex items-baseline justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wide text-ink-soft">
              Sample instructor ledger
            </span>
            <span className="font-mono text-[11px] text-ink-faint">30-day period</span>
          </div>
          <div className="px-5 pt-5 pb-4 border-b border-rule">
            <p className="text-[11px] uppercase tracking-wide font-mono text-ink-soft mb-1">
              Average rating
            </p>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-6xl font-bold text-ink" data-numeral>
                4.8
              </span>
              <span className="font-mono text-lg text-ink-faint">/5</span>
              <span className="stamp ml-auto text-[11px] font-mono uppercase tracking-wide border border-ledger-red text-ledger-red px-2 py-0.5">
                Verified
              </span>
            </div>
          </div>
          <dl className="px-5 py-2">
            {SAMPLE_ROWS.map((row, i) => (
              <div
                key={row.label}
                className={`flex items-baseline justify-between py-2.5 ${
                  i !== SAMPLE_ROWS.length - 1 ? "border-b border-rule" : ""
                }`}
              >
                <dt className="text-sm text-ink-soft">{row.label}</dt>
                <dd className="font-mono text-lg font-semibold text-ink" data-numeral>
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-y border-rule bg-paper-raised">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <div className="divide-y divide-rule border-y border-rule">
            <FeatureRow
              title="Anonymous feedback"
              body="Students scan a QR code after class and complete a short survey — no account required, done in under a minute."
            />
            <FeatureRow
              title="Real business intelligence"
              body="Automatic KPI ledger for satisfaction, retention, recommend rate, and monthly trend — no spreadsheets, no AI guesswork."
            />
            <FeatureRow
              title="A reputation that compounds"
              body="Verified testimonials and a graded rating history build a public profile worth linking from your bio."
            />
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h2 className="text-2xl font-sans font-extrabold tracking-tightest text-ink">
          Built for Chicago's independent wellness community
        </h2>
        <p className="text-ink-soft mt-3">
          Yoga instructors, meditation guides, breathwork coaches, Pilates teachers, and
          mindfulness educators — one ledger to collect feedback and grow a reputation.
        </p>
      </section>
    </div>
  );
}

function FeatureRow({ title, body }) {
  return (
    <div className="grid sm:grid-cols-[220px_1fr] gap-2 sm:gap-8 py-6">
      <h3 className="font-mono text-sm font-bold uppercase tracking-wide text-ink">{title}</h3>
      <p className="text-sm text-ink-soft leading-relaxed max-w-md">{body}</p>
    </div>
  );
}
