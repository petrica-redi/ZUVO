/**
 * Redi Health mark — medical cross over Roma flag colours.
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
      <rect width="48" height="48" rx="12" fill="#003DA5" />
      <rect y="16" width="48" height="16" fill="#006A4E" />
      <rect y="32" width="48" height="16" fill="#CE1126" />
      <circle cx="24" cy="24" r="9" fill="#003DA5" stroke="#F5F5F5" strokeWidth="1.5" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line
          key={deg}
          x1="24"
          y1="24"
          x2={24 + 7 * Math.cos((deg * Math.PI) / 180)}
          y2={24 + 7 * Math.sin((deg * Math.PI) / 180)}
          stroke="#F5F5F5"
          strokeWidth="1.2"
        />
      ))}
      <rect x="21" y="14" width="6" height="20" rx="1" fill="white" />
      <rect x="14" y="21" width="20" height="6" rx="1" fill="white" />
    </svg>
  );
}
