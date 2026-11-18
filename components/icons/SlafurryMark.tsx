// Slafurry Logo — white disk + black features, readable on light & dark.
// Replaces the old hand-drawn smiley SVG; same className contract.
import Image from "next/image";

export function SlafurryMark({ className }: { className?: string }) {
  return (
    <Image
      src="/slafurry-logo.png"
      alt=""
      aria-hidden="true"
      width={269}
      height={269}
      className={className ?? ""}
    />
  );
}
