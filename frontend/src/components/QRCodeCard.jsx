import { QRCodeSVG } from "qrcode.react";

export default function QRCodeCard({ slug }) {
  const feedbackUrl = `${window.location.origin}/feedback/${slug}`;

  return (
    <div className="bg-paper-raised border border-rule">
      <div className="border-b border-rule px-4 py-2.5 flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-wide font-mono text-ink-soft">
          Feedback intake code
        </p>
        <span className="font-mono text-[11px] text-ledger-red">#{slug.slice(0, 6)}</span>
      </div>
      <div className="p-5 flex flex-col items-center gap-3">
        <div className="p-3 bg-white border border-ink">
          <QRCodeSVG value={feedbackUrl} size={156} fgColor="#141311" />
        </div>
        <p className="text-[11px] text-ink-faint font-mono break-all text-center">{feedbackUrl}</p>
        <button
          onClick={() => navigator.clipboard?.writeText(feedbackUrl)}
          className="text-xs font-mono uppercase tracking-wide px-3 py-1.5 border border-ink text-ink hover:bg-ink hover:text-paper transition-colors"
        >
          Copy link
        </button>
      </div>
    </div>
  );
}
