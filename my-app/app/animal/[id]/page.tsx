// app/animal/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";

interface AnimalPageProps {
  params: { id: string };
}

export default async function AnimalPage({ params }: AnimalPageProps) {
  const { id } = params;

  // Fetch the animal from the database
  const animal = await prisma.animal.findUnique({
    where: { id },
  });

  if (!animal) {
    return (
      <p className="text-center mt-10 text-red-600 dark:text-red-400 font-semibold">
        Animal not found
      </p>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Navbar />

      <section className="max-w-4xl mx-auto mt-8 bg-gray-100 dark:bg-gray-800 rounded shadow-md p-6 transition-colors">
        {/* Image */}
        {animal.image ? (
          <img
            src={animal.image}
            alt={animal.name}
            className="w-full h-64 object-cover rounded mb-4"
          />
        ) : (
          <div className="w-full h-64 bg-gray-300 dark:bg-gray-700 flex items-center justify-center rounded mb-4">
            <span className="text-gray-600 dark:text-gray-300">No image available</span>
          </div>
        )}

        {/* Name & Species */}
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">{animal.name}</h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-4">{animal.species}</p>

        {/* Age */}
        {animal.age !== null && (
          <p className="text-gray-700 dark:text-gray-300 mb-2">Age: {animal.age} years</p>
        )}

        {/* Birth Date */}
        {animal.birthDate && (
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            Birth Date: {new Date(animal.birthDate).toLocaleDateString()}
          </p>
        )}

        {/* Location */}
        {animal.location && (
          <p className="text-gray-700 dark:text-gray-300 mb-2">Location: {animal.location}</p>
        )}

        {/* Natural Habitat */}
        {animal.naturalHabitat && (
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            Natural Habitat: {animal.naturalHabitat}
          </p>
        )}

        {/* Description */}
        {animal.description && (
          <p className="text-gray-700 dark:text-gray-300 mt-4">{animal.description}</p>
        )}
      </section>
    </main>
  );
}
