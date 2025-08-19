import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type TicketType = "CHILD" | "ADULT" | "SENIOR";

interface Quantities {
  [key: string]: unknown; // we will cast to number later
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { date, quantities, userId } = body as { date: string; quantities: Quantities; userId: string };

    if (!userId) return NextResponse.json({ error: "Missing user ID" }, { status: 401 });
    if (!date || !quantities || typeof quantities !== "object") {
      return NextResponse.json({ error: "Invalid ticket data" }, { status: 400 });
    }

    // Convert quantities object to array and cast qty to number
    const ticketsArray = Object.entries(quantities)
      .filter(([_, qty]) => Number(qty) > 0)
      .map(([ticketType, qty]) => ({
        date: new Date(date),
        ticketType: ticketType as TicketType, // cast to TicketType
        quantity: Number(qty),
      }));

    if (ticketsArray.length === 0) {
      return NextResponse.json({ error: "No tickets selected" }, { status: 400 });
    }

    // Update user tickets
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        tickets: { push: ticketsArray },
      },
    });

    return NextResponse.json({ message: "Tickets booked!", tickets: updatedUser.tickets });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to book tickets" }, { status: 500 });
  }
}
