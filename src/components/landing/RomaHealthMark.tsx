/**
 * Redi Health mark — teal tile with Rod of Asclepius (matches header logo).
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
        <linearGradient id="roma-mark-bg" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#14B8A6" />
          <stop offset="55%" stopColor="#0E8074" />
          <stop offset="100%" stopColor="#0C5A60" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="url(#roma-mark-bg)" />
      <path d="M24 11v26" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" />
      <path
        d="M29 14.5c-2.5 3.1-3.8 6-3.8 8.8a3.6 3.6 0 0 1-7.2 0c0-2.8 1.3-5.7 3.8-8.8"
        stroke="#FFFFFF"
        strokeWidth="2.3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
