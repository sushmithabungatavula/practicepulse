import { QRCodeSVG } from "qrcode.react";

export default function QRCodeCard({ slug }) {
  const feedbackUrl = `${window.location.origin}/feedback/${slug}`;

  return (
    <div className="bg-paper-raised border border-rule rounded-2xl overflow-hidden">
      <div className="px-5 py-3 flex items-center justify-between bg-paper">
        <p className="text-[13px] font-semibold text-ink">Feedback QR code</p>
        <span className="text-[11px] text-accent font-medium">#{slug.slice(0, 6)}</span>
      </div>
      <div className="p-5 flex flex-col items-center gap-3">
        <div className="p-3 bg-white border border-rule rounded-xl">
          <QRCodeSVG value={feedbackUrl} size={156} fgColor="#201B15" />
        </div>
        <p className="text-[11px] text-ink-faint break-all text-center">{feedbackUrl}</p>
        <button
          onClick={() => navigator.clipboard?.writeText(feedbackUrl)}
          className="text-xs font-semibold px-4 py-2 rounded-full border border-rule text-ink hover:bg-accent hover:text-white hover:border-accent transition-colors"
        >
          Copy link
        </button>
      </div>
    </div>
  );
}
