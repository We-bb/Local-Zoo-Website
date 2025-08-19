import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";

interface AnimalPageProps {
  params: { id: string };
}

export default async function AnimalPage({ params }: AnimalPageProps) {
  const { id } = params;

  const animal = await prisma.animal.findUnique({
    where: { id },
  });

  if (!animal) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900">
        <Navbar />
        <p className="text-red-600 dark:text-red-400 text-lg mt-10 font-semibold">
          Animal not found
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors flex flex-col">
      <Navbar />

      <section className="max-w-5xl mx-auto mt-8 bg-gray-100 dark:bg-gray-800 rounded shadow-md overflow-hidden transition-colors">
        {/* Full-width image */}
        {animal.image ? (
          <img
            src={animal.image}
            alt={animal.name}
            className="w-full h-96 object-cover"
          />
        ) : (
          <div className="w-full h-96 bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-600 dark:text-gray-300 text-lg">No image available</span>
          </div>
        )}

        {/* Info card */}
        <div className="p-6 flex flex-col gap-4">
          <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">
            {animal.name}
          </h1>
          <p className="text-2xl text-gray-700 dark:text-gray-300 font-semibold">
            {animal.species}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
            {animal.age !== null && <p><span className="font-semibold">Age:</span> {animal.age} years</p>}
            {animal.birthDate && <p><span className="font-semibold">Birth Date:</span> {new Date(animal.birthDate).toLocaleDateString()}</p>}
            {animal.location && <p><span className="font-semibold">Location:</span> {animal.location}</p>}
            {animal.naturalHabitat && <p><span className="font-semibold">Habitat:</span> {animal.naturalHabitat}</p>}
          </div>

          {animal.description && (
            <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              {animal.description}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
