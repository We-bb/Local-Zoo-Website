"use client";
 
import Link from "next/link";
import { FaDonate } from "react-icons/fa";
import Navbar from "@/components/Navbar";
 
export default function DonatePage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors flex flex-col">
      <Navbar />
 
      {/* Centered Donate Section */}
      <section className="flex flex-1 flex-col items-center justify-center text-center px-6">
        <FaDonate className="text-blue-700 dark:text-blue-400 text-7xl mb-6" />
 
        <h2 className="text-4xl font-extrabold mb-4 text-gray-800 dark:text-gray-100">
          Donate to the Calgary Zoo!
        </h2>
 
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mb-8">
          All donations go toward bettering the community and helping us save more
          wildlife. Your support makes a real difference!
        </p>
 
        <Link
          href="/donate/checkout"
          className="bg-blue-700 dark:bg-blue-600 text-white px-8 py-4 rounded-xl font-extrabold text-lg hover:bg-blue-800 dark:hover:bg-blue-700 transition shadow-lg"
        >
          DONATE NOW
        </Link>
      </section>
    </main>
  );
}
 