/**
 * Redi Health mark — soft squircle with a clean heart (matches header logo).
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
        <linearGradient id="roma-mark-bg" x1="8" y1="4" x2="40" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="52%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#4C1D95" />
        </linearGradient>
      </defs>
      <path
        d="M24 2C9 2 2 9 2 24S9 46 24 46 46 39 46 24 39 2 24 2Z"
        fill="url(#roma-mark-bg)"
      />
      <path
        d="M24 35.4c-.6 0-1.2-.22-1.68-.64C16.44 29.7 12.6 26.4 12.6 21.6c0-3.43 2.64-6.19 6-6.19 2.06 0 4.03 1.03 5.4 2.71 1.37-1.68 3.34-2.71 5.4-2.71 3.36 0 6 2.76 6 6.19 0 4.8-3.84 8.1-9.72 13.16-.48.42-1.08.64-1.68.64Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}
