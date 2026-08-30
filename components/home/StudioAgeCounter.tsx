"use client";

import { useEffect, useState } from "react";

// TODO: ganti ke SiteSettings.foundedAt asli dari database pas step 4.
// Untuk sekarang hardcode tanggal dummy biar counter-nya bisa didemoin.
const FOUNDED_AT = new Date("2025-03-06T00:00:00Z");

function diffParts(from: Date, to: Date) {
  let ms = to.getTime() - from.getTime();

  const msPerSecond = 1000;
  const msPerMinute = msPerSecond * 60;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;

  let months =
    (to.getFullYear() - from.getFullYear()) * 12 +
    (to.getMonth() - from.getMonth());

  const anchor = new Date(from);
  anchor.setMonth(anchor.getMonth() + months);

  if (anchor > to) {
    months -= 1;
    anchor.setMonth(anchor.getMonth() - 1);
  }

  ms = to.getTime() - anchor.getTime();

  const days = Math.floor(ms / msPerDay);
  ms -= days * msPerDay;

  const hours = Math.floor(ms / msPerHour);
  ms -= hours * msPerHour;

  const minutes = Math.floor(ms / msPerMinute);
  ms -= minutes * msPerMinute;

  const seconds = Math.floor(ms / msPerSecond);
  ms -= seconds * msPerSecond;

  const milliseconds = Math.floor(ms);

  return { months, days, hours, minutes, seconds, milliseconds };
}

export function StudioAgeCounter() {
  const [parts, setParts] = useState<ReturnType<typeof diffParts> | null>(null);

  useEffect(() => {
    let raf: number;

    function tick() {
      setParts(diffParts(FOUNDED_AT, new Date()));
      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, []);

  if (!parts) {
    return <span>a while</span>;
  }

  return (
    <span suppressHydrationWarning>
      {parts.months} months, {parts.days} days, {parts.hours} hours,{" "}
      {String(parts.seconds).padStart(2, "0")} seconds and{" "}
      {String(parts.milliseconds).padStart(4, "0")} milliseconds
    </span>
  );
}