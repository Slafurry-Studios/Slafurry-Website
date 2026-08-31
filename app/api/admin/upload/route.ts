import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

const ALLOWED_BUCKETS = [
  "game-covers",
  "post-covers",
  "press-kit",
  "montage-videos",
] as const;

type Bucket = (typeof ALLOWED_BUCKETS)[number];

function isValidBucket(v: string): v is Bucket {
  return (ALLOWED_BUCKETS as readonly string[]).includes(v);
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const bucket = formData.get("bucket") as string | null;
    const altText = formData.get("altText") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }
    if (!bucket || !isValidBucket(bucket)) {
      return NextResponse.json(
        { error: `Invalid bucket. Must be one of: ${ALLOWED_BUCKETS.join(", ")}` },
        { status: 400 }
      );
    }
    if (!altText || !altText.trim()) {
      return NextResponse.json(
        { error: "Alt text is required." },
        { status: 400 }
      );
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10 MB." },
        { status: 400 }
      );
    }

    // Generate a unique path: bucket/timestamp-random-ext
    const ext = file.name.split(".").pop() || "bin";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const path = `${filename}`;

    const supabase = createServiceRoleClient();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json(
        { error: `Upload failed: ${error.message}` },
        { status: 500 }
      );
    }

    // Build the public URL
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;

    return NextResponse.json({
      url: publicUrl,
      altText: altText.trim(),
      bucket,
      filename,
    });
  } catch (error) {
    console.error("Upload route error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
