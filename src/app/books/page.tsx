import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Search from "@/components/Search";
import { borrowBook, deleteBook, returnBook } from "./actions";
import Link from "next/link";
import { Suspense } from "react";
import SkeletonCard from "@/components/SkeletonCard";
import { Session } from "next-auth";

// 1. Définition des interfaces pour le typage strict (Séance 3)
interface BookListProps {
  query: string;
  session: Session | null;
  userInDb: {
    id: string;
    role: string;
    email: string | null;
  } | null;
  isAdmin: boolean;
}

export default async function BooksPage({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string }>;
}) {
  // Récupération des paramètres et de la session
  const query = (await searchParams)?.query || "";
  const session = await auth();
  
  const userInDb = await prisma.user.findUnique({
    where: { email: session?.user?.email || "" },
    select: { id: true, role: true, email: true }
  });

  const isAdmin = userInDb?.role === "ADMIN";

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white min-h-screen">
      {/* Header de la page */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Bibliothèque</h1>
          <p className="text-slate-500 mt-1 italic">Recherche et gestion des ouvrages</p>
        </div>
        
        {isAdmin && (
          <Link 
            href="/books/add" 
            className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
          >
            + Ajouter un livre
          </Link>
        )}
      </div>

      {/* Barre de recherche (Client Component) */}
      <Search />

      {/* Zone de chargement progressive (Streaming SSR - Séance 2) */}
      <Suspense key={query} fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      }>
        <BookList 
          query={query} 
          session={session} 
          userInDb={userInDb} 
          isAdmin={isAdmin} 
        />
      </Suspense>
    </div>
  );
}

// 2. Composant de liste (Server Component asynchrone)
async function BookList({ query, session, userInDb, isAdmin }: BookListProps) {
  // Simulation d'un léger délai pour voir le skeleton (optionnel en prod)
  // await new Promise((resolve) => setTimeout(resolve, 1000));

  const books = await prisma.book.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { author: { contains: query, mode: "insensitive" } },
      ],
    },
    include: { category: true },
    orderBy: { title: 'asc' }
  });

  if (books.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
        <p className="text-slate-400 font-medium italic">
          {query ? `Aucun livre trouvé pour "${query}"` : "La bibliothèque est vide."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {books.map((book) => (
        <div key={book.id} className="group border border-slate-100 rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-blue-100 transition-all bg-white">
          <div>
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full uppercase tracking-widest">
                {book.category?.name || "Général"}
              </span>
              {book.borrowerId && (
                <span className="text-[10px] font-black bg-amber-100 text-amber-600 px-2.5 py-1 rounded-full uppercase tracking-widest">
                  Indisponible
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              {book.title}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              par <span className="font-medium text-slate-700">{book.author}</span>
            </p>
          </div>

          <div className="mt-8 space-y-3">
            {!book.borrowerId ? (
              session ? (
                <form action={async () => { "use server"; await borrowBook(book.id); }}>
                  <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100">
                    Emprunter
                  </button>
                </form>
              ) : (
                <Link 
                  href="/login" 
                  className="block w-full bg-slate-100 text-slate-600 py-3 rounded-2xl font-bold text-center hover:bg-slate-200 transition-all border border-slate-200 text-sm"
                >
                  Se connecter pour emprunter
                </Link>
              )
            ) : (
              <div className="space-y-2">
                <div className="w-full bg-slate-50 text-slate-400 py-3 rounded-2xl font-bold text-center text-sm border border-slate-100">
                  Déjà emprunté
                </div>
                
                {(isAdmin || userInDb?.id === book.borrowerId) && (
                  <form action={async () => { "use server"; await returnBook(book.id); }}>
                    <button type="submit" className="w-full border-2 border-orange-500 text-orange-600 py-2.5 rounded-2xl font-bold hover:bg-orange-50 transition-all text-sm">
                      Rendre le livre
                    </button>
                  </form>
                )}
              </div>
            )}

            {isAdmin && (
              <form action={deleteBook} className="pt-4 border-t border-slate-50 mt-2">
                <input type="hidden" name="bookId" value={book.id} />
                <button type="submit" className="w-full text-red-400 text-xs font-bold hover:text-red-600 transition-colors hover:underline">
                  Supprimer du catalogue
                </button>
              </form>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}