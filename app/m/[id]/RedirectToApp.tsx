"use client";

import { useEffect, useMemo, useState } from "react";

const HI5_ORANGE = "#de8a02";
const HI5_NAVY = "#0c1a2b";

export default function RedirectToApp({ qrId }: { qrId: string }) {
  const [attempted, setAttempted] = useState(false);

  // ✅ Matches your Android app (applicationId = "com.hi5")
  const APP_SCHEME = "hi5"; // hi5://m/<qrId>
  const ANDROID_PACKAGE = "com.hi5";

  const { isAndroid, isIOS } = useMemo(() => {
    const ua = navigator.userAgent.toLowerCase();
    return {
      isAndroid: ua.includes("android"),
      isIOS:
        ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod"),
    };
  }, []);

  const deepLink = `${APP_SCHEME}://m/${qrId}`;

  // Android intent link tends to work best in Chrome
  const androidIntent = `intent://m/${qrId}#Intent;scheme=${APP_SCHEME};package=${ANDROID_PACKAGE};end`;

  useEffect(() => {
    if (attempted) return;
    if (!isAndroid && !isIOS) return;

    setAttempted(true);

    const t = setTimeout(() => {
      try {
        window.location.href = isAndroid ? androidIntent : deepLink;
      } catch {
        // ignore
      }
    }, 50);

    return () => clearTimeout(t);
  }, [attempted, isAndroid, isIOS, androidIntent, deepLink]);

  // Desktop: show nothing
  if (!isAndroid && !isIOS) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 12,
        left: 14,
        zIndex: 10,
        display: "inline-flex",
        gap: 10,
        alignItems: "center",
        background: "rgba(255,255,255,0.72)",
        border: "1px solid rgba(12,26,43,0.12)",
        padding: "7px 11px",
        borderRadius: 999,
        backdropFilter: "blur(10px)",
        boxShadow: "0 10px 26px rgba(0,0,0,0.10)",
        fontFamily: "system-ui",
        fontSize: 12,
        color: HI5_NAVY,
      }}
    >
      <span style={{ opacity: 0.75 }}>Have HI5 installed?</span>

      <a
        href={isAndroid ? androidIntent : deepLink}
        style={{
          fontWeight: 900,
          textDecoration: "none",
          color: HI5_NAVY,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: 999,
            background: HI5_ORANGE,
            boxShadow: "0 6px 14px rgba(222,138,2,0.35)",
          }}
        />
        Open in HI5
      </a>
    </div>
  );
}