import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface Body {
  membership: "BASIC" | "PLUS" | "PRO";
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const userId = params.id;
    const body: Body = await req.json();
    const { membership } = body;

    if (!["BASIC", "PLUS", "PRO"].includes(membership)) {
      return NextResponse.json({ error: "Invalid membership type" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { membership },
    });

    return NextResponse.json({ message: "Membership updated", membership: updatedUser.membership });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update membership" }, { status: 500 });
  }
}
