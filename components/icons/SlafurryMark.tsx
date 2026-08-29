export function SlafurryMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="20"
        cy="20"
        r="17"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      <circle cx="13.5" cy="17" r="1.8" fill="currentColor" />
      <circle cx="26.5" cy="17" r="1.8" fill="currentColor" />
      <path
        d="M11.5 23c0 0 3.5 6 8.5 6s8.5-6 8.5-6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
