import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import MembershipDropdown from "@/components/MembershipDropdown";
import TicketPriceEditor from "@/components/TicketPriceEditor";
import AnimalManager from "@/components/AnimalManager";
import SignOutButton from "@/components/SignOutButton";

interface AdminPageProps {
  params: { id: string };
}

export const dynamic = "force-dynamic"; // Ensure this page is always fresh

export default async function AdminPage(props: AdminPageProps) {
  const id = props.params.id; // ✅ correct access

  const admin = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      profileImage: true,
      membership: true,
      isAdmin: true,
    },
  });

  if (!admin) {
    return (
      <p className="text-center mt-10 text-red-600 dark:text-red-400 font-semibold">
        Admin not found
      </p>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Navbar />

      {/* Profile Section */}
      <section className="max-w-sm mx-auto mt-6 bg-gray-100 dark:bg-gray-800 rounded shadow-md p-6 flex flex-col items-center">
        <img
          src={admin.profileImage || "/default.png"}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover shadow-md mb-4"
        />

        <MembershipDropdown currentMembership={admin.membership} userId={admin.id} />

        <h1 className="text-3xl font-bold mb-1 text-gray-800 dark:text-gray-100 text-center mt-4">
          {admin.name}'s Admin Dashboard
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-4 text-center">{admin.email}</p>

        <SignOutButton />
      </section>

      {/* Admin Section */}
      <section className="max-w-6xl mx-auto mt-10 px-6 py-8 bg-gray-100 dark:bg-gray-800 shadow-md rounded transition-colors grid grid-cols-1 md:grid-cols-2 gap-6">
        <TicketPriceEditor />
        <AnimalManager />
      </section>
    </main>
  );
}
