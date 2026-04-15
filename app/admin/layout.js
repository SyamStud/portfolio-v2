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
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&family=DM+Mono:wght@400;500&display=swap');`}</style>
      <div className="flex min-h-screen bg-[#F5F5F0]" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <AdminSidebar />
        <main className="flex-grow p-5 md:p-10 max-w-7xl mx-auto overflow-y-auto h-screen w-full">
          {children}
        </main>
      </div>
    </Providers>
  );
}
