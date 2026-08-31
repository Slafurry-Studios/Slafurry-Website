import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const links = await prisma.socialLink.findMany({
      orderBy: [{ section: "asc" }, { order: "asc" }],
    });
    return NextResponse.json(links);
  } catch (error) {
    console.error("List social links error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const platform = typeof body.platform === "string" ? body.platform.trim() : "";
    const label = typeof body.label === "string" ? body.label.trim() : "";
    const url = typeof body.url === "string" ? body.url.trim() : "";
    const section = ["COMMUNITY", "CONTACT", "FOOTER"].includes(body.section)
      ? body.section
      : "FOOTER";

    if (!platform || !label || !url) {
      return NextResponse.json(
        { error: "Platform, label, and URL are required." },
        { status: 400 }
      );
    }

    const link = await prisma.socialLink.create({
      data: {
        platform,
        label,
        url,
        section,
        order: typeof body.order === "number" ? body.order : 0,
      },
    });

    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    console.error("Create social link error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
