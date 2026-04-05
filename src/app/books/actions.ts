"use server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

// Définition du schéma Zod pour la validation (Séance 3 & 4)
const BookSchema = z.object({
  title: z.string().min(2, "Le titre est trop court"),
  author: z.string().min(2, "L'auteur est requis"),
  categoryId: z.string().min(1, "Catégorie requise"),
})

// ACTION : EMPRUNTER
export async function borrowBook(bookId: string) {
  const session = await auth()
  if (!session?.user?.email) redirect("/login")

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) throw new Error("Utilisateur non trouvé")

  await prisma.book.update({
    where: { id: bookId },
    data: { borrowerId: user.id }
  })

  revalidatePath("/books")
}

// ACTION : RENDRE
export async function returnBook(bookId: string) {
  await prisma.book.update({
    where: { id: bookId },
    data: { borrowerId: null }
  })
  revalidatePath("/books")
}

// ACTION : SUPPRIMER
export async function deleteBook(formData: FormData) {
  const bookId = formData.get("bookId") as string
  if (!bookId) return

  await prisma.book.delete({ where: { id: bookId } })
  revalidatePath("/books")
}

// ACTION : CRÉER (Avec Zod)
export async function createBook(formData: FormData) {
  const validatedFields = BookSchema.safeParse({
    title: formData.get("title"),
    author: formData.get("author"),
    categoryId: formData.get("categoryId"),
  })

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors }
  }

  await prisma.book.create({
    data: validatedFields.data
  })

  revalidatePath("/books")
  redirect("/books")
}