import { QRCodeSVG } from "qrcode.react";

export default function QRCodeCard({ slug }) {
  const feedbackUrl = `${window.location.origin}/feedback/${slug}`;

  return (
    <div className="bg-white rounded-2xl border border-sage-200 p-6 shadow-sm flex flex-col items-center text-center gap-3">
      <p className="text-xs uppercase tracking-wide text-sage-500 font-medium">
        Scan to leave feedback
      </p>
      <div className="p-3 bg-white border border-sage-100 rounded-xl">
        <QRCodeSVG value={feedbackUrl} size={168} fgColor="#334334" />
      </div>
      <p className="text-xs text-sage-500 break-all">{feedbackUrl}</p>
      <button
        onClick={() => navigator.clipboard?.writeText(feedbackUrl)}
        className="text-xs px-3 py-1.5 rounded-full border border-sage-300 text-sage-700 hover:bg-sage-50"
      >
        Copy link
      </button>
    </div>
  );
}
