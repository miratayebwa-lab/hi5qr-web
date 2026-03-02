import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TAG = "deploycheck-001";

export async function GET() {
  return NextResponse.json(
    { ok: true, tag: TAG },
    { headers: { "x-hi5-deploy": TAG } }
  );
}