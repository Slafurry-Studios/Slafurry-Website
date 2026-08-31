import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const releases = await prisma.pressRelease.findMany({
      orderBy: { publishedAt: "desc" },
    });
    return NextResponse.json(releases);
  } catch (error) {
    console.error("List press releases error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const outlet = typeof body.outlet === "string" ? body.outlet.trim() : "";
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const url = typeof body.url === "string" ? body.url.trim() : "";

    if (!outlet || !title || !url) {
      return NextResponse.json(
        { error: "Outlet, title, and URL are required." },
        { status: 400 }
      );
    }

    const release = await prisma.pressRelease.create({
      data: {
        outlet,
        title,
        url,
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
      },
    });

    return NextResponse.json(release, { status: 201 });
  } catch (error) {
    console.error("Create press release error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
