import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { returnBook } from "../../books/actions"
import { redirect } from "next/navigation"

export default async function AdminBorrowsPage() {
  const session = await auth()
  
  const userInDb = await prisma.user.findUnique({
    where: { email: session?.user?.email || "" }
  })

  // Sécurité : akhaw l'ADMIN accède à cette vue globale
  if (userInDb?.role !== "ADMIN") {
    redirect("/books")
  }

  const borrowedBooks = await prisma.book.findMany({
    where: { NOT: { borrowerId: null } },
    include: { 
      borrower: true,
      category: true 
    }
  })

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Suivi des Emprunts </h1>

      <div className="overflow-x-auto bg-white rounded-2xl border shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b">
              <th className="p-4 font-bold text-slate-700">Livre</th>
              <th className="p-4 font-bold text-slate-700">Emprunteur</th>
              <th className="p-4 font-bold text-slate-700">Email</th>
              <th className="p-4 font-bold text-slate-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {borrowedBooks.map((book) => (
              <tr key={book.id} className="border-b hover:bg-slate-50 transition-colors">
                <td className="p-4 font-medium text-slate-900">{book.title}</td>
                

                <td className="p-4 text-slate-600">
                  {book.borrower?.name || "Inconnu"}
                  {book.borrowerId === userInDb?.id && (
                    <span className="ml-2 text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase">
                      Moi
                    </span>
                  )}
                </td>
                {/* ------------------------------------ */}

                <td className="p-4 text-slate-500 text-sm">{book.borrower?.email}</td>
                <td className="p-4">
                  <form action={async () => { "use server"; await returnBook(book.id); }}>
                    <button className="text-xs font-bold border border-orange-200 text-orange-600 px-3 py-1.5 rounded-lg hover:bg-orange-50 transition-all">
                      Forcer le retour
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {borrowedBooks.length === 0 && (
          <p className="p-10 text-center text-slate-400 italic">Aucun livre n est actuellement dehors.</p>
        )}
      </div>
    </div>
  )
}