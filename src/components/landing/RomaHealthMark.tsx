/**
 * Redi Health mark — Adriatic seal with care pulse (matches header logo).
 */
export function RomaHealthMark({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="roma-mark-bg" x1="8" y1="6" x2="40" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2BC4A8" />
          <stop offset="48%" stopColor="#0E8074" />
          <stop offset="100%" stopColor="#063D3A" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="22.5" fill="url(#roma-mark-bg)" />
      <circle cx="24" cy="24" r="21.5" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" />
      <path
        d="M10.5 25.5h6.5l2.8-7.8 4.2 15.5 3.2-7.7H37.5"
        stroke="#FFFFFF"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
