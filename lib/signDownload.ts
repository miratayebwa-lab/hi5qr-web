import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function createSignedDownloadUrl(
  bucket: string,
  path: string,
  expiresSeconds: number = 600
): Promise<string> {
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .createSignedUrl(path, expiresSeconds);

  if (error || !data?.signedUrl) {
    throw new Error(error?.message || "Failed to create signed download URL");
  }

  return data.signedUrl;
}