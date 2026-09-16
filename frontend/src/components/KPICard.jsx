export default function KPICard({ label, value, sub, accent = false }) {
  return (
    <div className="bg-paper-raised border border-rule p-4">
      <p className="text-[11px] uppercase tracking-wide font-mono text-ink-soft border-b border-rule pb-2 mb-2">
        {label}
      </p>
      <p
        className={`font-mono text-3xl font-bold leading-none ${accent ? "text-ledger-red" : "text-ink"}`}
        data-numeral
      >
        {value}
      </p>
      {sub && <p className="text-xs text-ink-faint mt-2 font-sans">{sub}</p>}
    </div>
  );
}
