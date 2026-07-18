/**
 * Redi Health mark — Adriatic seal with rising care path (matches header logo).
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
          <stop offset="45%" stopColor="#0E8074" />
          <stop offset="100%" stopColor="#063D3A" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="22.5" fill="url(#roma-mark-bg)" />
      <circle cx="24" cy="24" r="21.5" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" />
      <path
        d="M15 29.5c2.6-1.3 4.3-3.4 5-6.1.5-1.9 1.3-2.9 2.6-2.9 1.6 0 2.4 1.1 3 3.1.8 2.9 2.2 4.9 4.9 6.1"
        stroke="#FFFFFF"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="24" cy="14.5" r="2.2" fill="#FFFFFF" />
    </svg>
  );
}
