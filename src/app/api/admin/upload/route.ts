import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAdminAuthenticated } from "@/lib/admin/actions";
import { getSupabaseConfig } from "@/lib/env";

export const runtime = "nodejs";

const BUCKET = "cms-media";
const MAX_BYTES = 50 * 1024 * 1024; // 50 MB (covers short videos)
const ALLOWED = /^(image\/(png|jpe?g|webp|gif|svg\+xml|avif)|video\/(mp4|webm|quicktime|ogg))$/;

/**
 * Admin media upload → Supabase Storage (public bucket `cms-media`).
 * Returns a public URL for use in page-builder image/video blocks.
 */
export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cfg = getSupabaseConfig();
  if (!cfg?.serviceRoleKey) {
    return NextResponse.json(
      { error: "Storage is not configured (missing SUPABASE_SERVICE_ROLE_KEY)." },
      { status: 500 },
    );
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `File too large (max ${Math.round(MAX_BYTES / 1024 / 1024)} MB).` },
      { status: 413 },
    );
  }
  if (!ALLOWED.test(file.type)) {
    return NextResponse.json(
      { error: `Unsupported file type: ${file.type || "unknown"}.` },
      { status: 415 },
    );
  }

  const supabase = createClient(cfg.url, cfg.serviceRoleKey, {
    auth: { persistSession: false },
  });

  // Ensure the public bucket exists (idempotent).
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    if (!buckets?.some((b) => b.name === BUCKET)) {
      await supabase.storage.createBucket(BUCKET, {
        public: true,
        fileSizeLimit: MAX_BYTES,
      });
    }
  } catch {
    // If listing/creating fails we still attempt the upload below.
  }

  const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const kind = file.type.startsWith("video") ? "video" : "image";
  const path = `${kind}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error } = await supabase.storage.from(BUCKET).upload(path, bytes, {
    contentType: file.type,
    upsert: false,
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl, kind, path });
}
