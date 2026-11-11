"use client";

import { useEffect, useState } from "react";

function diffParts(from: Date, to: Date) {
  let ms = to.getTime() - from.getTime();

  const msPerSecond = 1000;
  const msPerMinute = msPerSecond * 60;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;

  // Months calculated by calendar (not 30-day average), so "5 months, 23 days"
  // stays consistent with how people normally talk about age day-to-day.
  let months =
    (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
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

export function StudioAgeCounter({ foundedAt }: { foundedAt: Date }) {
  // null on first render (server) to avoid mismatch with client —
  // once mounted, starts counting & updates every frame.
  const [parts, setParts] = useState<ReturnType<typeof diffParts> | null>(null);

  useEffect(() => {
    let raf: number;
    function tick() {
      setParts(diffParts(foundedAt, new Date()));
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [foundedAt]);

  if (!parts) {
    // Short placeholder before hydration, to avoid layout shift.
    return <span>a while</span>;
  }

  return (
    <span suppressHydrationWarning>
      {parts.months} months, {parts.days} days, {parts.hours} hours,{" "}
      {parts.seconds} seconds and {parts.milliseconds} milliseconds
    </span>
  );
}
