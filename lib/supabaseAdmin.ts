import { createClient } from "@supabase/supabase-js";

function firstDefined(...values: Array<string | undefined | null>) {
  for (const v of values) {
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return null;
}

function requireEnv(label: string, ...candidates: Array<string | undefined | null>) {
  const v = firstDefined(...candidates);
  if (!v) {
    throw new Error(
      `Missing environment variable for ${label}. Expected one of: ${candidates
        .map((_, i) => i)
        .length ? "" : ""}`
    );
  }
  return v;
}

// ✅ URL is not secret. Prefer server var, allow NEXT_PUBLIC fallback for convenience.
const supabaseUrl = firstDefined(
  process.env.SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_URL
);

if (!supabaseUrl) {
  throw new Error(
    "Missing SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) in environment variables."
  );
}

// ✅ Service role key MUST be server-only (never NEXT_PUBLIC).
const serviceRoleKey = firstDefined(
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  process.env.SUPABASE_SERVICE_ROLE
);

if (!serviceRoleKey) {
  throw new Error(
    "Missing SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SERVICE_ROLE) in environment variables."
  );
}

// ✅ Helpful logs (safe): shows only presence + a small URL prefix
console.log("SUPABASE ENV CHECK:", {
  hasUrl: true,
  hasServiceRoleKey: true,
  urlPrefix: supabaseUrl.slice(0, 35),
});

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});