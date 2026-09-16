import { useState } from "react";

// A cover photo that fails gracefully: if the image can't load (blocked
// domain, offline, slow network), it quietly disappears and leaves a
// plain background instead of the browser's broken-image icon + alt text.
export default function Photo({ src, alt, className = "", style }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`bg-paper-sunken overflow-hidden ${className}`} style={style}>
      {!failed && src && (
        <img
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
}
