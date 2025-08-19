// app/api/users/[id]/membership/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Use `export const dynamic` if needed
export const dynamic = "force-dynamic";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  // ✅ Do NOT destructure inside the signature in some Next.js versions
  // Access params safely
  const id = params.id;

  try {
    const body = await req.json();
    const membership = body.membership;

    if (!membership) {
      return NextResponse.json({ error: "Membership is required" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { membership },
    });

    return NextResponse.json({
      id: updatedUser.id,
      membership: updatedUser.membership,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "User not found or server error" }, { status: 500 });
  }
}
