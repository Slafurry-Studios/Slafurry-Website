import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          id: 1,
          tagline: "",
          aboutText: "",
          contactHeading: "Get in touch",
          contactIntro: "",
          foundedAt: new Date(),
          contactEmail: "",
          businessEmail: "",
          defaultOgImage: "",
        },
      });
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const settings = await prisma.siteSettings.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        tagline: body.tagline || "",
        aboutText: body.aboutText || "",
        contactHeading: body.contactHeading || "Get in touch",
        contactIntro: body.contactIntro || "",
        foundedAt: body.foundedAt ? new Date(body.foundedAt) : new Date(),
        contactEmail: body.contactEmail || "",
        businessEmail: body.businessEmail || "",
        defaultOgImage: body.defaultOgImage || "",
      },
      update: {
        tagline: body.tagline ?? undefined,
        aboutText: body.aboutText ?? undefined,
        contactHeading: body.contactHeading ?? undefined,
        contactIntro: body.contactIntro ?? undefined,
        foundedAt: body.foundedAt ? new Date(body.foundedAt) : undefined,
        contactEmail: body.contactEmail ?? undefined,
        businessEmail: body.businessEmail ?? undefined,
        defaultOgImage: body.defaultOgImage ?? undefined,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
