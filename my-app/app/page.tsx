"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

interface Animal {
  id: string;
  name: string;
  species: string;
  age?: number;
  description?: string;
  image?: string;
  location?: string;
  birthDate?: string;
  naturalHabitat?: string;
}

export default function HomePage() {
  const [animals, setAnimals] = useState<Animal[]>([]);

  // Fetch animals from API
  const fetchAnimals = async () => {
    try {
      const res = await fetch("/api/animals");
      const data = await res.json();
      setAnimals(data);
    } catch (err) {
      console.error("Failed to fetch animals:", err);
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Navbar />

      {/* Welcome Section */}
      <section className="text-center py-20 bg-gray-100 dark:bg-gray-800 transition-colors">
        <h2 className="text-4xl font-extrabold mb-4 text-gray-800 dark:text-gray-100">
          Welcome to the Calgary Zoo
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          Explore our amazing collection of animals and make a visit unforgettable!
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/gettickets"
            className="bg-blue-700 dark:bg-blue-600 text-white px-6 py-3 rounded font-extrabold hover:bg-blue-800 dark:hover:bg-blue-700 transition"
          >
            Book Tickets
          </Link>
          <Link
            href="/getmembership"
            className="bg-gray-700 dark:bg-gray-600 text-white px-6 py-3 rounded font-extrabold hover:bg-gray-800 dark:hover:bg-gray-700 transition"
          >
            Get Membership
          </Link>
        </div>
      </section>

      {/* Our Animals Section */}
      <section className="py-20 px-6">
        <h2 className="text-3xl font-extrabold mb-1 text-center text-gray-800 dark:text-gray-100">
          Our Animals
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-10">
          Scroll down to see the animals in our zoo.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {animals.map((animal) => (
            <Link
              key={animal.id}
              href={`/animal/${animal.id}`}
              className="bg-gray-50 dark:bg-gray-800 rounded shadow overflow-hidden hover:shadow-lg transition cursor-pointer"
            >
              {animal.image ? (
                <img
                  src={animal.image}
                  alt={animal.name}
                  className="w-full h-64 object-cover"
                />
              ) : (
                <div className="w-full h-64 bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-600 dark:text-gray-300">
                    No image available
                  </span>
                </div>
              )}
              <div className="p-4 text-center">
                <h3 className="text-3xl font-extrabold text-white dark:text-white mb-1">
                  {animal.name}
                </h3>
                <p className="text-xl font-extrabold text-white dark:text-white mb-1">
                  {animal.species}
                </p>
                {animal.location && (
                  <p className="text-xl font-extrabold text-white dark:text-white">
                    Located in the {animal.location}!
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
