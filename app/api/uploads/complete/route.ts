export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { HttpError } from "@/lib/uploadsPolicy";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const qrId = body?.qrId as string;

    if (!qrId || typeof qrId !== "string") {
      throw new HttpError(400, "qrId is required");
    }

    // Ensure row exists
    const { data: row, error: getErr } = await supabaseAdmin
      .from("qr_items")
      .select("id,status,storage_bucket,storage_path")
      .eq("id", qrId)
      .single();

    if (getErr || !row) {
      throw new HttpError(404, "QR item not found");
    }

    // Mark READY (Phase 1: trust client upload succeeded)
    const { error: updErr } = await supabaseAdmin
      .from("qr_items")
      .update({ status: "READY" })
      .eq("id", qrId);

    if (updErr) {
      throw new Error(updErr.message);
    }

    return NextResponse.json({ ok: true, qrId });
  } catch (err: any) {
    const status = err instanceof HttpError ? err.status : 500;
    const message = err?.message || "Server error";
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}