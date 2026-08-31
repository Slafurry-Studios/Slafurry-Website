import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";

type RedeemResponse =
  | { success: true; achievement: { key: string; title: string; description: string; icon: string } }
  | { success: false; error: string };

function sha256(input: string): string {
  return createHash("sha256").update(input, "utf8").digest("hex");
}

export async function POST(
  request: Request
): Promise<NextResponse<RedeemResponse>> {
  try {
    const body = await request.json();
    const code = typeof body.code === "string" ? body.code.trim() : "";

    if (!code) {
      return NextResponse.json(
        { success: false, error: "No code provided." },
        { status: 400 }
      );
    }

    const codeHash = sha256(code);

    // Find any active FLAG_CODE achievement whose flagHash matches.
    // We never return flagHash to the client.
    const achievement = await prisma.achievement.findFirst({
      where: {
        triggerType: "FLAG_CODE",
        isActive: true,
        flagHash: codeHash,
      },
      select: {
        id: true,
        key: true,
        title: true,
        description: true,
        icon: true,
      },
    });

    if (!achievement) {
      return NextResponse.json(
        { success: false, error: "That code doesn't seem right." },
        { status: 404 }
      );
    }

    // Achievement found — return it. The client is responsible for
    // persisting the unlock in localStorage via the achievement storage module.
    return NextResponse.json({
      success: true,
      achievement: {
        key: achievement.key,
        title: achievement.title,
        description: achievement.description,
        icon: achievement.icon,
      },
    });
  } catch (error) {
    console.error("Achievement redeem error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong." },
      { status: 500 }
    );
  }
}
