export default function StarRating({ value, onChange, size = "text-2xl" }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className={`flex gap-1 ${size}`}>
      {stars.map((s) => (
        <button
          type="button"
          key={s}
          onClick={() => onChange(s)}
          className={s <= value ? "text-clay-500" : "text-sage-200"}
          aria-label={`${s} star${s > 1 ? "s" : ""}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
