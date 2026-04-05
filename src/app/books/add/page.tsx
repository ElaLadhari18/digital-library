import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import AddBookForm from "@/components/AddBookForm"
import Link from "next/link"

export default async function AddBookPage() {
  const session = await auth()
  
  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email || "" }
  })

  // Sécurité RBAC
  if (user?.role !== "ADMIN") {
    redirect("/books")
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  })

  return (
    /* Suppression du bg-slate-50 ici pour un fond blanc pur */
    <div className="max-w-2xl mx-auto p-8 min-h-screen bg-white">
      <div className="mb-10">
        <Link href="/books" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
          ← Retour à la bibliothèque
        </Link>
        <h1 className="text-4xl font-black text-slate-900 mt-6 tracking-tight">Nouvel Ouvrage</h1>
        <p className="text-slate-500 mt-2 italic border-l-4 border-blue-500 pl-4">
          Enrichissez le catalogue de la bibliothèque numérique.
        </p>
      </div>

      {/* Le formulaire est maintenant sur fond blanc avec une ombre légère */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50">
        <AddBookForm categories={categories} />
      </div>
    </div>
  )
}