import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { ObjectId } from "bson";

interface Params { params: { id: string }; }

function ensureValidId(id: string): string {
  if (!id || !ObjectId.isValid(id)) {
    throw Object.assign(new Error("Invalid ObjectId format"), { status: 400 });
  }
  return id;
}

export async function GET(req: Request, { params }: Params) {
  try {
    const id = ensureValidId(params.id);
    const animal = await prisma.animal.findUnique({ where: { id } });
    if (!animal) return NextResponse.json({ error: "Animal not found" }, { status: 404 });
    return NextResponse.json(animal);
  } catch (err: any) {
    const status = err?.status ?? 500;
    return NextResponse.json({ error: status === 400 ? "Invalid ID" : "Failed to fetch animal" }, { status });
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const id = ensureValidId(params.id);
    const data = await req.json();

    const updated = await prisma.animal.update({
      where: { id },
      data: {
        name: data.name,
        species: data.species,
        age: data.age !== undefined ? Number(data.age) : undefined,
        description: data.description,
        image: data.image,
        location: data.location,
        naturalHabitat: data.naturalHabitat,
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    if (err?.code === "P2025") return NextResponse.json({ error: "Animal not found" }, { status: 404 });
    const status = err?.status ?? 500;
    return NextResponse.json({ error: status === 400 ? "Invalid ID" : "Failed to update animal" }, { status });
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const id = ensureValidId(params.id);
    await prisma.animal.delete({ where: { id } });
    return NextResponse.json({ message: "Animal deleted" });
  } catch (err: any) {
    if (err?.code === "P2025") return NextResponse.json({ error: "Animal not found" }, { status: 404 });
    const status = err?.status ?? 500;
    return NextResponse.json({ error: status === 400 ? "Invalid ID" : "Failed to delete animal" }, { status });
  }
}
