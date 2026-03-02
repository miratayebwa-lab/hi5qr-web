// lib/uploadsPolicy.ts

export type UploadType = "IMAGE" | "PDF" | "AUDIO" | "VIDEO" | "DOCUMENT";

export const UploadPolicy = {
  IMAGE: {
    maxBytes: 8 * 1024 * 1024, // 8 MB
    mimes: ["image/jpeg", "image/png", "image/webp"],
  },
  PDF: {
    maxBytes: 20 * 1024 * 1024, // 20 MB
    mimes: ["application/pdf"],
  },
  AUDIO: {
    maxBytes: 25 * 1024 * 1024, // 25 MB
    mimes: [
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/x-wav",
      "audio/ogg",
      "audio/webm",
    ],
  },
  VIDEO: {
    maxBytes: 60 * 1024 * 1024, // 60 MB
    mimes: ["video/mp4", "video/webm", "video/quicktime"],
  },
  DOCUMENT: {
    maxBytes: 20 * 1024 * 1024, // 20 MB
    mimes: [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "text/plain",
    ],
  },
} satisfies Record<UploadType, { maxBytes: number; mimes: readonly string[] }>;

export type UploadCreateBody = {
  type: UploadType;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
};

export type ValidatedUpload = {
  type: UploadType;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
};

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function validateUploadCreateBody(body: unknown): ValidatedUpload {
  if (!body || typeof body !== "object") {
    throw new HttpError(400, "Invalid JSON body.");
  }

  const b = body as Partial<UploadCreateBody>;

  const type = b.type;
  const originalName = b.originalName;
  const mimeType = b.mimeType;
  const sizeBytes = b.sizeBytes;

  if (!type || !isUploadType(type)) throw new HttpError(400, "Invalid 'type'.");
  if (!originalName || typeof originalName !== "string")
    throw new HttpError(400, "Invalid 'originalName'.");
  if (!mimeType || typeof mimeType !== "string")
    throw new HttpError(400, "Invalid 'mimeType'.");
  if (typeof sizeBytes !== "number" || !Number.isFinite(sizeBytes) || sizeBytes <= 0)
    throw new HttpError(400, "Invalid 'sizeBytes'.");

  const policy = UploadPolicy[type];
  const normalizedMime = mimeType.split(";")[0].trim().toLowerCase();

  if (!policy.mimes.includes(normalizedMime)) {
    throw new HttpError(
      400,
      `MIME not allowed for ${type}. Got '${normalizedMime}'. Allowed: ${policy.mimes.join(", ")}`
    );
  }

  if (sizeBytes > policy.maxBytes) {
    throw new HttpError(
      400,
      `File too large for ${type}. Max ${formatBytes(policy.maxBytes)}, got ${formatBytes(
        sizeBytes
      )}.`
    );
  }

  return {
    type,
    originalName: originalName.trim(),
    mimeType: normalizedMime,
    sizeBytes,
  };
}

export function safeFileName(originalName: string): string {
  const trimmed = originalName.trim().replace(/\s+/g, " ");
  const lastDot = trimmed.lastIndexOf(".");
  const hasExt = lastDot > 0 && lastDot < trimmed.length - 1;

  const base = hasExt ? trimmed.slice(0, lastDot) : trimmed;
  const ext = hasExt ? trimmed.slice(lastDot + 1) : "";

  const safeBase =
    base
      .toLowerCase()
      .replace(/[^a-z0-9-_ ]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 60) || "file";

  const safeExt = ext.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 10);

  return safeExt ? `${safeBase}.${safeExt}` : safeBase;
}

function isUploadType(x: string): x is UploadType {
  return x === "IMAGE" || x === "PDF" || x === "AUDIO" || x === "VIDEO" || x === "DOCUMENT";
}

function formatBytes(bytes: number): string {
  const units = ["B", "KB", "MB", "GB"];
  let b = bytes;
  let i = 0;
  while (b >= 1024 && i < units.length - 1) {
    b /= 1024;
    i++;
  }
  return `${b.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}