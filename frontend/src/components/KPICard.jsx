export default function KPICard({ label, value, sub, accent = false }) {
  return (
    <div className="bg-paper-raised border border-rule rounded-2xl p-5">
      <p className="text-[13px] font-medium text-ink-soft mb-1.5">{label}</p>
      <p className={`font-display text-3xl font-bold leading-none ${accent ? "text-accent" : "text-ink"}`}>
        {value}
      </p>
      {sub && <p className="text-xs text-ink-faint mt-2">{sub}</p>}
    </div>
  );
}
