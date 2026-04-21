import { Inter } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import { LanguageProvider } from "@/components/LanguageContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Syam Chaidayatullah",
  description: "Syam's Portfolio",
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value || "en";

  return (
    <html lang={lang}>
      <body className={`${inter.variable} bg-gray-50 text-gray-900 antialiased font-sans`}>
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <LanguageProvider initialLang={lang}>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
