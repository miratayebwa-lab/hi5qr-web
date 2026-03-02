export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { HttpError } from "@/lib/uploadsPolicy";

const PUBLIC_VIEW_BASE = "https://www.hi5qr.com/m";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const qrId = body?.qrId;

    if (!qrId || typeof qrId !== "string") {
      throw new HttpError(400, "Invalid 'qrId'.");
    }

    // 1) Read row
    const { data: item, error: readErr } = await supabaseAdmin
      .from("qr_items")
      .select("id, type, status, storage_bucket, storage_path")
      .eq("id", qrId)
      .single();

    if (readErr || !item) {
      throw new HttpError(404, "QR item not found.");
    }

    // TEXT doesn't need finalize (no file in storage)
    if (item.type === "TEXT") {
      // Mark READY anyway if you want, but usually TEXT is ready at creation time.
      return NextResponse.json({
        ok: true,
        qrId,
        viewerUrl: `${PUBLIC_VIEW_BASE}/${qrId}`,
        note: "TEXT items do not require upload finalize.",
      });
    }

    if (!item.storage_bucket || !item.storage_path) {
      throw new HttpError(400, "Missing storage info for this QR item.");
    }

    // 2) Verify object exists in storage (list the file's folder and check for name)
    const path = item.storage_path as string;
    const lastSlash = path.lastIndexOf("/");
    const folder = lastSlash >= 0 ? path.slice(0, lastSlash) : "";
    const filename = lastSlash >= 0 ? path.slice(lastSlash + 1) : path;

    const { data: objects, error: listErr } = await supabaseAdmin.storage
      .from(item.storage_bucket)
      .list(folder, { limit: 100, search: filename });

    if (listErr) {
      throw new Error(listErr.message);
    }

    const exists = (objects || []).some((o) => o.name === filename);

    if (!exists) {
      throw new HttpError(409, "Upload not found yet. Please upload the file first, then finalize.");
    }

    // 3) Update DB status to READY
    const { error: updateErr } = await supabaseAdmin
      .from("qr_items")
      .update({ status: "READY", ready_at: new Date().toISOString() })
      .eq("id", qrId);

    if (updateErr) {
      throw new Error(updateErr.message);
    }

    return NextResponse.json({
      ok: true,
      qrId,
      viewerUrl: `${PUBLIC_VIEW_BASE}/${qrId}`,
    });
  } catch (err: any) {
    const status = err instanceof HttpError ? err.status : 500;
    const message = err?.message || "Server error";
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}