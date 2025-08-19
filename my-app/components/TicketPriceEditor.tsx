// components/TicketPriceEditor.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface TicketPrices {
  CHILD: number;
  ADULT: number;
  SENIOR: number;
}

export default function TicketPriceEditor() {
  const [prices, setPrices] = useState<TicketPrices>({ CHILD: 0, ADULT: 0, SENIOR: 0 });

  useEffect(() => {
    // Load current ticket prices
    axios.get("/api/tickets/prices").then((res) => setPrices(res.data));
  }, []);

  const handleEdit = async (type: keyof TicketPrices) => {
    const newPrice = prompt(`Enter new price for ${type}`, prices[type].toString());
    if (!newPrice) return;

    const updatedPrice = parseFloat(newPrice);
    if (isNaN(updatedPrice)) return alert("Invalid number");

    setPrices((prev) => ({ ...prev, [type]: updatedPrice }));
    await axios.put(`/api/tickets/prices`, { type, price: updatedPrice });
  };

  return (
    <div className="bg-gray-200 dark:bg-gray-700 rounded p-4">
      <h2 className="text-xl font-semibold mb-4">Ticket Prices</h2>
      <ul className="space-y-2">
        {(Object.keys(prices) as (keyof TicketPrices)[]).map((type) => (
          <li key={type} className="flex justify-between items-center bg-white dark:bg-gray-800 p-2 rounded">
            <span>{type}</span>
            <div className="flex items-center gap-2">
              <span>${prices[type]}</span>
              <button
                onClick={() => handleEdit(type)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
              >
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
