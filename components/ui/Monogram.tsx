/** Original geometric RD monogram — two strokes and a counter-dot. */
export default function Monogram({ size = 30 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      role="img"
      aria-label="Ryan Dhana monogram"
    >
      <rect x="1" y="1" width="30" height="30" rx="9" stroke="currentColor" strokeWidth="1.2" />
      {/* R stem + bowl */}
      <path
        d="M10 23V9h4.5a3.5 3.5 0 0 1 0 7H10m6 0 4 7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* D as a chord arc sharing the field */}
      <path
        d="M23.5 9a7 7 0 0 1 0 14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.55"
      />
      <circle cx="23.5" cy="16" r="1.1" fill="#e8813a" />
    </svg>
  );
}
