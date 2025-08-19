import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface Params {
  params: { id: string };
}

export async function POST(req: Request, { params }: Params) {
  try {
    const userId = params.id;
    const { date, tickets } = await req.json();

    if (!date || !tickets || !Array.isArray(tickets) || tickets.length === 0) {
      return NextResponse.json({ error: "Invalid ticket data" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        tickets: {
          push: tickets.map((t: any) => ({
            date: new Date(date),
            ticketType: t.ticketType,
            quantity: t.quantity,
          })),
        },
      },
    });

    return NextResponse.json({ message: "Tickets booked!", tickets: updatedUser.tickets });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to book tickets" }, { status: 500 });
  }
}
