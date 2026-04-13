import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google"; // Optimisation des polices (Séance 4)
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Digital Library | Gestion Pro",
  description: "Plateforme de gestion de bibliothèque",
};

export default function RootLayout({
  
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased`}>
        {/* Barre de navigation simplifiée pour le moment */}
        <Navbar />

        <main className="container mx-auto min-h-[calc(100vh-64px)] p-6">
          {children}
        </main>

    
      </body>
    </html>
  );
}