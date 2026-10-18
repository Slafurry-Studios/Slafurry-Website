// Slafurry Logo — white disk + black features, readable on light & dark.
// Replaces the old hand-drawn smiley SVG; same className contract.
export function SlafurryMark({ className }: { className?: string }) {
  return (
    <img
      src="/slafurry-logo.png"
      alt=""
      aria-hidden="true"
      className={className ?? ""}
    />
  );
}
