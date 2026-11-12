"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type TurnstileWidgetProps = {
  siteKey: string;
  onVerify: (token: string) => void;
  onError?: () => void;
  /** Bump to force the widget to re-render (e.g. after a failed submission). */
  resetKey?: number;
};

/**
 * Renders a Cloudflare Turnstile widget. Loads the official API script once
 * and reports the verification token back to the parent via `onVerify`.
 */
export function TurnstileWidget({
  siteKey,
  onVerify,
  onError,
  resetKey,
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const verify = useCallback((token: string) => onVerify(token), [onVerify]);

  // Load the Turnstile API script exactly once per page lifetime.
  useEffect(() => {
    if (scriptReady) return;
    const already = document.querySelector(
      'script[src*="challenges.cloudflare.com/turnstile/v0/api.js"]'
    );
    if (already) {
      setScriptReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptReady(true);
    document.head.appendChild(script);
  }, [scriptReady]);

  // (Re)render the widget whenever the script or config changes.
  useEffect(() => {
    if (!scriptReady || !containerRef.current) return;
    const win = window as unknown as {
      turnstile?: {
        render: (
          el: HTMLElement,
          opts: Record<string, unknown>
        ) => number;
        remove: (id: number) => void;
      };
    };
    const turnstile = win.turnstile;
    if (!turnstile) return;

    if (widgetIdRef.current !== null) {
      turnstile.remove(widgetIdRef.current);
    }
    widgetIdRef.current = turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: verify,
      ...(onError ? { "error-callback": onError } : {}),
    });

    return () => {
      if (widgetIdRef.current !== null) {
        turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [scriptReady, siteKey, verify, onError, resetKey]);

  return <div ref={containerRef} className="my-3" />;
}
