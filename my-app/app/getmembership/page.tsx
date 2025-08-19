// components/MembershipBadgeDropdown.tsx
"use client";

import { useState } from "react";
import axios from "axios";

const membershipColors: Record<string, string> = {
  GUEST: "bg-gray-400 text-white",
  BASIC: "bg-blue-500 text-white",
  PLUS: "bg-green-500 text-white",
  PRO: "bg-yellow-400 text-black",
};

interface Props {
  currentMembership: string;
  userId: string;
}

export default function MembershipBadgeDropdown({ currentMembership, userId }: Props) {
  const [membership, setMembership] = useState(currentMembership);
  const [open, setOpen] = useState(false);

  const handleChange = async (newMembership: string) => {
    setMembership(newMembership); // update badge immediately
    setOpen(false);

    try {
      // Send update to your API route
      await axios.put(`/api/users/${userId}/membership`, { membership: newMembership });
    } catch (err) {
      console.error("Failed to update membership:", err);
      // Optionally reset to previous membership if it fails
    }
  };

  return (
    <div className="relative">
      {/* Badge button */}
      <button
        onClick={() => setOpen(!open)}
        className={`px-4 py-1 rounded-full text-sm font-semibold ${membershipColors[membership]} transition`}
      >
        {membership.charAt(0) + membership.slice(1).toLowerCase()} Membership
      </button>

      {/* Dropdown menu */}
      {open && (
        <ul className="absolute top-full mt-1 w-max bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-md z-10">
          {Object.keys(membershipColors).map((m) => (
            <li key={m}>
              <button
                onClick={() => handleChange(m)}
                className={`w-full text-left px-4 py-2 text-sm font-semibold ${membershipColors[m]} hover:opacity-80`}
              >
                {m.charAt(0) + m.slice(1).toLowerCase()}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
