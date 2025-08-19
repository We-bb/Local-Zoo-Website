// UserPage.tsx (Server Component)
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import SignOutButton from "@/components/SignOutButton";

interface UserPageProps {
  params: { id: string };
}

export default async function UserPage({ params }: UserPageProps) {
  const id = params.id;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      profileImage: true,
      membership: true,
      isAdmin: true,
      tickets: true,
    },
  });

  if (!user) {
    return (
      <p className="text-center mt-10 text-red-600 dark:text-red-400 font-semibold">
        User not found
      </p>
    );
  }

  const membershipColors: Record<string, string> = {
    guest: "bg-gray-400 text-white",
    basic: "bg-blue-500 text-white",
    plus: "bg-green-500 text-white",
    pro: "bg-yellow-400 text-black",
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Navbar /> {/* Client Component */}

      {/* Profile Section */}
      <section className="max-w-sm mx-auto mt-6 bg-gray-100 dark:bg-gray-800 rounded shadow-md transition-colors p-6 flex flex-col items-center">
        <img
          src={user.profileImage || "/default.png"}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover shadow-md mb-4"
        />

        <div
          className={`px-4 py-1 rounded-full text-sm font-semibold mb-2 ${
            membershipColors[user.membership?.toLowerCase() || "guest"]
          }`}
        >
          {(user.membership?.charAt(0).toUpperCase() + user.membership?.slice(1) || "Guest")} Membership
        </div>

        <h1 className="text-3xl font-bold mb-1 text-gray-800 dark:text-gray-100 text-center">
          {user.name}'s Account
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-4 text-center">{user.email}</p>

        <SignOutButton /> {/* Client Component */}
      </section>

      {/* Tickets Section */}
      <section className="max-w-5xl mx-auto mt-10 px-6 py-8 bg-gray-100 dark:bg-gray-800 shadow-md rounded transition-colors">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-100">
          Tickets
        </h2>
        {user.tickets.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {user.tickets.map((ticket) => (
              <li
                key={ticket.date.toISOString()}
                className="border border-gray-300 dark:border-gray-700 rounded-lg shadow hover:shadow-lg transition p-4 w-64 bg-white dark:bg-gray-700"
              >
                <p className="font-semibold text-gray-900 dark:text-gray-100">{ticket.ticketType}</p>
                <p className="text-gray-700 dark:text-gray-300">Quantity: {ticket.quantity}</p>
                <p className="text-gray-600 dark:text-gray-400">Date: {new Date(ticket.date).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-700 dark:text-gray-300 font-medium">
            No tickets purchased.
          </p>
        )}
      </section>
    </main>
  );
}
