import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import Providers from "@/components/Providers";
import '@/app/globals.css';

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <Providers>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <main className="flex-grow p-8 md:p-12 max-w-7xl mx-auto overflow-y-auto h-screen">
          {children}
        </main>
      </div>
    </Providers>
  );
}
