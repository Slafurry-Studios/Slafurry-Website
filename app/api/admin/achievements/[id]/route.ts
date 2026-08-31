import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createHash } from "crypto";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.achievement.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Achievement not found." }, { status: 404 });
    }

    // Key uniqueness check if changed
    const key = body.key ?? existing.key;
    if (key !== existing.key) {
      const keyTaken = await prisma.achievement.findUnique({ where: { key } });
      if (keyTaken) {
        return NextResponse.json({ error: "An achievement with this key already exists." }, { status: 409 });
      }
    }

    const triggerType = body.triggerType ?? existing.triggerType;
    const triggerConfig = body.triggerConfig ?? existing.triggerConfig;

    // For FLAG_CODE: hash new plaintext code if provided, NEVER return hash
    let flagHash = existing.flagHash;
    if (triggerType === "FLAG_CODE" && typeof body.flagCode === "string" && body.flagCode.trim()) {
      flagHash = createHash("sha256").update(body.flagCode.trim(), "utf8").digest("hex");
    } else if (triggerType !== "FLAG_CODE") {
      flagHash = null;
    }

    const achievement = await prisma.achievement.update({
      where: { id },
      data: {
        key,
        title: body.title ?? existing.title,
        description: body.description ?? existing.description,
        hint: body.hint !== undefined ? body.hint || null : existing.hint,
        icon: body.icon ?? existing.icon,
        triggerType,
        triggerConfig,
        flagHash,
        isSecret: typeof body.isSecret === "boolean" ? body.isSecret : existing.isSecret,
        category: body.category !== undefined ? body.category || null : existing.category,
        order: typeof body.order === "number" ? body.order : existing.order,
        isActive: typeof body.isActive === "boolean" ? body.isActive : existing.isActive,
      },
    });

    return NextResponse.json(achievement);
  } catch (error) {
    console.error("Update achievement error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.achievement.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Achievement not found." }, { status: 404 });
    }

    await prisma.achievement.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete achievement error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
