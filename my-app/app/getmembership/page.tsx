"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

const membershipColors: Record<string, string> = {
  GUEST: "bg-gray-400 text-white",
  BASIC: "bg-blue-500 text-white",
  PLUS: "bg-green-500 text-white",
  PRO: "bg-yellow-400 text-black",
};

const membershipPrices: Record<string, number> = {
  BASIC: 10,
  PLUS: 20,
  PRO: 30,
};

export default function GetMembershipPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selected, setSelected] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userJson = localStorage.getItem("currentUser");
    if (userJson) {
      const user = JSON.parse(userJson);
      setCurrentUser(user);
      setSelected(user.membership || "GUEST");
    }
  }, []);

  if (!currentUser) {
    return (
      <main className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-red-600 text-lg">Please log in to upgrade membership</p>
        </div>
      </main>
    );
  }

  const handlePurchase = async (membership: string) => {
    setSelected(membership);
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${currentUser.id}/membership`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ membership }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error);
        setSelected(currentUser.membership);
      } else {
        const data = await res.json();
        setCurrentUser({ ...currentUser, membership: data.membership });
        localStorage.setItem("currentUser", JSON.stringify({ ...currentUser, membership: data.membership }));
        alert(`Membership upgraded to ${data.membership}`);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update membership");
      setSelected(currentUser.membership);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors flex flex-col">
      <Navbar />

      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-extrabold mb-8 text-gray-800 dark:text-gray-100 text-center">
          Choose Your Membership
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
          {["BASIC", "PLUS", "PRO"].map((m) => (
            <div
              key={m}
              className={`p-6 rounded shadow-md flex flex-col items-center transition hover:shadow-lg ${membershipColors[m]}`}
            >
              <h2 className="text-xl font-bold mb-2">{m}</h2>
              <p className="text-gray-800 dark:text-gray-100 mb-4">${membershipPrices[m]}</p>
              <button
                disabled={selected === m || loading}
                onClick={() => handlePurchase(m)}
                className={`px-4 py-2 rounded font-semibold w-32 text-center ${
                  selected === m
                    ? "opacity-50 cursor-not-allowed bg-white text-black"
                    : "bg-white text-black hover:bg-gray-200 transition"
                }`}
              >
                {selected === m ? "Selected" : "Purchase"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
