import { NextResponse } from "next/server";
import { getStorageProvider } from "@/lib/storage/adapter";

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
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10 MB." },
        { status: 500 }
      );
    }

    const ext = file.name.split(".").pop() || "bin";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const path = filename;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const storage = getStorageProvider();
    const { url } = await storage.upload({ file: { buffer, name: file.name, type: file.type }, bucket, path });

    return NextResponse.json({
      url,
      altText: altText?.trim() ?? "",
      bucket,
      filename: path,
    });
  } catch (error) {
    console.error("Upload route error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
