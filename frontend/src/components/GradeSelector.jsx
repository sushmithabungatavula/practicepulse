// Star rating input used throughout the anonymous feedback form.
export default function GradeSelector({ value, onChange }) {
  const grades = [1, 2, 3, 4, 5];
  return (
    <div className="flex gap-1.5">
      {grades.map((g) => {
        const active = g <= value;
        return (
          <button
            type="button"
            key={g}
            onClick={() => onChange(g)}
            aria-pressed={g === value}
            aria-label={`${g} star${g > 1 ? "s" : ""}`}
            className="w-9 h-9 grid place-items-center transition-transform hover:scale-110"
          >
            <svg
              viewBox="0 0 24 24"
              className={`w-6 h-6 transition-colors ${active ? "fill-accent text-accent" : "fill-none text-rule-strong"}`}
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 2.75l2.9 6.27 6.85.73-5.06 4.72 1.4 6.78L12 17.77l-6.09 3.48 1.4-6.78L2.25 9.75l6.85-.73L12 2.75z"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
