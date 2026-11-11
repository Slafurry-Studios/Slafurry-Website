"use client";

import { useEffect } from "react";
import { initDebugAPI } from "@/lib/achievements/debug";

export function AchievementInit() {
  useEffect(() => {
    initDebugAPI();
  }, []);

  return null;
}
