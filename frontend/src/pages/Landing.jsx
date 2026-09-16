import { Link, Navigate } from "react-router-dom";
import Photo from "../components/Photo.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const HERO_CHECKS = [
  "Anonymous feedback",
  "Real BI dashboards",
  "Verified testimonials",
  "Built for Chicago instructors",
];

const MODALITIES = [
  {
    name: "Yoga",
    photo: "https://images.pexels.com/photos/8436589/pexels-photo-8436589.jpeg?auto=compress&cs=tinysrgb&w=400",
    alt: "People practicing yoga together in a sunlit studio",
  },
  {
    name: "Meditation",
    photo: "https://images.pexels.com/photos/4498220/pexels-photo-4498220.jpeg?auto=compress&cs=tinysrgb&w=400",
    alt: "Person seated in a meditation pose",
  },
  {
    name: "Breathwork",
    photo: "https://images.pexels.com/photos/32847437/pexels-photo-32847437.jpeg?auto=compress&cs=tinysrgb&w=400",
    alt: "Woman meditating outdoors under a tree canopy",
  },
  {
    name: "Pilates",
    photo: "https://images.pexels.com/photos/25596671/pexels-photo-25596671.jpeg?auto=compress&cs=tinysrgb&w=400",
    alt: "Woman practicing pilates in a studio",
  },
  {
    name: "Mindfulness",
    photo: "https://images.pexels.com/photos/7363322/pexels-photo-7363322.jpeg?auto=compress&cs=tinysrgb&w=400",
    alt: "Group meditating outdoors at sunrise",
  },
];

const QUALITY_CHECKS = [
  "QR-code feedback collection",
  "Monthly trend & NPS tracking",
  "Verified public reputation profile",
  "Admin moderation built in",
];

const DEMO_STATS = [
  { value: "4.52", label: "Average rating" },
  { value: "83%", label: "Recommend rate" },
  { value: "56%", label: "Returning students" },
  { value: "80.7", label: "Engagement score" },
];

const ARTICLES = [
  {
    tag: "Getting started",
    title: "How to read your engagement score in five minutes",
    photo: "https://images.pexels.com/photos/3822668/pexels-photo-3822668.jpeg?auto=compress&cs=tinysrgb&w=500",
    alt: "Instructor assisting students in a studio",
  },
  {
    tag: "Feedback",
    title: "Turning anonymous feedback into your teaching edge",
    photo: "https://images.pexels.com/photos/2280200/pexels-photo-2280200.jpeg?auto=compress&cs=tinysrgb&w=500",
    alt: "Silhouette of a yogi at golden hour",
  },
  {
    tag: "Reputation",
    title: "Building a public profile students actually trust",
    photo: "https://images.pexels.com/photos/4498516/pexels-photo-4498516.jpeg?auto=compress&cs=tinysrgb&w=500",
    alt: "Instructor portrait, smiling",
  },
];

const TESTIMONIALS = [
  { stars: "★★★★★", quote: "Loved the breathing exercises and calm atmosphere.", name: "Sam K." },
  { stars: "★★★★★", quote: "The community here is so supportive.", name: "Alex T." },
  { stars: "★★★★☆", quote: "The meditation at the end was wonderful.", name: "Jamie R." },
];

export default function Landing() {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/redirect" replace />;
  }

  return (
    <div>
      {/* HERO */}
      <div className="grid lg:grid-cols-[1fr_560px] gap-10 px-6 sm:px-12 lg:px-[72px] pt-14 pb-20 items-center">
        <div className="flex flex-col gap-5 max-w-xl">
          <span className="text-[13px] font-bold tracking-wider text-accent uppercase">
            Welcome to PracticePulse
          </span>
          <h1 className="text-4xl sm:text-5xl leading-[1.12] text-ink">
            Know how your classes are <em className="text-accent not-italic italic">really</em> landing.
          </h1>
          <p className="text-base leading-relaxed text-ink-soft max-w-md">
            Anonymous client feedback, a business-intelligence dashboard, and a public reputation
            profile — built for independent yoga, meditation, and wellness instructors.
          </p>
          <div className="flex flex-wrap gap-4 mt-1.5">
            <Link
              to="/register"
              className="px-7 py-4 rounded-full bg-accent text-white text-[15px] font-semibold hover:bg-accent-dark transition-colors"
            >
              Create your ledger
            </Link>
            <Link
              to="/directory"
              className="px-7 py-4 rounded-full bg-ink text-white text-[15px] font-semibold hover:bg-black transition-colors"
            >
              Browse instructors
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-7 gap-y-2.5 mt-3.5">
            {HERO_CHECKS.map((label) => (
              <div key={label} className="flex items-center gap-2 text-sm text-ink-soft">
                <span className="w-[18px] h-[18px] rounded-full bg-accent text-white text-[11px] flex items-center justify-center shrink-0">
                  ✓
                </span>
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="relative h-[420px] sm:h-[480px] hidden sm:block">
          <Photo
            src="https://images.pexels.com/photos/2280200/pexels-photo-2280200.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Silhouette of a yogi in a dynamic pose at golden hour"
            className="absolute top-0 left-8 w-64 h-64 sm:w-80 sm:h-80 rounded-full shadow-2xl border-8 border-paper"
          />
          <Photo
            src="https://images.pexels.com/photos/8436589/pexels-photo-8436589.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Small group practicing yoga together in a sunlit studio"
            className="absolute bottom-0 right-0 w-56 h-56 sm:w-72 sm:h-72 shadow-2xl border-8 border-paper"
            style={{ borderRadius: "46% 54% 60% 40% / 50% 45% 55% 50%" }}
          />
          <div
            className="absolute bottom-14 left-0 w-44 h-44 rounded-full"
            style={{ background: "linear-gradient(200deg, #F1D9A8, #DDAF6C)" }}
          />
          <div className="absolute top-[46%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-white flex items-center justify-center text-center p-3.5 shadow-xl z-10">
            <span className="font-display text-xs font-bold leading-snug text-ink">
              Every rating tells a story
            </span>
          </div>
        </div>
      </div>

      {/* MODALITY CARDS */}
      <div className="px-6 sm:px-12 lg:px-[72px] pt-2 pb-20 flex flex-col items-center gap-2.5 text-center">
        <span className="text-[13px] font-bold tracking-wider text-accent uppercase">
          Built for every modality
        </span>
        <h2 className="text-3xl mb-7">Practices we support</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 w-full">
          {MODALITIES.map((m) => (
            <div key={m.name} className="bg-white rounded-[22px] overflow-hidden border border-rule text-left">
              <Photo src={m.photo} alt={m.alt} className="w-full h-32" />
              <div className="px-4 pt-4 pb-5">
                <span className="text-[15px] font-semibold text-ink">{m.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DARK QUALITY SECTION */}
      <div
        id="how-it-works"
        className="bg-forest px-6 sm:px-12 lg:px-[72px] py-20 grid lg:grid-cols-[1fr_520px] gap-14 items-center"
      >
        <div className="flex flex-col gap-5 text-forest-soft">
          <span className="text-[13px] font-bold tracking-wider text-accent uppercase">
            Why instructors switch
          </span>
          <h2 className="text-3xl text-white leading-snug">
            We give you the full picture, not just a star rating.
          </h2>
          <p className="text-[15px] leading-relaxed text-forest-soft max-w-md">
            PracticePulse turns scattered feedback into an operating habit — a dashboard you
            actually check, not a review site you hope someone visits.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-7 gap-y-3.5 mt-2">
            {QUALITY_CHECKS.map((label) => (
              <div key={label} className="flex items-start gap-2.5 text-sm text-forest-soft">
                <span className="w-5 h-5 rounded-md bg-accent text-white text-xs flex items-center justify-center shrink-0 mt-px">
                  ✓
                </span>
                {label}
              </div>
            ))}
          </div>
          <Link
            to="/directory"
            className="self-start mt-3 px-7 py-3.5 rounded-full bg-accent text-white text-[15px] font-semibold hover:bg-accent-dark transition-colors"
          >
            See a sample dashboard
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-5 sm:p-6 flex flex-col gap-4 shadow-2xl">
          <div className="flex items-center gap-3">
            <Photo
              src="https://images.pexels.com/photos/4498516/pexels-photo-4498516.jpeg?auto=compress&cs=tinysrgb&w=200"
              alt="Portrait of instructor Sushmitha B."
              className="w-11 h-11 rounded-full"
            />
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold text-ink">Sushmitha B. · Yoga</span>
              <span className="text-[11px] text-ink-faint">Lincoln Park, Chicago</span>
            </div>
            <span className="ml-auto text-[11px] font-bold text-accent bg-accent-soft px-2.5 py-1 rounded-full">
              LIVE DEMO
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {DEMO_STATS.map((s) => (
              <div key={s.label} className="bg-paper rounded-2xl p-4">
                <span className="font-display text-[26px] font-bold text-ink">{s.value}</span>
                <div className="text-xs text-ink-faint mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FROM THE JOURNAL */}
      <div className="px-6 sm:px-12 lg:px-[72px] pt-20 pb-2 flex flex-col gap-2.5">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div className="flex flex-col gap-2.5">
            <span className="text-[13px] font-bold tracking-wider text-accent uppercase">
              From the journal
            </span>
            <h2 className="text-3xl text-ink">Resources for running your practice</h2>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full mt-6">
          {ARTICLES.map((a) => (
            <div key={a.title} className="bg-white border border-rule rounded-[22px] overflow-hidden text-left">
              <Photo src={a.photo} alt={a.alt} className="w-full h-[170px]" />
              <div className="p-5 flex flex-col gap-2.5">
                <span className="text-xs text-ink-faint font-semibold">{a.tag}</span>
                <h3 className="text-[17px] font-semibold leading-snug text-ink">{a.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div className="px-6 sm:px-12 lg:px-[72px] py-20 flex flex-col items-center gap-2.5 text-center">
        <span className="text-[13px] font-bold tracking-wider text-accent uppercase">
          Cultivating growth, grace &amp; gratitude
        </span>
        <h2 className="text-3xl mb-1.5 max-w-xl text-ink">
          What students are saying (sample demo data)
        </h2>
        <div className="grid sm:grid-cols-3 gap-5 w-full mt-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-white border border-rule rounded-[22px] p-6 text-left flex flex-col gap-3.5">
              <span className="text-xl text-accent">{t.stars}</span>
              <p className="text-sm leading-relaxed text-ink-soft m-0">"{t.quote}"</p>
              <span className="text-[13px] font-semibold text-ink">— {t.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA BANNER */}
      <div className="mx-6 sm:mx-12 lg:mx-[72px] mb-20 bg-forest rounded-[28px] px-8 sm:px-16 py-12 flex flex-col sm:flex-row items-center justify-between gap-8">
        <div className="flex flex-col gap-2.5 max-w-lg text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl text-white">
            Ready to see how your classes are really landing?
          </h2>
          <p className="text-sm text-forest-soft">
            Join independent instructors across Chicago already collecting feedback with PracticePulse.
          </p>
        </div>
        <Link
          to="/register"
          className="px-8 py-4 rounded-full bg-accent text-white text-[15px] font-semibold whitespace-nowrap hover:bg-accent-dark transition-colors"
        >
          Get started free
        </Link>
      </div>

    </div>
  );
}
