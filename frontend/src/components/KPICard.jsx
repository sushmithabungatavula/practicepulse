export default function KPICard({ label, value, sub, accent = "sage" }) {
  const accentClass = accent === "clay" ? "text-clay-600" : "text-sage-700";
  return (
    <div className="bg-white rounded-2xl border border-sage-200 p-5 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-sage-500 font-medium">{label}</p>
      <p className={`text-3xl font-serif font-semibold mt-1 ${accentClass}`}>{value}</p>
      {sub && <p className="text-xs text-sage-500 mt-1">{sub}</p>}
    </div>
  );
}
