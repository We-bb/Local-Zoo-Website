// components/SignOutButton.tsx
"use client";

import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    router.push("/login");
  };

  return (
    <button
      onClick={handleSignOut}
      className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold transition"
    >
      Sign Out
    </button>
  );
}
