"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FaUserCircle,
  FaHome,
  FaTicketAlt,
  FaIdCard,
  FaDonate,
  FaSearch,
} from "react-icons/fa";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("currentUser");
    if (token && user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  return (
    <nav className="bg-blue-700 dark:bg-blue-900 text-white px-6 py-4 shadow-md">
      <div className="flex items-center justify-between">
        {/* Left side - Calgary Zoo */}
        <h1 className="text-3xl font-extrabold text-white dark:text-white">
          Calgary Zoo
        </h1>

        {/* Right side - Icons */}
        <div className="flex items-center space-x-6">
          <Link href="/" title="Home" className="hover:text-gray-300">
            <FaHome size={20} />
          </Link>
          <Link href="/gettickets" title="Book Tickets" className="hover:text-gray-300">
            <FaTicketAlt size={20} />
          </Link>
          <Link href="/getmembership" title="Membership" className="hover:text-gray-300">
            <FaIdCard size={20} />
          </Link>
          <Link href="/donate" title="Donate" className="hover:text-gray-300">
            <FaDonate size={20} />
          </Link>

          {/* Search */}
          <div className="relative">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="hover:text-gray-300 transition"
              title="Search"
            >
              <FaSearch size={20} />
            </button>
            {showSearch && (
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="absolute top-8 right-0 w-48 px-3 py-1 rounded text-black dark:text-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 transition"
              />
            )}
          </div>

          {/* Account / Login */}
          <Link
            href={
              currentUser
                ? currentUser.isAdmin
                  ? `/admin/${currentUser.id}`
                  : `/user/${currentUser.id}`
                : "/login"
            }
            className="p-2 rounded-full bg-white text-blue-700 dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            title={currentUser ? "Account" : "Login"}
          >
            <FaUserCircle size={24} />
          </Link>
        </div>
      </div>
    </nav>
  );
}