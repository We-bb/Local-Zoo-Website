"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const ticketTypes = ["CHILD", "ADULT", "SENIOR"] as const;
type TicketType = typeof ticketTypes[number];

export default function GetTicketsPage() {
  const router = useRouter();

  const [quantities, setQuantities] = useState<Record<TicketType, number>>({
    CHILD: 0,
    ADULT: 0,
    SENIOR: 0,
  });

  const [prices, setPrices] = useState<Record<TicketType, number>>({
    CHILD: 0,
    ADULT: 0,
    SENIOR: 0,
  });

  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  const currentUser = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("currentUser") || "{}") : null;

  useEffect(() => {
    fetch("/api/tickets/prices")
      .then((res) => res.json())
      .then(setPrices)
      .catch(console.error);
  }, []);

  const handleChange = (type: TicketType, value: number) => {
    setQuantities({ ...quantities, [type]: value });
  };

  const handleBookTickets = async () => {
    if (!currentUser?.id) return alert("You must be logged in");
    if (!date) return alert("Please select a date");

    const totalTickets = Object.values(quantities).reduce((a, b) => a + b, 0);
    if (totalTickets === 0) return alert("Please select at least one ticket");

    setLoading(true);
    try {
      const res = await fetch("/api/users/book-tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, quantities, userId: currentUser.id }),
      });

      if (res.ok) {
        alert("Tickets booked successfully!");
        router.refresh();
      } else {
        const err = await res.json();
        alert("Error: " + err.error);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to book tickets");
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = Object.entries(quantities).reduce(
    (sum, [type, qty]) => sum + qty * (prices[type as TicketType] || 0),
    0
  );

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors flex flex-col">
      <Navbar />

      <div className="flex flex-col items-center justify-center flex-1 p-6">
        <h1 className="text-3xl font-extrabold mb-8 text-gray-800 dark:text-gray-100">
          Book Tickets
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 w-full max-w-3xl">
          {ticketTypes.map((type) => (
            <div
              key={type}
              className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow p-6 flex flex-col items-center transition hover:shadow-lg"
            >
              <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">{type}</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-2">${prices[type]}</p>
              <input
                type="number"
                min={0}
                value={quantities[type]}
                onChange={(e) => handleChange(type, parseInt(e.target.value) || 0)}
                className="w-20 text-center border rounded p-1 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
              />
            </div>
          ))}
        </div>

        <div className="mb-6 w-full max-w-3xl flex flex-col items-center">
          <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-100">
            Select Date:
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded w-full max-w-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
          />
        </div>

        <div className="mb-6 text-xl font-bold text-gray-800 dark:text-gray-100">
          Total Price: ${totalPrice}
        </div>

        <button
          onClick={handleBookTickets}
          disabled={loading || totalPrice === 0}
          className="bg-blue-700 dark:bg-blue-600 text-white px-6 py-3 rounded font-extrabold hover:bg-blue-800 dark:hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Booking..." : "Book Tickets"}
        </button>
      </div>
    </main>
  );
}
