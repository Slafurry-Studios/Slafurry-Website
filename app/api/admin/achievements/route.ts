import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createHash } from "crypto";

export async function GET() {
  try {
    const achievements = await prisma.achievement.findMany({
      orderBy: [{ category: "asc" }, { order: "asc" }, { title: "asc" }],
      select: {
        id: true,
        key: true,
        title: true,
        description: true,
        hint: true,
        icon: true,
        triggerType: true,
        triggerConfig: true,
        isSecret: true,
        category: true,
        order: true,
        isActive: true,
        // NEVER return flagHash to the admin UI
      },
    });
    return NextResponse.json(achievements);
  } catch (error) {
    console.error("List achievements error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const key = typeof body.key === "string" ? body.key.trim() : "";
    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!key || !title) {
      return NextResponse.json({ error: "Key and title are required." }, { status: 400 });
    }

    const existing = await prisma.achievement.findUnique({ where: { key } });
    if (existing) {
      return NextResponse.json({ error: "An achievement with this key already exists." }, { status: 409 });
    }

    const triggerType = body.triggerType || "PAGE_VISIT";
    const triggerConfig = body.triggerConfig ?? {};

    // For FLAG_CODE: hash the plaintext code and store in flagHash
    let flagHash: string | null = null;
    if (triggerType === "FLAG_CODE" && typeof body.flagCode === "string" && body.flagCode.trim()) {
      flagHash = createHash("sha256").update(body.flagCode.trim(), "utf8").digest("hex");
    }

    const achievement = await prisma.achievement.create({
      data: {
        key,
        title,
        description: body.description || "",
        hint: body.hint || null,
        icon: body.icon || "/mascot-default.png",
        triggerType,
        triggerConfig,
        flagHash,
        isSecret: Boolean(body.isSecret),
        category: body.category || null,
        order: typeof body.order === "number" ? body.order : 0,
        isActive: typeof body.isActive === "boolean" ? body.isActive : true,
      },
    });

    return NextResponse.json(achievement, { status: 201 });
  } catch (error) {
    console.error("Create achievement error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
