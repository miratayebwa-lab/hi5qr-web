export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  HttpError,
  safeFileName,
  validateUploadCreateBody,
} from "@/lib/uploadsPolicy";

const BUCKET = "hi5-uploads";
const UPLOAD_EXPIRES_SECONDS = 600; // 10 minutes

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ Quick diagnostics (NO secrets printed)
    console.log("[uploads/create] runtime=nodejs");
    console.log("[uploads/create] has SUPABASE_URL:", !!process.env.SUPABASE_URL);
    console.log(
      "[uploads/create] has SERVICE_ROLE:",
      !!process.env.SUPABASE_SERVICE_ROLE_KEY || !!process.env.SUPABASE_SERVICE_ROLE
    );

    const v = validateUploadCreateBody(body);
    const fileName = safeFileName(v.originalName);

    console.log("[uploads/create] step=insert qr_items");

    // 1) Create DB row (PENDING)
    const { data: row, error: insertErr } = await supabaseAdmin
      .from("qr_items")
      .insert({
        mode: "MODE_2",
        type: v.type,
        status: "PENDING",
        storage_bucket: BUCKET,
        original_name: v.originalName,
        mime_type: v.mimeType,
        size_bytes: v.sizeBytes,
        created_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (insertErr || !row) {
      console.error("[uploads/create] insertErr:", insertErr);
      throw new Error(insertErr?.message || "Failed to create qr_items row");
    }

    const qrId = row.id as string;
    const path = `mode2/${qrId}/${fileName}`;

    console.log("[uploads/create] step=update storage_path", { qrId });

    // 2) Update row with storage_path
    const { error: updateErr } = await supabaseAdmin
      .from("qr_items")
      .update({ storage_path: path })
      .eq("id", qrId);

    if (updateErr) {
      console.error("[uploads/create] updateErr:", updateErr);
      throw new Error(updateErr.message);
    }

    console.log("[uploads/create] step=createSignedUploadUrl", { bucket: BUCKET });

    // 3) Create signed upload URL
    const { data: signed, error: signedErr } = await supabaseAdmin.storage
      .from(BUCKET)
      .createSignedUploadUrl(path, { upsert: false });

    if (signedErr || !signed) {
      console.error("[uploads/create] signedErr:", signedErr);
      throw new Error(signedErr?.message || "Failed to create signed upload URL");
    }

    console.log("[uploads/create] DEBUG ROUTE v2 ACTIVE");
    console.log("[uploads/create] OK", { qrId });

    return NextResponse.json({
      ok: true,
      qrId,
      upload: {
        bucket: BUCKET,
        path,
        signedUrl: signed.signedUrl,
        expiresSeconds: UPLOAD_EXPIRES_SECONDS,
      },
    });
  } catch (err: any) {
    console.error("[uploads/create] FAILED:", err);
    const status = err instanceof HttpError ? err.status : 500;
    const message = err?.message || "Server error";
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}