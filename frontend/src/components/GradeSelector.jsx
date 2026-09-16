// A paper-form grading control: circle a number, the way a printed
// evaluation sheet is marked, rather than a star-rating widget.
export default function GradeSelector({ value, onChange }) {
  const grades = [1, 2, 3, 4, 5];
  return (
    <div className="flex gap-3">
      {grades.map((g) => {
        const active = g === value;
        return (
          <button
            type="button"
            key={g}
            onClick={() => onChange(g)}
            aria-pressed={active}
            aria-label={`Grade ${g} of 5`}
            className="relative w-11 h-11 grid place-items-center"
          >
            <span
              className={`font-mono text-lg font-bold transition-colors ${
                active ? "text-ledger-red" : "text-ink-faint"
              }`}
            >
              {g}
            </span>
            {active && (
              <svg
                className="absolute inset-0 w-full h-full text-ledger-red"
                viewBox="0 0 44 44"
                fill="none"
                style={{ transform: "rotate(-4deg)" }}
              >
                <path
                  d="M22 3
                     C 33 2, 41 9, 41 21
                     C 41 33, 33 41, 22 41
                     C 10 41, 3 33, 3 22
                     C 3 10, 11 3, 22 3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  pathLength="1"
                  className="grade-stamp-path"
                />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
}
