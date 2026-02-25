import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import RedirectToApp from "./RedirectToApp"; // ✅ NEW

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// HI5 brand colors
const HI5_ORANGE = "#de8a02";
const HI5_NAVY = "#0c1a2b";
const HI5_LOGO_SRC = "/hi5-logo.png"; // MUST exist in /public/hi5-logo.png

function deviceTypeFromUA(ua: string) {
  const u = ua.toLowerCase();
  if (u.includes("android")) return "android";
  if (u.includes("iphone") || u.includes("ipad")) return "ios";
  if (u.includes("windows") || u.includes("macintosh") || u.includes("linux"))
    return "desktop";
  return "unknown";
}

function hashIp(ip: string) {
  return crypto.createHash("sha256").update(ip).digest("hex");
}

function isUuid(v: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    v
  );
}

export default async function MediaPage({
  params,
}: {
  params: Promise<{ id?: string }>;
}) {
  const resolvedParams = await params;
  const qrId = resolvedParams?.id;

  // Production: no debug detail
  if (!qrId || !isUuid(qrId)) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui" }}>
        <h2 style={{ margin: 0, color: HI5_NAVY }}>QR Not Found</h2>
        <p style={{ opacity: 0.8, marginTop: 8, color: HI5_NAVY }}>
          This link is invalid or expired.
        </p>
      </main>
    );
  }

  const { data: qr, error: qrError } = await supabase
    .from("qr_codes")
    .select("id, type, title, storage_path, mime_type, original_name")
    .eq("id", qrId)
    .single();

  if (qrError || !qr) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui" }}>
        <h2 style={{ margin: 0, color: HI5_NAVY }}>QR Not Found</h2>
        <p style={{ opacity: 0.8, marginTop: 8, color: HI5_NAVY }}>
          This link is invalid or expired.
        </p>
      </main>
    );
  }

  // Scan logging
  const h = await headers();
  const ua = h.get("user-agent") ?? "";
  const ref = h.get("referer") ?? "";
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";

  const device_type = deviceTypeFromUA(ua);
  const ip_hash = ip ? hashIp(ip) : null;

  await supabase.from("scans").insert({
    qr_id: qrId,
    device_type,
    user_agent: ua,
    referrer: ref,
    ip_hash,
  });

  // Signed URL generation (quietly, production-friendly)
  let signedUrl: string | null = null;

  if (qr.storage_path) {
    const parts = qr.storage_path.split("/");
    const fileName = parts.pop()!;
    const folder = parts.join("/");

    const { data: listed, error: listErr } = await supabase.storage
      .from("hi5qr-uploads")
      .list(folder, { limit: 100 });

    if (!listErr) {
      const exists = (listed ?? []).some((x) => x.name === fileName);

      if (exists) {
        const { data: signed, error: signErr } = await supabase.storage
          .from("hi5qr-uploads")
          .createSignedUrl(qr.storage_path, 3600);

        if (!signErr) signedUrl = signed?.signedUrl ?? null;
      }
    }
  }

  const Hi5Badge = () => (
    <div
      style={{
        position: "absolute",
        top: 14,
        left: 14,
        zIndex: 10,
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 10px",
        borderRadius: 16,
        background: "rgba(255,255,255,0.86)",
        border: `1px solid rgba(12,26,43,0.14)`,
        boxShadow: "0 12px 34px rgba(0,0,0,0.14)",
        backdropFilter: "blur(12px)",
      }}
      title="HI5"
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 14,
          background: `linear-gradient(135deg, ${HI5_ORANGE}, #ffb03a)`,
          display: "grid",
          placeItems: "center",
          boxShadow: "0 10px 24px rgba(222,138,2,0.30)",
          overflow: "hidden",
        }}
      >
        <img
          src={HI5_LOGO_SRC}
          alt="HI5"
          style={{ width: 24, height: 24, objectFit: "contain" }}
        />
      </div>

      <div
        style={{
          fontWeight: 900,
          letterSpacing: 0.6,
          color: HI5_NAVY,
          lineHeight: 1,
          fontSize: 14,
        }}
      >
        HI5
      </div>
    </div>
  );

  const DownloadButton = ({ href }: { href: string }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{
        position: "absolute",
        top: 14,
        right: 14,
        zIndex: 10,
        textDecoration: "none",
        background: `linear-gradient(135deg, ${HI5_NAVY}, #0a1422)`,
        color: "#fff",
        border: `1px solid rgba(222,138,2,0.35)`,
        padding: "10px 14px",
        borderRadius: 18,
        fontSize: 13,
        fontWeight: 800,
        letterSpacing: 0.25,
        boxShadow: "0 14px 40px rgba(12,26,43,0.32)",
        backdropFilter: "blur(10px)",
      }}
      title="Open / Download"
    >
      Open / Download
    </a>
  );

  const PoweredBy = () => (
    <div
      style={{
        position: "absolute",
        bottom: 12,
        right: 14,
        zIndex: 10,
        fontSize: 12,
        background: "rgba(255,255,255,0.72)",
        border: `1px solid rgba(12,26,43,0.12)`,
        padding: "7px 11px",
        borderRadius: 999,
        backdropFilter: "blur(10px)",
        color: HI5_NAVY,
        boxShadow: "0 10px 26px rgba(0,0,0,0.10)",
      }}
    >
      Powered by{" "}
      <span style={{ fontWeight: 900, color: HI5_ORANGE }}>hi5qr.com</span>
    </div>
  );

  const CenterCard = ({
    title,
    subtitle,
  }: {
    title: string;
    subtitle?: string;
  }) => (
    <div
      style={{
        height: "100%",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "min(600px, 100%)",
          borderRadius: 22,
          border: `1px solid rgba(12,26,43,0.14)`,
          boxShadow: "0 18px 55px rgba(0,0,0,0.12)",
          padding: 22,
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(14px)",
          color: HI5_NAVY,
        }}
      >
        <h2 style={{ margin: 0 }}>{title}</h2>
        {subtitle ? (
          <p style={{ marginTop: 10, opacity: 0.82, lineHeight: 1.55 }}>
            {subtitle}
          </p>
        ) : null}
        <p style={{ marginTop: 14, fontSize: 12, opacity: 0.65 }}>
          Secure access • Link expires in ~1 hour (refresh to regenerate).
        </p>
      </div>
    </div>
  );

  return (
    <main
      style={{
        fontFamily: "system-ui",
        height: "100vh",
        width: "100vw",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        position: "relative",
        background: `radial-gradient(950px 520px at 12% 0%, rgba(222,138,2,0.18), transparent 60%),
                     radial-gradient(1200px 700px at 90% 10%, rgba(12,26,43,0.22), transparent 60%),
                     ${HI5_NAVY}`,
      }}
    >
      <Hi5Badge />
      <PoweredBy />
      <RedirectToApp qrId={qrId} /> {/* ✅ NEW */}

      {!qr.storage_path ? (
        <CenterCard
          title="No file attached"
          subtitle="This QR is valid, but it doesn’t have a file linked yet."
        />
      ) : !signedUrl ? (
        <CenterCard
          title="Couldn’t open file"
          subtitle="This file isn’t available right now. Please refresh the page or try again."
        />
      ) : qr.mime_type === "application/pdf" ? (
        <>
          <DownloadButton href={signedUrl} />
          <iframe
            src={signedUrl}
            title="PDF Preview"
            style={{
              width: "100vw",
              height: "100vh",
              border: 0,
              display: "block",
              background: "#fff",
            }}
          />
        </>
      ) : (
        <>
          <DownloadButton href={signedUrl} />
          <CenterCard
            title={qr.original_name ?? "File"}
            subtitle="This file type isn’t previewed inline yet. Use the button to open or download."
          />
        </>
      )}
    </main>
  );
}