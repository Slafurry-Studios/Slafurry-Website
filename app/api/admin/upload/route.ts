import { NextResponse } from "next/server";
import { getStorageProvider } from "@/lib/storage/adapter";
import { authorizeAdmin } from "@/lib/auth/admin-guard";

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

// Files land in public buckets, so refuse anything a browser would execute
// when opened directly (HTML/SVG/XML can carry script).
const BLOCKED_EXTENSIONS = new Set(["html", "htm", "xhtml", "svg", "svgz", "xml", "js", "mjs"]);
const BLOCKED_TYPE = /(html|svg|xml|javascript|ecmascript)/i;

export async function POST(request: Request) {
  const auth = await authorizeAdmin();
  if (!auth.ok) return auth.response;

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
        { status: 400 }
      );
    }

    const rawExt = file.name.includes(".") ? file.name.split(".").pop()!.toLowerCase() : "";
    const ext = /^[a-z0-9]{1,10}$/.test(rawExt) ? rawExt : "bin";
    if (BLOCKED_EXTENSIONS.has(ext) || BLOCKED_TYPE.test(file.type)) {
      return NextResponse.json({ error: "This file type is not allowed." }, { status: 400 });
    }
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
    const err = error as { message?: string; status?: number };
    console.error("Upload route error:", {
      message: err.message,
      status: err.status,
    });
    return NextResponse.json(
      { error: err.message || "Upload failed." },
      { status: err.status ?? 500 }
    );
  }
}
