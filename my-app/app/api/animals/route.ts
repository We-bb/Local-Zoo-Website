import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all animals
export async function GET() {
  try {
    const animals = await prisma.animal.findMany();
    return NextResponse.json(animals);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch animals" }, { status: 500 });
  }
}

// POST a new animal
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const animal = await prisma.animal.create({
      data: {
        ...body,
        age: body.age ?? undefined,
        birthDate: body.birthDate ? new Date(body.birthDate) : undefined,
      },
    });
    return NextResponse.json(animal, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create animal" }, { status: 500 });
  }
}
