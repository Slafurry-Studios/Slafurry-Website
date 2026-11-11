import { NextResponse } from "next/server";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { LOCAL_STORAGE_ROOT } from "@/lib/storage/adapter";

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

  const filePath = rest.join("/");
  const full = join(LOCAL_STORAGE_ROOT, bucket, filePath);

  // Traversal guard: resolved path must stay inside the bucket dir.
  const bucketDir = join(LOCAL_STORAGE_ROOT, bucket);
  if (!full.startsWith(bucketDir + "/") && full !== bucketDir) {
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
