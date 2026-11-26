import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeAdmin } from "@/lib/auth/admin-guard";

export async function GET() {
  const auth = await authorizeAdmin();
  if (!auth.ok) return auth.response;

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
  const auth = await authorizeAdmin();
  if (!auth.ok) return auth.response;

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
