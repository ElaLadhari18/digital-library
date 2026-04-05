import Link from "next/link";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function Navbar() {
  const session = await auth();
  
  // Récupération des infos utilisateur en base pour le rôle
  const userInDb = await prisma.user.findUnique({
    where: { email: session?.user?.email || "" }
  });

  const isAdmin = userInDb?.role === "ADMIN";

  return (
    <nav className="bg-white border-b border-slate-100 py-4 px-8 mb-8 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        
        {/* LOGO */}
        <Link href="/books" className="text-xl font-black text-blue-600 tracking-tighter">
          DIGITAL<span className="text-slate-900">LIBRARY</span>
        </Link>

        {/* LIENS DE NAVIGATION */}
        <div className="flex items-center gap-6">
          <Link href="/books" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
            Catalogue
          </Link>

          {session && (
            <Link href="/my-books" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
              Mes Emprunts
            </Link>
          )}

          {/* LIENS ADMIN (Conditionnels) */}
          {isAdmin && (
            <div className="flex items-center gap-6 border-l pl-6 border-slate-200">
              <Link href="/admin/borrows" className="text-sm font-bold text-amber-600 hover:text-amber-700">
                Gestion Emprunts
              </Link>
            </div>
          )}
        </div>

        {/* ESPACE UTILISATEUR / LOGIN */}
        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              {/* Affichage Nom + Email + Badge Rôle */}
              <div className="flex flex-col items-end leading-tight hidden md:flex">
                <span className="text-sm font-bold text-slate-900">
                  {session.user?.name || "Utilisateur"}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-medium">
                    {session.user?.email}
                  </span>
                  
                  {/* BADGE DE RÔLE DYNAMIQUE */}
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter border ${
                    isAdmin 
                      ? "bg-amber-100 text-amber-700 border-amber-200" 
                      : "bg-slate-100 text-slate-600 border-slate-200"
                  }`}>
                    {userInDb?.role || "USER"}
                  </span>
                </div>
              </div>

              {/* BOUTON DÉCONNEXION */}
              <form action={async () => { "use server"; await signOut(); }}>
                <button className="text-sm font-bold text-red-500 hover:bg-red-50 px-3 py-2 rounded-xl transition-all border border-transparent hover:border-red-100">
                  Quitter
                </button>
              </form>
            </div>
          ) : (
            <Link href="/login" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-blue-700 transition-all">
              Connexion
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}