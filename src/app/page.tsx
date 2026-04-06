import { auth } from "@/auth";
import Link from "next/link";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      {/* En-tête de section */}
      <div className="border-b border-slate-200 pb-8 mb-12">
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
          Système de Gestion Bibliothécaire
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Portail d accès aux ressources numériques et au suivi des comptes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Section Navigation */}
        <section>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
            Accès aux modules
          </h2>
          <div className="space-y-3">
            <Link 
              href="/books" 
              className="group flex justify-between items-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <span className="font-medium text-slate-700">Catalogue général</span>
              <span className="text-slate-300 group-hover:text-blue-600">→</span>
            </Link>
            
            <Link 
              href="/my-books" 
              className="group flex justify-between items-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <span className="font-medium text-slate-700">Mes emprunts</span>
              <span className="text-slate-300 group-hover:text-blue-600">→</span>
            </Link>

            {session?.user?.role === "ADMIN" && (
              <Link 
                href="/admin/borrows" 
                className="group flex justify-between items-center p-4 border border-blue-100 bg-blue-50/30 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <span className="font-medium text-blue-700">Administration des flux</span>
                <span className="text-blue-300 group-hover:text-blue-600">→</span>
              </Link>
            )}
          </div>
        </section>

        {/* Section Authentification */}
        <section>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
            État de la session
          </h2>
          <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
            {session ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Utilisateur identifié</p>
                  <p className="text-sm font-bold text-slate-900">{session.user?.email}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Privilèges système</p>
                  <span className="inline-block px-2 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-bold rounded uppercase">
                    {session.user?.role}
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-4 text-center">
                <p className="text-sm text-slate-500 mb-6">Aucune session active détectée.</p>
                <Link 
                  href="/login" 
                  className="inline-block w-full py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-md hover:bg-slate-800 transition-colors"
                >
                  S identifier
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Informations de build (Prouve le travail technique) */}
      <div className="mt-24 pt-8 border-t border-slate-100 flex justify-between items-center">
        <p className="text-[10px] text-slate-400 font-medium">
          ISITCOM - MASTER SWM - 2024/2025
        </p>
        <div className="flex gap-4">
          <span className="text-[10px] text-slate-300">Next.js 15.0</span>
          <span className="text-[10px] text-slate-300">Prisma ORM</span>
          <span className="text-[10px] text-slate-300">NextAuth v5</span>
        </div>
      </div>
    </div>
  );
}