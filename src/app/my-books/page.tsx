import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { returnBook } from "../books/actions"

export default async function MyBooksPage() {
  const session = await auth()
  
  if (!session?.user?.email) {
    return <div className="p-8 text-center">Veuillez vous connecter pour voir vos emprunts.</div>
  }

  // Récupérer l'utilisateur pour avoir son ID
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  // Récupérer uniquement ses livres
  const myBooks = await prisma.book.findMany({
    where: { borrowerId: user?.id },
    include: { category: true }
  })

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Mes Livres Empruntés</h1>
      
      {myBooks.length === 0 ? (
        <p className="text-gray-500">Vous n avez aucun livre en cours d emprunt.</p>
      ) : (
        <div className="space-y-4">
          {myBooks.map((book) => (
            <div key={book.id} className="flex justify-between items-center p-4 border rounded-xl shadow-sm">
              <div>
                <h2 className="font-bold text-lg">{book.title}</h2>
                <p className="text-sm text-gray-500">{book.author}</p>
              </div>
              <form action={async () => { "use server"; await returnBook(book.id); }}>
                <button className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-600 transition-all">
                  Rendre
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}