import { NextResponse } from "next/server";
import { existsSync, readFileSync } from "fs";
import { resolve, sep } from "path";
import { LOCAL_STORAGE_ROOT } from "@/lib/storage/adapter";

// Without this allowlist, bucket=".." resolved to the repo root (e.g. .env).
const ALLOWED_BUCKETS = new Set(["game-covers", "post-covers", "press-kit", "montage-videos"]);

export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) => {
  if (process.env.STORAGE_PROVIDER !== "local") {
    return new NextResponse(null, { status: 404 });
  }

  const { path: pathSegments } = await params;
  const [bucket, ...rest] = pathSegments ?? [];
  if (!bucket) {
    return new NextResponse(null, { status: 404 });
  }

  if (!ALLOWED_BUCKETS.has(bucket)) {
    return new NextResponse(null, { status: 404 });
  }

  // Traversal guard: resolved path must stay inside the bucket dir.
  const bucketDir = resolve(LOCAL_STORAGE_ROOT, bucket);
  const full = resolve(bucketDir, rest.join("/"));
  if (!full.startsWith(bucketDir + sep)) {
    return new NextResponse(null, { status: 403 });
  }

  if (!existsSync(full)) {
    return new NextResponse(null, { status: 404 });
  }

  const buffer = readFileSync(full);
  return new NextResponse(buffer, {
    status: 200,
    headers: { "content-type": "application/octet-stream" },
  });
};
