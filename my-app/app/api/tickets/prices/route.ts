import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type TicketPriceType = "CHILD" | "ADULT" | "SENIOR";

interface TicketPrice {
  CHILD: number;
  ADULT: number;
  SENIOR: number;
}

const DEFAULT_PRICES: TicketPrice = { CHILD: 10, ADULT: 20, SENIOR: 15 };

// GET /api/tickets/prices
export async function GET() {
  try {
    const prices = await prisma.ticketPrice.findUnique({
      where: { id: "default" },
    });

    // If not found, return default fallback
    return NextResponse.json(prices || DEFAULT_PRICES);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch prices" }, { status: 500 });
  }
}

// PUT /api/tickets/prices
export async function PUT(req: Request) {
  try {
    const { type, price }: { type: TicketPriceType; price: number } = await req.json();

    if (!["CHILD", "ADULT", "SENIOR"].includes(type)) {
      return NextResponse.json({ error: "Invalid ticket type" }, { status: 400 });
    }

    const updated = await prisma.ticketPrice.upsert({
      where: { id: "default" },
      update: { [type]: price },
      create: { id: "default", ...DEFAULT_PRICES, [type]: price },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update price" }, { status: 500 });
  }
}
