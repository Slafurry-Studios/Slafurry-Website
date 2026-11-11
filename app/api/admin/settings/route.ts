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
          taglineSerious: "",
          aboutText: "",
          aboutTextSerious: "",
          contactHeading: "Get in touch",
          contactHeadingSerious: "Contact us",
          contactIntro: "",
          contactIntroSerious: "",
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
        taglineSerious: body.taglineSerious || "",
        aboutText: body.aboutText || "",
        aboutTextSerious: body.aboutTextSerious || "",
        contactHeading: body.contactHeading || "Get in touch",
        contactHeadingSerious: body.contactHeadingSerious || "Contact us",
        contactIntro: body.contactIntro || "",
        contactIntroSerious: body.contactIntroSerious || "",
        foundedAt: body.foundedAt ? new Date(body.foundedAt) : new Date(),
        contactEmail: body.contactEmail || "",
        businessEmail: body.businessEmail || "",
        defaultOgImage: body.defaultOgImage || "",
      },
      update: {
        tagline: body.tagline ?? undefined,
        taglineSerious: body.taglineSerious ?? undefined,
        aboutText: body.aboutText ?? undefined,
        aboutTextSerious: body.aboutTextSerious ?? undefined,
        contactHeading: body.contactHeading ?? undefined,
        contactHeadingSerious: body.contactHeadingSerious ?? undefined,
        contactIntro: body.contactIntro ?? undefined,
        contactIntroSerious: body.contactIntroSerious ?? undefined,
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
